import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

// Páginas de Estudiante
import StudentActivitiesPage from './StudentPages/StudentActivitiesPage';

// Componente de página genérica para rutas no implementadas
import GenericPage from './GenericPage';
import { 
  BookOpen, 
  BarChart3, 
  MessageSquare, 
  ShieldCheck, 
  Users, 
  Eye, 
  Calendar, 
  FileText, 
  Users2, 
  Target, 
  Bell, 
  Settings 
} from 'lucide-react';

const DashboardRouter = () => {
  const { t } = useLanguage();

  return (
    <Routes>
      {/* Rutas de Estudiante */}
      <Route path="/activities" element={<StudentActivitiesPage />} />
      <Route 
        path="/progress" 
        element={
          <GenericPage
            title={t('studentDashboard.progress', 'Mi Progreso')}
            description={t('studentDashboard.progressDescription', 'Visualiza tu progreso académico y personal')}
            icon={BarChart3}
          />
        } 
      />
      <Route 
        path="/kary-chat" 
        element={
          <GenericPage
            title={t('studentDashboard.karyChat', 'Chatea con Kary')}
            description={t('studentDashboard.karyChatDescription', 'Tu asistente de IA para apoyo académico y emocional')}
            icon={MessageSquare}
          />
        } 
      />
      <Route 
        path="/support-plans" 
        element={
          <GenericPage
            title={t('studentDashboard.supportPlans', 'Planes de Apoyo')}
            description={t('studentDashboard.supportPlansDescription', 'Revisa tus planes de apoyo personalizados')}
            icon={ShieldCheck}
          />
        } 
      />

      {/* Rutas de Profesor */}
      <Route 
        path="/students" 
        element={
          <GenericPage
            title={t('common.students', 'Mis Estudiantes')}
            description={t('teacherDashboard.studentsDescription', 'Gestiona y monitorea a tus estudiantes')}
            icon={Users}
          />
        } 
      />
      <Route 
        path="/observations" 
        element={
          <GenericPage
            title={t('teacherDashboard.observations', 'Observaciones')}
            description={t('teacherDashboard.observationsDescription', 'Registra y revisa observaciones de estudiantes')}
            icon={Eye}
          />
        } 
      />
      <Route 
        path="/analytics" 
        element={
          <GenericPage
            title={t('common.analytics', 'Analíticas')}
            description={t('teacherDashboard.analyticsDescription', 'Analiza el rendimiento y progreso de tus estudiantes')}
            icon={BarChart3}
          />
        } 
      />

      {/* Rutas de Padre */}
      <Route 
        path="/children" 
        element={
          <GenericPage
            title={t('parentDashboard.children', 'Mis Hijos')}
            description={t('parentDashboard.childrenDescription', 'Información y seguimiento de tus hijos')}
            icon={Users}
          />
        } 
      />
      <Route 
        path="/family-progress" 
        element={
          <GenericPage
            title={t('parentDashboard.progress', 'Progreso Familiar')}
            description={t('parentDashboard.progressDescription', 'Seguimiento del progreso familiar')}
            icon={BarChart3}
          />
        } 
      />
      <Route 
        path="/communication" 
        element={
          <GenericPage
            title={t('parentDashboard.communication', 'Comunicación')}
            description={t('parentDashboard.communicationDescription', 'Comunicación con la institución')}
            icon={MessageSquare}
          />
        } 
      />
      <Route 
        path="/appointments" 
        element={
          <GenericPage
            title={t('parentDashboard.appointments', 'Citas')}
            description={t('parentDashboard.appointmentsDescription', 'Gestiona citas y reuniones')}
            icon={Calendar}
          />
        } 
      />

      {/* Rutas de Psicopedagogo */}
      <Route 
        path="/cases" 
        element={
          <GenericPage
            title={t('psychopedagogueDashboard.cases', 'Casos')}
            description={t('psychopedagogueDashboard.casesDescription', 'Gestiona casos de estudiantes')}
            icon={BookOpen}
          />
        } 
      />
      <Route 
        path="/evaluations" 
        element={
          <GenericPage
            title={t('psychopedagogueDashboard.evaluations', 'Evaluaciones')}
            description={t('psychopedagogueDashboard.evaluationsDescription', 'Realiza y revisa evaluaciones psicológicas')}
            icon={FileText}
          />
        } 
      />

      {/* Rutas de Directivo */}
      <Route 
        path="/institution" 
        element={
          <GenericPage
            title={t('directiveDashboard.institution', 'Institución')}
            description={t('directiveDashboard.institutionDescription', 'Datos y métricas institucionales')}
            icon={Users}
          />
        } 
      />
      <Route 
        path="/user-management" 
        element={
          <GenericPage
            title={t('directiveDashboard.userManagement', 'Gestión de Usuarios')}
            description={t('directiveDashboard.userManagementDescription', 'Administra usuarios y roles del sistema')}
            icon={Users2}
          />
        } 
      />
      <Route 
        path="/reports" 
        element={
          <GenericPage
            title={t('directiveDashboard.reports', 'Reportes')}
            description={t('directiveDashboard.reportsDescription', 'Genera y visualiza reportes institucionales')}
            icon={BarChart3}
          />
        } 
      />
      <Route 
        path="/alerts" 
        element={
          <GenericPage
            title={t('directiveDashboard.alerts', 'Alertas')}
            description={t('directiveDashboard.alertsDescription', 'Monitorea alertas críticas del sistema')}
            icon={Bell}
          />
        } 
      />
      <Route 
        path="/strategic-summary" 
        element={
          <GenericPage
            title={t('directiveDashboard.strategicSummary', 'Resumen Estratégico')}
            description={t('directiveDashboard.strategicSummaryDescription', 'Análisis estratégico institucional')}
            icon={Target}
          />
        } 
      />

      {/* Rutas Comunes */}
      <Route 
        path="/notifications" 
        element={
          <GenericPage
            title={t('common.notifications', 'Notificaciones')}
            description={t('common.notificationsDescription', 'Gestiona tus notificaciones')}
            icon={Bell}
          />
        } 
      />
      <Route 
        path="/settings" 
        element={
          <GenericPage
            title={t('common.settings', 'Configuración')}
            description={t('common.settingsDescription', 'Configura tu cuenta y preferencias')}
            icon={Settings}
          />
        } 
      />
    </Routes>
  );
};

export default DashboardRouter;
