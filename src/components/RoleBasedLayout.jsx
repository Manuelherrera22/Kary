import React from 'react';
import { useMockAuth } from '@/contexts/MockAuthContext';
import StudentLayout from './StudentLayout';
import DashboardPage from '@/pages/DashboardPage';

const RoleBasedLayout = ({ children }) => {
  const { userProfile } = useMockAuth();
  
  // Si es estudiante, usar el StudentLayout
  if (userProfile?.role === 'student') {
    return <StudentLayout>{children}</StudentLayout>;
  }
  
  // Para otros roles, usar el layout por defecto
  return <DashboardPage />;
};

export default RoleBasedLayout;


