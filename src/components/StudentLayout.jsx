import React from 'react';
import { Outlet } from 'react-router-dom';
import StudentSidebar from './StudentSidebar';
import RealTimeSync from './RealTimeSync';

const StudentLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Sidebar de Navegación */}
      <StudentSidebar />
      
      {/* Contenido Principal */}
      <div className="lg:ml-64">
        <Outlet />
      </div>
    </div>
  );
};

export default StudentLayout;
