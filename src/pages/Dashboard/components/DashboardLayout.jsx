import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/pages/Dashboard/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Home, Users, BarChart2, Settings, LogOut, Menu, X, Shield, UserCircle,
  HeartPulse, FileText, Calendar, MessageSquare, BookOpen, ClipboardList,
  BrainCircuit, AlertTriangle, TrendingUp, UserCheck, School, Bot,
  Briefcase, Target, Mic, Bell, Lightbulb, HeartHandshake, FileSignature
} from 'lucide-react';

const sidebarVariants = {
  expanded: { width: '250px', transition: { duration: 0.3, ease: 'easeInOut' } },
  collapsed: { width: '80px', transition: { duration: 0.3, ease: 'easeInOut' } },
};

const navItemVariants = {
  expanded: { opacity: 1, x: 0, transition: { duration: 0.2, delay: 0.1 } },
  collapsed: { opacity: 0, x: -10, transition: { duration: 0.1 } },
};

const iconVariants = {
  expanded: { rotate: 0 },
  collapsed: { rotate: 180 },
};

const DashboardLayout = ({ children }) => {
  const { userProfile, handleLogout } = useAuth();
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const getRoleSpecificLinks = (role) => {
    switch (role) {
      case 'admin':
        return [
          { to: '/dashboard', icon: Home, label: t('dashboard.sidebar.home') },
          { to: '/dashboard/admin/user-role-management', icon: Users, label: t('dashboard.sidebar.userRoleManagement') },
          { to: '/dashboard/admin/system-settings', icon: Settings, label: t('dashboard.sidebar.systemSettings') },
          { to: '/dashboard/admin/notification-audit', icon: Bell, label: t('dashboard.sidebar.notificationAudit') },
        ];
      case 'directive':
        return [
          { to: '/dashboard', icon: Home, label: t('dashboard.sidebar.home') },
          { to: '/dashboard/school-data', icon: School, label: t('dashboard.sidebar.schoolData') },
          { to: '/dashboard/reports', icon: BarChart2, label: t('dashboard.sidebar.reports') },
          { to: '/dashboard/user-management', icon: Users, label: t('dashboard.sidebar.userManagement') },
          { to: '/dashboard/family-validation', icon: UserCheck, label: t('dashboard.sidebar.familyLinkValidation') },
          { to: '/dashboard/institutional-alerts', icon: AlertTriangle, label: t('dashboard.sidebar.institutionalAlerts') },
          { to: '/dashboard/role-activity', icon: TrendingUp, label: t('dashboard.sidebar.roleActivity') },
          { to: '/dashboard/access-management', icon: Shield, label: t('dashboard.sidebar.accessManagement') },
          { to: '/dashboard/strategic-summary', icon: BrainCircuit, label: t('dashboard.sidebar.strategicSummary') },
        ];
      case 'psychopedagogue':
        return [
          { to: '/dashboard', icon: Home, label: t('dashboard.sidebar.home') },
          { to: '/dashboard/recent-cases', icon: Briefcase, label: t('dashboard.sidebar.recentCases') },
          { to: '/dashboard/emotional-trends', icon: TrendingUp, label: t('dashboard.sidebar.emotionalTrends') },
          { to: '/dashboard/support-plan', icon: FileText, label: t('dashboard.sidebar.supportPlan') },
          { to: '/dashboard/psychopedagogue/support-plans', icon: Bot, label: t('dashboard.sidebar.automatedSupportPlans') },
          { to: '/dashboard/psychopedagogue/evaluations', icon: FileSignature, label: t('dashboard.sidebar.evaluations') },
          { to: '/dashboard/assign-task', icon: ClipboardList, label: t('dashboard.sidebar.assignTask') },
          { to: '/dashboard/predictive-risk', icon: AlertTriangle, label: t('dashboard.sidebar.predictiveRisk') },
          { to: '/dashboard/psychopedagogue/role-assignments', icon: Users, label: t('dashboard.sidebar.roleAssignment') },
        ];
      case 'parent':
        return [
          { to: '/dashboard', icon: Home, label: t('dashboard.sidebar.home') },
          { to: '/dashboard/child-interactions', icon: MessageSquare, label: t('dashboard.sidebar.childInteractions') },
          { to: '/dashboard/access-reports', icon: FileText, label: t('dashboard.sidebar.accessReports') },
          { to: '/dashboard/direct-communication', icon: Users, label: t('dashboard.sidebar.directCommunication') },
          { to: '/dashboard/student-progress', icon: TrendingUp, label: t('dashboard.sidebar.studentProgress') },
          { to: '/dashboard/schedule-appointment', icon: Calendar, label: t('dashboard.sidebar.scheduleAppointment') },
          { to: '/dashboard/appointment-history', icon: ClipboardList, label: t('dashboard.sidebar.appointmentHistory') },
        ];
      case 'student':
        return [
          { to: '/dashboard', icon: Home, label: t('dashboard.sidebar.home') },
          { to: '/dashboard/kary-chat', icon: MessageSquare, label: t('dashboard.sidebar.karyChat') },
          { to: '/dashboard/personal-tracking', icon: HeartPulse, label: t('dashboard.sidebar.personalTracking') },
          { to: '/dashboard/learning-resources', icon: BookOpen, label: t('dashboard.sidebar.learningResources') },
          { to: '/dashboard/assigned-resources', icon: ClipboardList, label: t('dashboard.sidebar.assignedResources') },
          { to: '/dashboard/my-tasks', icon: FileText, label: t('dashboard.sidebar.myTasks') },
          { to: '/dashboard/student-reports', icon: BarChart2, label: t('dashboard.sidebar.studentReports') },
          { to: '/dashboard/student-support-plans', icon: Shield, label: t('dashboard.sidebar.studentSupportPlans') },
          { to: '/dashboard/student-tracking-data', icon: TrendingUp, label: t('dashboard.sidebar.studentTrackingData') },
        ];
      case 'teacher':
        return [
          { to: '/dashboard', icon: Home, label: t('dashboard.sidebar.home') },
          { to: '/dashboard/teacher/student-plans', icon: Users, label: t('teacherDashboard.sidebar.studentList') },
          { to: '/dashboard/teacher/activities', icon: ClipboardList, label: t('teacherDashboard.sidebar.activities') },
          { to: '/dashboard/kary-core', icon: BrainCircuit, label: t('teacherDashboard.sidebar.cognitiveAlerts') },
        ];
      case 'program_coordinator':
        return [
          { to: '/dashboard', icon: Home, label: t('dashboard.sidebar.home') },
          { to: '/dashboard/program-data-panel', icon: BarChart2, label: t('dashboard.sidebar.programDataPanel') },
          { to: '/dashboard/program-smart-assignment', icon: Bot, label: t('dashboard.sidebar.programSmartAssignment') },
          { to: '/dashboard/program-escalated-alerts', icon: AlertTriangle, label: t('dashboard.sidebar.programEscalatedAlerts') },
          { to: '/dashboard/program-piar-progress', icon: TrendingUp, label: t('dashboard.sidebar.programPiarProgress') },
          { to: '/dashboard/program-block-comparison', icon: Users, label: t('dashboard.sidebar.programBlockComparison') },
        ];
      default:
        return [{ to: '/dashboard', icon: Home, label: t('dashboard.sidebar.home') }];
    }
  };

  const navLinks = getRoleSpecificLinks(userProfile?.role);

  const commonBottomLinks = (role) => {
    const settingsPath = role ? `/dashboard/${role.toLowerCase()}-settings` : '/dashboard/settings';
    if (role === 'psychopedagogue') {
      return [{ to: '/dashboard/psychopedagogue-settings', icon: Settings, label: t('dashboard.sidebar.settings') }];
    }
    if (role === 'parent') {
      return [{ to: '/dashboard/parent-settings', icon: Settings, label: t('dashboard.sidebar.settings') }];
    }
    if (role === 'student') {
      return [{ to: '/dashboard/student-settings', icon: Settings, label: t('dashboard.sidebar.settings') }];
    }
    if (role === 'directive') {
      return [{ to: '/dashboard/directive-settings', icon: Settings, label: t('dashboard.sidebar.settings') }];
    }
    if (role === 'admin') {
      return [{ to: '/dashboard/admin/account-settings', icon: Settings, label: t('dashboard.sidebar.settings') }];
    }
    return [{ to: settingsPath, icon: Settings, label: t('dashboard.sidebar.settings') }];
  };

  const bottomLinks = commonBottomLinks(userProfile?.role);

  const NavItem = ({ to, icon: Icon, label, isExpanded }) => (
    <NavLink
      to={to}
      end={to === '/dashboard'}
      className={({ isActive }) =>
        `flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${
          isActive
            ? 'bg-purple-600 text-white shadow-lg'
            : 'text-slate-300 hover:bg-slate-700 hover:text-white'
        } ${isExpanded ? 'justify-start' : 'justify-center'}`
      }
      onClick={() => isMobileMenuOpen && setIsMobileMenuOpen(false)}
    >
      <Icon className="h-6 w-6 flex-shrink-0" />
      <AnimatePresence>
        {isExpanded && (
          <motion.span variants={navItemVariants} initial="collapsed" animate="expanded" exit="collapsed" className="ml-4 whitespace-nowrap">
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </NavLink>
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-800 text-white">
      <div className={`flex items-center p-4 border-b border-slate-700 ${isExpanded ? 'justify-between' : 'justify-center'}`}>
        {isExpanded && (
          <Link to="/dashboard" className="flex items-center gap-2">
            <img src="/logo.svg" alt="Kary AI Logo" className="h-8 w-auto" />
            <span className="font-bold text-xl">Kary AI</span>
          </Link>
        )}
        <Button variant="ghost" onClick={() => setIsExpanded(!isExpanded)} className="hidden lg:block hover:bg-slate-700">
          <motion.div variants={iconVariants} animate={isExpanded ? 'expanded' : 'collapsed'}>
            <X className="h-6 w-6" />
          </motion.div>
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
        <nav>
          {navLinks.map((link) => (
            <NavItem key={link.to} {...link} isExpanded={isExpanded} />
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-700">
        {bottomLinks.map((link) => (
          <NavItem key={link.to} {...link} isExpanded={isExpanded} />
        ))}
        <button
          onClick={handleLogout}
          className={`flex items-center p-3 my-1 rounded-lg w-full text-slate-300 hover:bg-red-500 hover:text-white transition-colors duration-200 ${isExpanded ? 'justify-start' : 'justify-center'}`}
        >
          <LogOut className="h-6 w-6 flex-shrink-0" />
          <AnimatePresence>
            {isExpanded && (
              <motion.span variants={navItemVariants} initial="collapsed" animate="expanded" exit="collapsed" className="ml-4 whitespace-nowrap">
                {t('dashboard.sidebar.logout')}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      <div className="p-4 border-t border-slate-700">
        <div className={`flex items-center ${isExpanded ? 'justify-start' : 'justify-center'}`}>
          <UserCircle className="h-10 w-10 text-purple-400 flex-shrink-0" />
          <AnimatePresence>
            {isExpanded && (
              <motion.div variants={navItemVariants} initial="collapsed" animate="expanded" exit="collapsed" className="ml-3">
                <p className="font-semibold text-sm truncate">{userProfile?.full_name || 'Usuario'}</p>
                <p className="text-xs text-slate-400 truncate">{t(`roles.${userProfile?.role || 'default'}`, userProfile?.role)}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-900">
      {/* Desktop Sidebar */}
      <motion.div
        variants={sidebarVariants}
        animate={isExpanded ? 'expanded' : 'collapsed'}
        className="hidden lg:block h-full shadow-lg"
      >
        <SidebarContent />
      </motion.div>

      {/* Mobile Menu */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden fixed top-4 left-4 z-50 text-white bg-slate-800/50 backdrop-blur-sm">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64 bg-slate-800 border-r-slate-700">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      <main className="flex-1 overflow-y-auto bg-slate-900">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;