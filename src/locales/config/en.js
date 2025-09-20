import enCommon from '@/locales/en/common.json';
import enMain from '@/locales/en/main.json';
import enNavbar from '@/locales/en/navbar.json';
import enHeroSection from '@/locales/en/heroSection.json';
import enMeetKarySection from '@/locales/en/meetKarySection.json';
import enWhyKarySection from '@/locales/en/whyKarySection.json';
import enHowKaryWorksSection from '@/locales/en/howKaryWorksSection.json';
import enBenefitsSection from '@/locales/en/benefitsSection.json';
import enUseCasesSection from '@/locales/en/useCasesSection.json';
import enRoadmapSection from '@/locales/en/roadmapSection.json';
import enQuickNavSection from '@/locales/en/quickNavSection.json';
import enIlyrAISection from '@/locales/en/ilyrAISection.json';
import enAboutIlyrAISection from '@/locales/en/aboutIlyrAISection.json';
import enContactSection from '@/locales/en/contactSection.json';
import enFooter from '@/locales/en/footer.json';
import enDemoDialog from '@/locales/en/demoDialog.json';
import enLoginMessages from '@/locales/en/loginMessages.json';
import enImpactSection from '@/locales/en/impactSection.json';
import enNotifications from '@/locales/en/notifications.json';
import enToasts from '@/locales/en/toasts.json';
import enDashboard from '@/locales/en/dashboard.json';
import enStudentDashboard from '@/locales/en/studentDashboard.json';
import enPersonalTrackingPage from '@/locales/en/personalTrackingPage.json';
import enLearningResourcesPage from '@/locales/en/learningResourcesPage.json';
import enAssignedResourcesPage from '@/locales/en/assignedResourcesPage.json';
import enCreateResourceModal from '@/locales/en/createResourceModal.json';
import enAssignResourceModal from '@/locales/en/assignResourceModal.json';
import enAssignMultipleResourcesModal from '@/locales/en/assignMultipleResourcesModal.json';
import enAssignResourceToStudentModal from '@/locales/en/assignResourceToStudentModal.json';
import enSugerenciasDeRecursos from '@/locales/en/sugerenciasDeRecursos.json';
import enTabsRecursosEstudiante from '@/locales/en/tabsRecursosEstudiante.json';
import enRoles from '@/locales/en/roles.json';
import enDashboards from '@/locales/en/dashboards.json';
import enKaryCore from '@/locales/en/karyCore.json';
import enSupportPlans from '@/locales/en/supportPlans.json';
import enRecentCasesPage from '@/locales/en/recentCasesPage.json';
import enPsychopedagogueDashboard from '@/locales/en/psychopedagogueDashboard.json';
import enTeacherDashboard from '@/locales/en/teacherDashboard.json';
import enEmotionalTrends from '@/locales/en/emotionalTrends.json';
import enAssignTaskPage from '@/locales/en/assignTaskPage.json';
import enPredictiveRiskPage from '@/locales/en/predictiveRiskPage.json';
import enPsychopedagoguePlans from '@/locales/en/psychopedagoguePlans.json';
import enRegisterStudentModal from '@/locales/en/registerStudentModal.json';
import enDirectiveDashboard from '@/locales/en/directiveDashboard.json';
import enParentDashboard from '@/locales/en/parentDashboard.json';
import enProgramCoordinatorDashboard from '@/locales/en/programCoordinatorDashboard.json';
import enAppointments from '@/locales/en/appointments.json';
import enStudentList from '@/locales/en/studentList.json';
import enAccountSettings from '@/locales/en/accountSettings.json';
import enAdminUserRolePage from '@/locales/en/adminUserRolePage.json';
import enNotificationAuditPage from '@/locales/en/notificationAuditPage.json';
import enStudentProfilePage from '@/locales/en/studentProfilePage.json';
import enEventTitles from '@/locales/en/eventTitles.json';
import enEventTemplates from '@/locales/en/eventTemplates.json';
import enSmartAssignment from '@/locales/en/smartAssignment.json';
import enStudentTrackingDataPage from '@/locales/en/studentTrackingDataPage.json';
import enRoleBasedDataPanel from '@/locales/en/roleBasedDataPanel.json';
import enAiContext from '@/locales/en/aiContext.json';

export const enTranslations = {
  common: enCommon,
  main: enMain,
  navbar: enNavbar,
  heroSection: enHeroSection,
  meetKarySection: enMeetKarySection,
  whyKarySection: enWhyKarySection,
  howKaryWorksSection: enHowKaryWorksSection,
  benefitsSection: enBenefitsSection,
  useCasesSection: enUseCasesSection,
  roadmapSection: enRoadmapSection,
  quickNavSection: enQuickNavSection,
  ilyrAISection: enIlyrAISection,
  aboutIlyrAISection: enAboutIlyrAISection,
  contactSection: enContactSection,
  footer: enFooter,
  demoDialog: enDemoDialog,
  loginMessages: enLoginMessages,
  impactSection: enImpactSection,
  notifications: enNotifications,
  toast: enToasts,
  dashboard: enDashboard,
  studentDashboard: {
    ...enStudentDashboard,
    personalTrackingPage: enPersonalTrackingPage,
    learningResourcesPage: enLearningResourcesPage,
    assignedResourcesPage: enAssignedResourcesPage,
    sugerenciasDeRecursos: enSugerenciasDeRecursos,
    tabsRecursosEstudiante: enTabsRecursosEstudiante,
    studentTrackingDataPage: enStudentTrackingDataPage,
  },
  createResourceModal: enCreateResourceModal,
  assignResourceModal: enAssignResourceModal,
  assignMultipleResourcesModal: enAssignMultipleResourcesModal,
  assignResourceToStudentModal: enAssignResourceToStudentModal,
  roles: enRoles,
  dashboards: enDashboards,
  karyCore: enKaryCore,
  supportPlans: enSupportPlans,
  recentCasesPage: enRecentCasesPage,
  psychopedagogueDashboard: enPsychopedagogueDashboard,
  teacherDashboard: enTeacherDashboard,
  emotionalTrends: enEmotionalTrends,
  assignTaskPage: enAssignTaskPage,
  predictiveRiskPage: enPredictiveRiskPage,
  psychopedagoguePlans: enPsychopedagoguePlans,
  registerStudentModal: enRegisterStudentModal,
  directiveDashboard: enDirectiveDashboard,
  parentDashboard: enParentDashboard,
  programCoordinatorDashboard: enProgramCoordinatorDashboard,
  appointments: enAppointments,
  studentList: enStudentList,
  accountSettings: enAccountSettings,
  adminUserRolePage: enAdminUserRolePage,
  notificationAuditPage: enNotificationAuditPage,
  studentProfilePage: enStudentProfilePage,
  eventTitles: enEventTitles,
  eventTemplates: enEventTemplates,
  smartAssignment: enSmartAssignment,
  roleBasedDataPanel: enRoleBasedDataPanel,
  aiContext: enAiContext,
};