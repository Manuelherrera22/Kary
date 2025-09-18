import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Settings } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import AccountSettingsPage from '@/pages/Dashboard/DirectiveSections/AccountSettingsPage';


const ParentAccountSettingsPage = () => {
  const { t } = useLanguage();
  return <AccountSettingsPage />;
};

export default ParentAccountSettingsPage;