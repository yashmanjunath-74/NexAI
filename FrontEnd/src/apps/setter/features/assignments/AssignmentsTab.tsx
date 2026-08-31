import React, { useState } from 'react';
import { BookOpen, PenTool, Clock, Award } from 'lucide-react';
import { SetterAssignment } from '../../types';
import { AssignmentCard } from './components/AssignmentCard';
import { GuidelinesModal } from './components/GuidelinesModal';

interface AssignmentsTabProps {
  assignments: SetterAssignment[];
  onOpenStudio: (subjectCode: string) => void;
}

export const AssignmentsTab: React.FC<AssignmentsTabProps> = ({
  assignments,
  onOpenStudio,
}) => {
  const [selectedGuidelines, setSelectedGuidelines] = useState<SetterAssignment | null>(null);

  const totalAssigned = assignments.length;
  const totalRequiredSets = assignments.reduce((s, a) => s + a.setsRequired, 0);
  const totalSubmittedSets = assignments.reduce((s, a) => s + a.setsSubmitted, 0);
  const totalHonorarium = '₹17,000 ($200 USD)';

  return (
    <div>
      {/* Top Telemetry Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '28px',
      }}>
        {[
          {
            label: 'Assigned Subjects',
            value: `${totalAssigned} Courses`,
            desc: 'Fall Semester 2026',
            icon: <BookOpen size={20} />,
            color: '#3b82f6',
          },
          {
            label: 'Required Paper Sets',
            value: `${totalSubmittedSets} / ${totalRequiredSets} Sets`,
            desc: `${Math.round((totalSubmittedSets / totalRequiredSets) * 100)}% Overall Completed`,
            icon: <PenTool size={20} />,
            color: '#48977f',
          },
          {
            label: 'Next Submission Due',
            value: 'In 4 Days',
            desc: 'CS201: Data Structures',
            icon: <Clock size={20} />,
            color: '#ed7245',
          },
          {
            label: 'Approved Honorarium',
            value: totalHonorarium,
            desc: 'Direct Bank Settlement',
            icon: <Award size={20} />,
            color: '#16a34a',
          },
        ].map((stat, i) => (
          <div
            key={i}
            style={{
              background: 'white',
              borderRadius: '14px',
              border: `1px solid ${stat.color}22`,
              borderTop: `4px solid ${stat.color}`,
              padding: '18px 20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div style={{
              width: 44,
              height: 44,
              borderRadius: '10px',
              background: `${stat.color}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: stat.color,
              flexShrink: 0
            }}>
              {stat.icon}
            </div>

            <div>
              <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                {stat.label}
              </p>
              <h3 style={{ margin: '2px 0 0 0', fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                {stat.value}
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.7rem', color: stat.color, fontWeight: 600 }}>
                {stat.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Section Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <div>
          <h3 style={{ margin: '0 0 2px 0', fontSize: '1.1rem', fontWeight: 800 }}>
            Active Question Paper Appointments
          </h3>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
            Each appointment requires authoring parallel randomized paper sets according to official university syllabus blueprints.
          </p>
        </div>
      </div>

      {/* Assignment Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '20px',
      }}>
        {assignments.map(asg => (
          <AssignmentCard
            key={asg.id}
            assignment={asg}
            onOpenStudio={code => onOpenStudio(code)}
            onViewGuidelines={a => setSelectedGuidelines(a)}
          />
        ))}
      </div>

      {/* Guidelines Modal */}
      {selectedGuidelines && (
        <GuidelinesModal
          assignment={selectedGuidelines}
          onClose={() => setSelectedGuidelines(null)}
        />
      )}
    </div>
  );
};
