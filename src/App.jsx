import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MeetKarySection from "@/components/MeetKarySection"; 
import QuickNavSection from "@/components/QuickNavSection";
import WhyKarySection from "@/components/WhyKarySection";
import HowKaryWorksSection from "@/components/HowKaryWorksSection";
import BenefitsSection from "@/components/BenefitsSection";
import UseCasesSection from "@/components/UseCasesSection";
import RoadmapSection from "@/components/RoadmapSection";
import IlyrAISection from "@/components/IlyrAISection"; 
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import DashboardPage from "@/pages/DashboardPage"; 
import { useLanguage } from "@/contexts/LanguageContext";
import { useMockAuth } from "@/contexts/MockAuthContext.jsx";
import LoadingScreen from "@/pages/Dashboard/components/LoadingScreen";

import SchoolDataPanelPage from "@/pages/Dashboard/DirectiveSections/SchoolDataPanelPage";
import AggregatedReportsPage from "@/pages/Dashboard/DirectiveSections/AggregatedReportsPage";
import UserManagementPage from "@/pages/Dashboard/DirectiveSections/UserManagementPage/index.jsx";
import AccountSettingsPage from "@/pages/Dashboard/DirectiveSections/AccountSettingsPage";
import FamilyLinkValidationPage from "@/pages/Dashboard/DirectiveSections/FamilyLinkValidationPage";
import InstitutionalAlertsPage from "@/pages/Dashboard/DirectiveSections/InstitutionalAlertsPage";
import RoleActivityPage from "@/pages/Dashboard/DirectiveSections/RoleActivityPage";
import AccessManagementPage from "@/pages/Dashboard/DirectiveSections/AccessManagementPage";
import StrategicSummaryPage from "@/pages/Dashboard/DirectiveSections/StrategicSummaryPage";


import RecentCasesPage from "@/pages/Dashboard/PsychopedagogueSections/RecentCasesPage";
import EmotionalTrendsPage from "@/pages/Dashboard/PsychopedagogueSections/EmotionalTrendsPage";
import SupportPlanPage from "@/pages/Dashboard/PsychopedagogueSections/SupportPlanPage";
import PsychopedagogueAccountSettingsPage from "@/pages/Dashboard/PsychopedagogueSections/PsychopedagogueAccountSettingsPage";
import AssignTaskPage from "@/pages/Dashboard/PsychopedagogueSections/AssignTaskPage"; 
import PredictiveRiskPage from "@/pages/Dashboard/PsychopedagogueSections/PredictiveRiskPage"; 
import AutomatedSupportPlansPage from "@/pages/Dashboard/PsychopedagogueSections/AutomatedSupportPlansPage";
import RoleAssignmentPage from "@/pages/Dashboard/PsychopedagogueSections/RoleAssignmentPage";
import PsychopedagogueEvaluationsPage from "@/pages/Dashboard/PsychopedagogueSections/PsychopedagogueEvaluationsPage/index.jsx";

import ChildInteractionsSummaryPage from "@/pages/Dashboard/ParentSections/ChildInteractionsSummaryPage";
import AccessReportsPage from "@/pages/Dashboard/ParentSections/AccessReportsPage";
import DirectCommunicationPage from "@/pages/Dashboard/ParentSections/DirectCommunicationPage";
import StudentProgressPage from "@/pages/Dashboard/ParentSections/StudentProgressPage";
import ParentAccountSettingsPage from "@/pages/Dashboard/ParentSections/ParentAccountSettingsPage";
import ScheduleAppointmentPage from "@/pages/Dashboard/ParentSections/ScheduleAppointmentPage";
import AppointmentHistoryPage from "@/pages/Dashboard/ParentSections/AppointmentHistoryPage";

import StudentAccountSettingsPage from "@/pages/Dashboard/StudentSections/StudentAccountSettingsPage";
import KaryChatPage from "@/pages/Dashboard/StudentSections/KaryChatPage";
import PersonalTrackingPage from "@/pages/Dashboard/StudentSections/PersonalTrackingPage";
import LearningResourcesPage from "@/pages/Dashboard/StudentSections/LearningResourcesPage";
import AssignedResourcesPage from "@/pages/Dashboard/StudentSections/AssignedResourcesPage";
import MyTasksPage from "@/pages/Dashboard/StudentSections/MyTasksPage";
import StudentReportsPage from "@/pages/Dashboard/StudentSections/StudentReportsPage";
import StudentSupportPlansPage from "@/pages/Dashboard/StudentSections/StudentSupportPlansPage";
import StudentTrackingDataPage from "@/pages/Dashboard/StudentSections/StudentTrackingDataPage";
import EmotionalAttendancePage from "@/pages/Dashboard/StudentSections/EmotionalAttendancePage/index.jsx";

import TeacherStudentPlansPage from "@/pages/Dashboard/TeacherSections/TeacherStudentPlansPage";
import StudentPlanActivities from "@/pages/Dashboard/TeacherSections/StudentPlanActivities";

import UnifiedProgressQuickAccessPage from "@/pages/Dashboard/SharedSections/UnifiedProgressQuickAccessPage";
import AdminUserRolePage from "@/pages/Dashboard/AdminSections/AdminUserRolePage";
import AdminSystemSettingsPage from "@/pages/Dashboard/AdminSections/AdminSystemSettingsPage";
import AdminAccountSettingsPage from "@/pages/Dashboard/AdminSections/AdminAccountSettingsPage";
import NotificationAuditPage from "@/pages/Dashboard/AdminSections/NotificationAuditPage";

import StudentProfilePage from "@/pages/Dashboard/StudentProfilePage/StudentProfilePage";

import ProgramDataPanelPage from "@/pages/Dashboard/ProgramCoordinatorSections/ProgramDataPanelPage";
import ProgramSmartAssignmentPage from "@/pages/Dashboard/ProgramCoordinatorSections/ProgramSmartAssignmentPage";
import ProgramEscalatedAlertsPage from "@/pages/Dashboard/ProgramCoordinatorSections/ProgramEscalatedAlertsPage";
import ProgramPiarProgressPage from "@/pages/Dashboard/ProgramCoordinatorSections/ProgramPiarProgressPage";
import ProgramBlockComparisonPage from "@/pages/Dashboard/ProgramCoordinatorSections/ProgramBlockComparisonPage";

import RoleBasedDataPanel from "@/pages/Dashboard/RoleBasedDataPanel/RoleBasedDataPanel";
import KaryCorePanel from "@/pages/Dashboard/KaryCorePanel/KaryCorePanel";


const MainPageLayout = () => {
  const { t } = useLanguage();
  const navItems = [
    { labelKey: "navbar.inicio", id: "inicio" },
    { labelKey: "navbar.conoceAKary", id: "conoce-a-kary" },
    { labelKey: "navbar.porqueKary", id: "porque-kary" },
    { labelKey: "navbar.comoFunciona", id: "como-funciona" },
    { labelKey: "navbar.beneficios", id: "beneficios" },
    { labelKey: "navbar.casosDeUso", id: "casos-de-uso" },
    { labelKey: "navbar.roadmap", id: "roadmap" },
    { labelKey: "navbar.ilyrProjects", id: "ilyr-ai-projects" },
    { labelKey: "navbar.contacto", id: "contacto" },
  ];

  return (
    <>
      <Navbar navItems={navItems} />
      <main>
        <HeroSection />
        <MeetKarySection />
        <WhyKarySection />
        <HowKaryWorksSection />
        <BenefitsSection />
        <UseCasesSection />
        <RoadmapSection />
        <QuickNavSection /> 
        <IlyrAISection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
};

const ProtectedRoute = ({ children }) => {
  const { user, loading, userProfile } = useMockAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};


const AppContent = () => {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith("/dashboard");

  return (
    <div className={`min-h-screen text-gray-800 ${isDashboardRoute ? "bg-gray-100 dark:bg-slate-900" : "bg-gradient-to-b from-sky-100 via-purple-50 to-pink-50"}`}>
      <Routes>
        <Route path="/" element={<MainPageLayout />} />
        
        <Route path="/dashboard/*" element={
          <ProtectedRoute>
            <Routes>
                <Route index element={<DashboardPage />} />
                <Route path="data-panel" element={<RoleBasedDataPanel />} />
                <Route path="kary-core" element={<KaryCorePanel />} />
                <Route path="progress-quick-access" element={<UnifiedProgressQuickAccessPage />} />
                <Route path="student/:studentId/profile" element={<StudentProfilePage />} />
                <Route path="school-data" element={<SchoolDataPanelPage />} />
                <Route path="reports" element={<AggregatedReportsPage />} />
                <Route path="user-management" element={<UserManagementPage />} />
                <Route path="directive-settings" element={<AccountSettingsPage />} />
                <Route path="family-validation" element={<FamilyLinkValidationPage />} />
                <Route path="institutional-alerts" element={<InstitutionalAlertsPage />} />
                <Route path="role-activity" element={<RoleActivityPage />} />
                <Route path="access-management" element={<AccessManagementPage />} />
                <Route path="strategic-summary" element={<StrategicSummaryPage />} />
                <Route path="recent-cases" element={<RecentCasesPage />} />
                <Route path="emotional-trends" element={<EmotionalTrendsPage />} />
                <Route path="support-plan" element={<SupportPlanPage />} />
                <Route path="psychopedagogue/support-plans" element={<AutomatedSupportPlansPage />} />
                <Route path="psychopedagogue/evaluations" element={<PsychopedagogueEvaluationsPage />} />
                <Route path="assign-task" element={<AssignTaskPage />} />
                <Route path="psychopedagogue/role-assignments" element={<RoleAssignmentPage />} />
                <Route path="psychopedagogue-settings" element={<PsychopedagogueAccountSettingsPage />} />
                <Route path="predictive-risk" element={<PredictiveRiskPage />} />
                <Route path="child-interactions" element={<ChildInteractionsSummaryPage />} />
                <Route path="access-reports" element={<AccessReportsPage />} />
                <Route path="direct-communication" element={<DirectCommunicationPage />} />
                <Route path="student-progress" element={<StudentProgressPage />} />
                <Route path="parent-settings" element={<ParentAccountSettingsPage />} />
                <Route path="schedule-appointment" element={<ScheduleAppointmentPage />} />
                <Route path="appointment-history" element={<AppointmentHistoryPage />} />
                <Route path="kary-chat" element={<KaryChatPage />} />
                <Route path="personal-tracking" element={<PersonalTrackingPage />} />
                <Route path="learning-resources" element={<LearningResourcesPage />} />
                <Route path="assigned-resources" element={<AssignedResourcesPage />} />
                <Route path="my-tasks" element={<MyTasksPage />} />
                <Route path="student-reports" element={<StudentReportsPage />} />
                <Route path="student-support-plans" element={<StudentSupportPlansPage />} />
                <Route path="student-tracking-data" element={<StudentTrackingDataPage />} />
                <Route path="student-settings" element={<StudentAccountSettingsPage />} />
                <Route path="emotional-attendance" element={<EmotionalAttendancePage />} />
                <Route path="admin/user-role-management" element={<AdminUserRolePage />} />
                <Route path="admin/system-settings" element={<AdminSystemSettingsPage />} />
                <Route path="admin/account-settings" element={<AdminAccountSettingsPage />} />
                <Route path="admin/notification-audit" element={<NotificationAuditPage />} />
                <Route path="program-data-panel" element={<ProgramDataPanelPage />} />
                <Route path="program-smart-assignment" element={<ProgramSmartAssignmentPage />} />
                <Route path="program-escalated-alerts" element={<ProgramEscalatedAlertsPage />} />
                <Route path="program-piar-progress" element={<ProgramPiarProgressPage />} />
                <Route path="program-block-comparison" element={<ProgramBlockComparisonPage />} />
                <Route path="teacher/student-plans" element={<TeacherStudentPlansPage />} />
                <Route path="teacher/activities" element={<StudentPlanActivities />} />
            </Routes>
          </ProtectedRoute>
        }/>
      </Routes>
      <Toaster />
    </div>
  );
};

const App = () => {
  return <AppContent />;
}

export default App;