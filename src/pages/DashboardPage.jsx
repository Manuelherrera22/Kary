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

  // Función para renderizar el contenido del dashboard principal
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
      <Routes>
        {/* Ruta raíz del dashboard */}
        <Route index element={renderDashboardContent()} />
        
        {/* Todas las demás rutas */}
        <Route path="*" element={<DashboardRouter />} />
      </Routes>
    </DashboardLayout>
  );
};

export default DashboardPage;