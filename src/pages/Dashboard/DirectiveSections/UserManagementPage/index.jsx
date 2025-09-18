import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import CreateStudentForm from '../components/CreateStudentForm'; 
import UserTable from './components/UserTable';
import ConfirmActionModal from './components/ConfirmActionModal';
import { useUserManagement } from './hooks/useUserManagement';
import LoadingScreen from '@/pages/Dashboard/components/LoadingScreen';

const UserManagementPage = () => {
  const { t } = useLanguage();
  const { users, isLoading, fetchUsers, toggleUserStatus, deleteUser, handleActionConfirmed } = useUserManagement();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateStudentModalOpen, setIsCreateStudentModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [actionToPerform, setActionToPerform] = useState(null);
  const [userToConfirm, setUserToConfirm] = useState(null);
  const [currentActionName, setCurrentActionName] = useState('');


  const handleStudentCreatedOrUpdated = () => {
    fetchUsers(); 
    setIsCreateStudentModalOpen(false);
    setEditingUser(null);
  };
  
  const filteredUsers = useMemo(() => users.filter(user =>
    (user.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  ), [users, searchTerm]);

  const openEditModal = (user) => {
    setEditingUser(user);
    setIsCreateStudentModalOpen(true); 
  };
  
  const openConfirmModal = (user, actionCallback) => {
    setUserToConfirm(user);
    setActionToPerform(() => actionCallback); 
    
    if (actionCallback.name === 'toggleUserStatus') {
      setCurrentActionName(user.status === 'active' ? t('directive.userManagement.suspendUser') : t('directive.userManagement.activateUser'));
    } else if (actionCallback.name === 'deleteUser') {
      setCurrentActionName(t('common.deleteButton'));
    } else {
      setCurrentActionName(t('common.genericAction')); 
    }
    setIsConfirmModalOpen(true);
  };

  if (isLoading) {
    return <LoadingScreen text={t('common.loadingText')} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-6 bg-gradient-to-br from-purple-700 via-pink-700 to-orange-600 min-h-screen text-white"
    >
      <div className="container mx-auto">
        <Link to="/dashboard" className="inline-flex items-center text-purple-300 hover:text-purple-100 mb-6 transition-colors">
          <ArrowLeft size={20} className="mr-2" />
          {t('common.backToDashboard')}
        </Link>

        <div className="bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div className="flex items-center mb-4 sm:mb-0">
              <Users size={36} className="mr-4 text-orange-300" />
              <div>
                <h1 className="text-3xl font-bold">{t('directive.userManagement.pageTitle')}</h1>
                <p className="text-purple-200">{t('directive.userManagement.pageSubtitle')}</p>
              </div>
            </div>
            <Button 
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() => { setEditingUser(null); setIsCreateStudentModalOpen(true); }}
            >
              <UserPlus size={18} className="mr-2" /> {t('directive.userManagement.createButton')}
            </Button>
          </div>

          <div className="mb-6">
            <Input
              type="text"
              placeholder={t('directive.userManagement.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/20 placeholder-purple-300 border-purple-500/50 focus:border-orange-400 focus:ring-orange-400"
            />
          </div>
          
          <UserTable 
            users={filteredUsers} 
            onEditUser={openEditModal}
            onConfirmAction={openConfirmModal}
            onToggleUserStatus={toggleUserStatus}
            onDeleteUser={deleteUser}
          />
        </div>
      </div>

      <Dialog open={isCreateStudentModalOpen} onOpenChange={(isOpen) => {
        setIsCreateStudentModalOpen(isOpen);
        if (!isOpen) setEditingUser(null);
      }}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>{editingUser ? t('directive.userManagement.editTitle') : t('directive.userManagement.createTitle')}</DialogTitle>
            <DialogDescription>
              {editingUser ? t('directive.userManagement.editDesc') : t('directive.userManagement.createDesc')}
            </DialogDescription>
          </DialogHeader>
          <CreateStudentForm 
            onStudentCreated={handleStudentCreatedOrUpdated} 
            onStudentUpdated={handleStudentCreatedOrUpdated}
            existingStudentData={editingUser}
            setIsOpen={setIsCreateStudentModalOpen}
          />
        </DialogContent>
      </Dialog>

      <ConfirmActionModal 
        isOpen={isConfirmModalOpen}
        onOpenChange={setIsConfirmModalOpen}
        onConfirm={() => handleActionConfirmed(userToConfirm, actionToPerform, setIsConfirmModalOpen, setUserToConfirm, setActionToPerform)}
        userName={userToConfirm?.full_name}
        actionName={currentActionName}
      />

    </motion.div>
  );
};

export default UserManagementPage;