import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../features/invigilator/invigilator_shell.dart';
import '../../features/student/student_shell.dart';
import '../auth/auth_provider.dart';
import 'routes.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authStateProvider);

  return GoRouter(
    initialLocation: Routes.splash,
    redirect: (context, state) {
      final isLoggedIn = authState.isAuthenticated;
      final isOnAuth = state.matchedLocation == Routes.login
          || state.matchedLocation == Routes.splash;

      if (!isLoggedIn && !isOnAuth) return Routes.login;
      if (isLoggedIn && isOnAuth) {
        // Redirect to role-specific home
        final role = authState.user?.role ?? '';
        return role == 'STUDENT' ? Routes.studentHome : Routes.invigilatorHome;
      }
      return null;
    },
    routes: [
      GoRoute(path: Routes.splash, builder: (_, __) => const SplashScreen()),
      GoRoute(path: Routes.login,  builder: (_, __) => const LoginScreen()),

      // Invigilator Shell (Dashboard 4)
      ShellRoute(
        builder: (_, __, child) => InvigilatorShell(child: child),
        routes: [
          GoRoute(path: Routes.invigilatorHome, builder: (_, __) => const ScanSessionScreen()),
          GoRoute(path: Routes.invigilatorScan, builder: (_, __) => const ScannerScreen()),
        ],
      ),

      // Student Shell (Dashboard 7)
      ShellRoute(
        builder: (_, __, child) => StudentShell(child: child),
        routes: [
          GoRoute(path: Routes.studentHome,     builder: (_, __) => const StudentHomeScreen()),
          GoRoute(path: Routes.studentExam,     builder: (_, __) => const ExamSandboxScreen()),
          GoRoute(path: Routes.studentResults,  builder: (_, __) => const ResultsScreen()),
          GoRoute(path: Routes.studentHallTicket, builder: (_, __) => const HallTicketScreen()),
        ],
      ),
    ],
    errorBuilder: (_, state) => Scaffold(
      body: Center(child: Text('Route not found: ${state.error}')),
    ),
  );
});

// ── Placeholder screens (to be replaced in Phase 4+) ──────────────────────────
import 'package:flutter/material.dart';

class SplashScreen extends StatelessWidget {
  const SplashScreen({super.key});
  @override
  Widget build(BuildContext context) => const Scaffold(
    body: Center(child: CircularProgressIndicator()),
  );
}

class LoginScreen extends StatelessWidget {
  const LoginScreen({super.key});
  @override
  Widget build(BuildContext context) => const Scaffold(
    body: Center(child: Text('Login – Phase 1 Placeholder')),
  );
}

class ScanSessionScreen extends StatelessWidget {
  const ScanSessionScreen({super.key});
  @override
  Widget build(BuildContext context) => const Scaffold(
    body: Center(child: Text('Invigilator Home – Phase 4')),
  );
}

class ScannerScreen extends StatelessWidget {
  const ScannerScreen({super.key});
  @override
  Widget build(BuildContext context) => const Scaffold(
    body: Center(child: Text('Booklet Scanner – Phase 4')),
  );
}

class StudentHomeScreen extends StatelessWidget {
  const StudentHomeScreen({super.key});
  @override
  Widget build(BuildContext context) => const Scaffold(
    body: Center(child: Text('Student Home – Phase 6')),
  );
}

class ExamSandboxScreen extends StatelessWidget {
  const ExamSandboxScreen({super.key});
  @override
  Widget build(BuildContext context) => const Scaffold(
    body: Center(child: Text('Exam Sandbox – Phase 6')),
  );
}

class ResultsScreen extends StatelessWidget {
  const ResultsScreen({super.key});
  @override
  Widget build(BuildContext context) => const Scaffold(
    body: Center(child: Text('Results – Phase 7')),
  );
}

class HallTicketScreen extends StatelessWidget {
  const HallTicketScreen({super.key});
  @override
  Widget build(BuildContext context) => const Scaffold(
    body: Center(child: Text('Hall Ticket – Phase 2')),
  );
}
