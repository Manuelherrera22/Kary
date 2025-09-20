import React from 'react';
import { useMockAuth } from '@/contexts/MockAuthContext';
import LoadingScreen from '@/pages/Dashboard/components/LoadingScreen';
import NoAccessScreen from '@/pages/Dashboard/components/NoAccessScreen';
import RoleSelectionScreen from '@/pages/Dashboard/components/RoleSelectionScreen';
import DashboardLayout from '@/pages/Dashboard/components/DashboardLayout';

const DashboardComponent = () => {
  const { user, userProfile, loading, handleLogout, updateUserRoleInProfile } = useMockAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <NoAccessScreen />;
  }
  
  const needsRoleSelection = user && (!userProfile || !userProfile.role);

  if (needsRoleSelection && user.email_confirmed_at) {
    return <RoleSelectionScreen onSelectRole={updateUserRoleInProfile} loading={loading} userName={userProfile?.full_name || user.email} />;
  }

  return (
    <DashboardLayout 
      user={user} 
      userProfile={userProfile}
      onLogout={handleLogout}
    />
  );
};

export default DashboardComponent;