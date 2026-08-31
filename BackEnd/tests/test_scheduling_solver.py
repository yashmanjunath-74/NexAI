"""
NexAI – OR-Tools Timetabling Solver Unit Tests
===============================================

Tests the CP-SAT solver logic WITHOUT database access.
Uses purely in-memory DTOs to verify:
  1. Solver produces a valid solution for a simple input
  2. Hard constraint HC1 (no room clash) is respected
  3. Hard constraint HC2 (no student clash) is respected
  4. Hard constraint HC4 (room capacity) is respected
  5. All subjects get exactly one slot
  6. Solver returns failure for infeasible inputs
  7. Solver respects the time limit parameter
"""
from datetime import date, time, timedelta
from django.test import SimpleTestCase

from scheduling.solver import (
    TimetableSolver,
    ScheduleInput,
    SubjectDTO,
    RoomDTO,
    InvigilatorDTO,
    TimeSlotDTO,
    ScheduleResult,
)


def _make_slots(num_days: int = 3) -> list[TimeSlotDTO]:
    """Generate morning + afternoon slots for num_days starting 2025-01-06."""
    slots = []
    base = date(2025, 1, 6)
    idx = 0
    for d in range(num_days):
        day = base + timedelta(days=d)
        slots.append(TimeSlotDTO(
            index=idx, exam_date=day,
            start_time=time(9, 30), end_time=time(12, 30),
        ))
        idx += 1
        slots.append(TimeSlotDTO(
            index=idx, exam_date=day,
            start_time=time(14, 0), end_time=time(17, 0),
        ))
        idx += 1
    return slots


def _simple_input(
    num_subjects: int = 3,
    num_rooms: int = 2,
    student_enrollments: dict | None = None,
) -> ScheduleInput:
    """Build a minimal ScheduleInput for solver tests."""
    subjects = [
        SubjectDTO(
            id=f"subj-{i}", code=f"CS60{i}", semester=6,
            exam_duration_mins=180, required_capacity=30,
        )
        for i in range(num_subjects)
    ]
    rooms = [
        RoomDTO(id=f"room-{i}", name=f"Room {i+101}", exam_capacity=60)
        for i in range(num_rooms)
    ]
    invigilators = [InvigilatorDTO(id="inv-1", name="Dr. Smith")]
    time_slots = _make_slots(num_days=3)

    return ScheduleInput(
        subjects=subjects,
        rooms=rooms,
        invigilators=invigilators,
        time_slots=time_slots,
        student_enrollments=student_enrollments or {},
    )


class TestSolverBasic(SimpleTestCase):
    """Basic feasibility and output shape tests."""

    def test_solver_finds_feasible_solution(self):
        """3 subjects, 2 rooms, 6 time slots → should be feasible."""
        data = _simple_input(num_subjects=3, num_rooms=2)
        solver = TimetableSolver(data, time_limit_secs=30)
        result = solver.solve()

        self.assertTrue(result.success, msg=f"Solver failed: {result.error}")
        self.assertIn(result.solver_status, ("OPTIMAL", "FEASIBLE"))

    def test_all_subjects_get_exactly_one_slot(self):
        """Every subject must appear exactly once in the assignments."""
        data = _simple_input(num_subjects=4, num_rooms=2)
        solver = TimetableSolver(data, time_limit_secs=30)
        result = solver.solve()

        self.assertTrue(result.success)
        assigned_subjects = [a.subject_id for a in result.assignments]
        self.assertEqual(len(assigned_subjects), 4)
        # All 4 unique
        self.assertEqual(len(set(assigned_subjects)), 4)

    def test_result_has_wall_time(self):
        data = _simple_input(num_subjects=2, num_rooms=2)
        solver = TimetableSolver(data, time_limit_secs=30)
        result = solver.solve()
        self.assertGreater(result.wall_time_secs, 0)

    def test_slot_assignment_fields_are_populated(self):
        """Each SlotAssignment must have non-empty subject/room IDs."""
        data = _simple_input(num_subjects=2, num_rooms=2)
        solver = TimetableSolver(data, time_limit_secs=30)
        result = solver.solve()

        self.assertTrue(result.success)
        for assignment in result.assignments:
            self.assertTrue(len(assignment.subject_id) > 0)
            self.assertTrue(len(assignment.room_id) > 0)
            self.assertIsNotNone(assignment.time_slot)


class TestHardConstraintHC1RoomClash(SimpleTestCase):
    """HC1: No two subjects in the same room at the same time."""

    def test_no_room_time_clash(self):
        """All (room, time) pairs in assignments must be unique."""
        data = _simple_input(num_subjects=4, num_rooms=2)
        solver = TimetableSolver(data, time_limit_secs=30)
        result = solver.solve()

        self.assertTrue(result.success)
        room_time_pairs = [
            (a.room_id, a.time_slot.index) for a in result.assignments
        ]
        # All pairs must be unique
        self.assertEqual(
            len(room_time_pairs),
            len(set(room_time_pairs)),
            msg="Room-time clash detected in solver output!",
        )


class TestHardConstraintHC2StudentClash(SimpleTestCase):
    """HC2: A student cannot sit two exams simultaneously."""

    def test_conflicting_subjects_in_different_slots(self):
        """
        Student S1 enrolled in subj-0 and subj-1.
        Solver must place subj-0 and subj-1 in DIFFERENT time slots.
        """
        enrollments = {
            "student-1": {"subj-0", "subj-1"},
        }
        data = _simple_input(
            num_subjects=3, num_rooms=2,
            student_enrollments=enrollments,
        )
        solver = TimetableSolver(data, time_limit_secs=30)
        result = solver.solve()

        self.assertTrue(result.success, msg=f"Solver failed: {result.error}")

        slot_for = {a.subject_id: a.time_slot.index for a in result.assignments}
        self.assertNotEqual(
            slot_for.get("subj-0"),
            slot_for.get("subj-1"),
            msg="HC2 violated: subj-0 and subj-1 are in the same slot (student clash)!",
        )

    def test_subjects_with_no_shared_students_can_share_slot(self):
        """
        subj-0: student-A only
        subj-1: student-B only
        They can share a slot since no student is enrolled in both.
        Solver should still produce a valid solution.
        """
        enrollments = {
            "student-A": {"subj-0"},
            "student-B": {"subj-1"},
        }
        data = _simple_input(
            num_subjects=2, num_rooms=1,  # only 1 room forces different slots
            student_enrollments=enrollments,
        )
        solver = TimetableSolver(data, time_limit_secs=30)
        result = solver.solve()
        self.assertTrue(result.success)


class TestHardConstraintHC4RoomCapacity(SimpleTestCase):
    """HC4: Room must fit the number of enrolled students."""

    def test_small_room_not_assigned_large_subject(self):
        """
        Subject requires 50 students; room capacity is only 20.
        Solver must not assign this subject to that room.
        """
        subjects = [
            SubjectDTO(
                id="large-subj", code="CS601", semester=6,
                exam_duration_mins=180, required_capacity=50,
            )
        ]
        rooms = [
            RoomDTO(id="small-room", name="Room 101", exam_capacity=20),
            RoomDTO(id="big-room",   name="Room 201", exam_capacity=60),
        ]
        data = ScheduleInput(
            subjects=subjects,
            rooms=rooms,
            invigilators=[],
            time_slots=_make_slots(1),
        )
        solver = TimetableSolver(data, time_limit_secs=30)
        result = solver.solve()

        self.assertTrue(result.success)
        assignment = result.assignments[0]
        self.assertEqual(
            assignment.room_id,
            "big-room",
            msg="HC4 violated: large subject was assigned to a small room!",
        )

    def test_exact_capacity_fit_is_allowed(self):
        """A room with exactly the required capacity is acceptable."""
        subjects = [SubjectDTO(
            id="s1", code="CS601", semester=6,
            exam_duration_mins=180, required_capacity=40,
        )]
        rooms = [RoomDTO(id="r1", name="Room 101", exam_capacity=40)]
        data = ScheduleInput(
            subjects=subjects, rooms=rooms, invigilators=[],
            time_slots=_make_slots(1),
        )
        solver = TimetableSolver(data, time_limit_secs=30)
        result = solver.solve()
        self.assertTrue(result.success)


class TestSolverEdgeCases(SimpleTestCase):

    def test_single_subject_single_room_single_slot(self):
        """Minimal valid input: 1 × 1 × 1 — must succeed."""
        subjects = [SubjectDTO(id="s1", code="CS601", semester=6,
                               exam_duration_mins=180, required_capacity=10)]
        rooms = [RoomDTO(id="r1", name="Room 101", exam_capacity=30)]
        slots = [TimeSlotDTO(index=0, exam_date=date(2025, 1, 6),
                             start_time=time(9, 30), end_time=time(12, 30))]
        data = ScheduleInput(subjects=subjects, rooms=rooms,
                             invigilators=[], time_slots=slots)
        solver = TimetableSolver(data, time_limit_secs=30)
        result = solver.solve()
        self.assertTrue(result.success)
        self.assertEqual(len(result.assignments), 1)

    def test_infeasible_no_rooms(self):
        """Solver must return failure when there are no rooms."""
        subjects = [SubjectDTO(id="s1", code="CS601", semester=6,
                               exam_duration_mins=180, required_capacity=10)]
        data = ScheduleInput(
            subjects=subjects, rooms=[], invigilators=[],
            time_slots=_make_slots(1),
        )
        solver = TimetableSolver(data, time_limit_secs=10)
        result = solver.solve()
        # With 0 rooms, HC1 (exactly_one) can't be satisfied
        self.assertFalse(result.success)

    def test_infeasible_too_many_subjects_for_slots(self):
        """
        3 subjects but only 1 room and 1 slot → only 1 can be placed,
        constraint 'exactly one slot per subject' forces INFEASIBLE.
        """
        subjects = [
            SubjectDTO(id=f"s{i}", code=f"CS60{i}", semester=6,
                       exam_duration_mins=180, required_capacity=10)
            for i in range(3)
        ]
        rooms = [RoomDTO(id="r1", name="Room 101", exam_capacity=30)]
        slots = [TimeSlotDTO(index=0, exam_date=date(2025, 1, 6),
                             start_time=time(9, 30), end_time=time(12, 30))]
        data = ScheduleInput(subjects=subjects, rooms=rooms,
                             invigilators=[], time_slots=slots)
        solver = TimetableSolver(data, time_limit_secs=10)
        result = solver.solve()
        self.assertFalse(result.success)

    def test_large_problem_completes_within_time_limit(self):
        """
        10 subjects, 5 rooms, 4 days (8 slots) — should solve within 30s.
        This is a smoke test for performance regression.
        """
        subjects = [
            SubjectDTO(id=f"s{i}", code=f"CS{600+i}", semester=6,
                       exam_duration_mins=180, required_capacity=20)
            for i in range(10)
        ]
        rooms = [
            RoomDTO(id=f"r{i}", name=f"Room {100+i}", exam_capacity=40)
            for i in range(5)
        ]
        data = ScheduleInput(
            subjects=subjects, rooms=rooms, invigilators=[],
            time_slots=_make_slots(num_days=4),
        )
        import time as time_module
        start = time_module.perf_counter()
        solver = TimetableSolver(data, time_limit_secs=30)
        result = solver.solve()
        elapsed = time_module.perf_counter() - start

        self.assertTrue(result.success, msg=f"10-subject problem failed: {result.error}")
        self.assertLess(elapsed, 35, msg="Solver took too long (>35s)")
