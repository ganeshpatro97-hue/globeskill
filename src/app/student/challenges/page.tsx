"use client";

import React from 'react';
import StudentChallengesUI from '@/components/StudentChallengesUI';
import RoleGate from '@/components/RoleGate';

export default function StudentChallengesPage() {
  return (
    <RoleGate allowedRoles={['student', 'trainer', 'admin', 'recruiter']}>
      <StudentChallengesUI />
    </RoleGate>
  );
}
