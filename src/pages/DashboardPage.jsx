import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useMockAuth } from '@/contexts/MockAuthContext';
import LoadingScreen from '@/pages/Dashboard/components/LoadingScreen';
import NoAccessScreen from '@/pages/Dashboard/components/NoAccessScreen';
import RoleSelectionScreen from '@/pages/Dashboard/components/RoleSelectionScreen';
import DashboardLayout from '@/pages/Dashboard/components/DashboardLayout';
import DashboardRouter from '@/pages/Dashboard/DashboardRouter';

import ParentDashboard from '@/pages/Dashboard/ParentDashboard';
import DirectiveDashboard from '@/pages/Dashboard/DirectiveDashboard';
import PsychopedagogueDashboard from '@/pages/Dashboard/PsychopedagogueDashboard';
import AdminDashboard from '@/pages/Dashboard/AdminDashboard'; 
import StudentDashboard from '@/pages/Dashboard/StudentDashboard';
import GenericDashboard from '@/pages/Dashboard/GenericDashboard';
import ProgramCoordinatorDashboard from '@/pages/Dashboard/ProgramCoordinatorDashboard';
import TeacherDashboard from '@/pages/Dashboard/TeacherDashboard'; 

const DashboardPage = () => {
  const { user, userProfile, loading, updateUserRoleInProfile } = useMockAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <NoAccessScreen />;
  }
  
  const needsRoleSelection = user && (!userProfile || !userProfile.role);

  if (needsRoleSelection) {
    return <RoleSelectionScreen onSelectRole={updateUserRoleInProfile} loading={loading} userName={userProfile?.full_name || user.email} />;
  }

  // Si estamos en la ruta raíz del dashboard, mostrar el dashboard principal
  if (location.pathname === '/dashboard' || location.pathname === '/dashboard/') {
    const renderDashboardContent = () => {
      if (!userProfile || !userProfile.role) {
        return <GenericDashboard user={user} userProfile={userProfile} />;
      }

      switch (userProfile.role) {
        case 'parent':
          return <ParentDashboard />;
        case 'directive':
          return <DirectiveDashboard />;
        case 'psychopedagogue':
          return <PsychopedagogueDashboard />;
        case 'admin':
          return <AdminDashboard />;
        case 'student':
          return <StudentDashboard />;
        case 'program_coordinator':
          return <ProgramCoordinatorDashboard />;
        case 'teacher':
          return <TeacherDashboard />; 
        default:
          return <GenericDashboard user={user} userProfile={userProfile} />;
      }
    };

    return (
      <DashboardLayout user={user} userProfile={userProfile} onLogout={() => {}}>
        {renderDashboardContent()}
      </DashboardLayout>
    );
  }

  // Para todas las demás rutas, usar el router interno
  return (
    <DashboardLayout user={user} userProfile={userProfile} onLogout={() => {}}>
      <Routes>
        <Route path="/*" element={<DashboardRouter />} />
      </Routes>
    </DashboardLayout>
  );
};

export default DashboardPage;