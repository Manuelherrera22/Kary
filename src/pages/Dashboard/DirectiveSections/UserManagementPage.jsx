import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, UserPlus, Edit, Trash2, MoreVertical, ShieldCheck, ShieldOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import CreateStudentForm from './components/CreateStudentForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


const UserManagementPage = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateStudentModalOpen, setIsCreateStudentModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [userToConfirm, setUserToConfirm] = useState(null);


  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, full_name, email, role, status, grade, admission_date')
        .order('full_name', { ascending: true });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: t('toast.errorTitle'),
        description: t('dashboards.directiveDashboard.userManagement.fetchError'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleStudentCreated = () => {
    fetchUsers(); 
    setIsCreateStudentModalOpen(false);
  };
  
  const filteredUsers = users.filter(user =>
    (user.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const openEditModal = (user) => {
    setEditingUser(user);
    setIsCreateStudentModalOpen(true); 
  };
  
  const openConfirmModal = (user, actionCallback) => {
    setUserToConfirm(user);
    setConfirmAction(() => () => actionCallback(user)); // Pass the user to the action
    setIsConfirmModalOpen(true);
  };
  

  const handleConfirmAction = async () => {
    if (!userToConfirm || !confirmAction) return;

    try {
      await confirmAction(); // Execute the stored action
      fetchUsers();
      toast({
        title: t('toast.successTitle'),
        description: t('dashboards.directiveDashboard.userManagement.actionSuccess'),
        className: "bg-green-500 text-white dark:bg-green-700"
      });
    } catch (error) {
      console.error('Error performing action:', error);
      toast({
        title: t('toast.errorTitle'),
        description: error.message || t('dashboards.directiveDashboard.userManagement.actionError'),
        variant: 'destructive',
      });
    } finally {
      setIsConfirmModalOpen(false);
      setUserToConfirm(null);
      setConfirmAction(null);
    }
  };
  
  const toggleUserStatus = async (user) => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    const { error } = await supabase
      .from('user_profiles')
      .update({ status: newStatus })
      .eq('id', user.id);
    if (error) throw error;
  };

  const deleteUser = async (user) => {
    if (user.email) {
        const { error: authError } = await supabase.auth.admin.deleteUser(user.id);
        if (authError && authError.message !== 'User not found') {
            console.warn('Error deleting user from auth.users:', authError.message);
        }
    }
    const { error: profileError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', user.id);

    if (profileError) throw profileError;
  };


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
                <h1 className="text-3xl font-bold">{t('dashboards.directiveDashboard.userManagementTitle')}</h1>
                <p className="text-purple-200">{t('dashboards.directiveDashboard.userManagementPageSubtitle')}</p>
              </div>
            </div>
            <Button 
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() => { setEditingUser(null); setIsCreateStudentModalOpen(true); }}
            >
              <UserPlus size={18} className="mr-2" /> {t('dashboards.directiveDashboard.userManagement.createStudentButton')}
            </Button>
          </div>

          <div className="mb-6">
            <Input
              type="text"
              placeholder={t('dashboards.directiveDashboard.userManagement.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/20 placeholder-purple-300 border-purple-500/50 focus:border-orange-400 focus:ring-orange-400"
            />
          </div>
          
          {isLoading ? (
            <p className="text-center py-8">{t('common.loadingText')}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-purple-500/50">
                    <th className="p-3 font-semibold text-orange-300">{t('dashboards.directiveDashboard.userManagement.table.name')}</th>
                    <th className="p-3 font-semibold text-orange-300">{t('dashboards.directiveDashboard.userManagement.table.email')}</th>
                    <th className="p-3 font-semibold text-orange-300">{t('dashboards.directiveDashboard.userManagement.table.role')}</th>
                    <th className="p-3 font-semibold text-orange-300">{t('dashboards.directiveDashboard.userManagement.table.status')}</th>
                    <th className="p-3 font-semibold text-orange-300">{t('dashboards.directiveDashboard.userManagement.table.grade')}</th>
                    <th className="p-3 font-semibold text-orange-300">{t('dashboards.directiveDashboard.userManagement.table.admissionDate')}</th>
                    <th className="p-3 font-semibold text-orange-300 text-right">{t('dashboards.directiveDashboard.userManagement.table.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="border-b border-purple-500/30 hover:bg-white/5 transition-colors">
                      <td className="p-3">{user.full_name || t('common.notSpecified')}</td>
                      <td className="p-3">{user.email || t('common.notSpecified')}</td>
                      <td className="p-3">{t(`roles.${user.role}`)}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${user.status === 'active' ? 'bg-green-500/30 text-green-200' : 'bg-red-500/30 text-red-200'}`}>
                          {t(`common.status${user.status?.charAt(0).toUpperCase() + user.status?.slice(1)}`)}
                        </span>
                      </td>
                      <td className="p-3">{user.grade || 'N/A'}</td>
                      <td className="p-3">{user.admission_date ? new Date(user.admission_date).toLocaleDateString() : 'N/A'}</td>
                      <td className="p-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-purple-300 hover:text-white">
                              <MoreVertical size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-slate-800 border-slate-700 text-white">
                            <DropdownMenuItem onClick={() => openEditModal(user)} className="hover:bg-slate-700">
                              <Edit size={14} className="mr-2" /> {t('common.editButton')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openConfirmModal(user, toggleUserStatus)} className="hover:bg-slate-700">
                              {user.status === 'active' ? <ShieldOff size={14} className="mr-2 text-yellow-400" /> : <ShieldCheck size={14} className="mr-2 text-green-400" />}
                              {user.status === 'active' ? t('dashboards.directiveDashboard.userManagement.suspendUser') : t('dashboards.directiveDashboard.userManagement.activateUser')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openConfirmModal(user, deleteUser)} className="text-red-400 hover:bg-red-500/20 hover:text-red-300">
                              <Trash2 size={14} className="mr-2" /> {t('common.deleteButton')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!isLoading && filteredUsers.length === 0 && (
            <p className="text-center text-purple-300 py-8">{t('dashboards.directiveDashboard.userManagement.noUsersFound')}</p>
          )}
        </div>
      </div>

      <Dialog open={isCreateStudentModalOpen} onOpenChange={(isOpen) => {
        setIsCreateStudentModalOpen(isOpen);
        if (!isOpen) setEditingUser(null);
      }}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>{editingUser ? t('dashboards.directiveDashboard.userManagement.editStudentTitle') : t('dashboards.directiveDashboard.userManagement.createStudentTitle')}</DialogTitle>
            <DialogDescription className="text-slate-400">
              {editingUser ? t('dashboards.directiveDashboard.userManagement.editStudentDesc') : t('dashboards.directiveDashboard.userManagement.createStudentDesc')}
            </DialogDescription>
          </DialogHeader>
          <CreateStudentForm 
            onStudentCreated={handleStudentCreated} 
            onStudentUpdated={handleStudentCreated}
            existingStudentData={editingUser}
            setIsOpen={setIsCreateStudentModalOpen}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>{t('dashboards.directiveDashboard.userManagement.confirmActionTitle')}</DialogTitle>
            <DialogDescription className="text-slate-400">
              {t('dashboards.directiveDashboard.userManagement.confirmActionDesc', { userName: userToConfirm?.full_name || 'este usuario' })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsConfirmModalOpen(false)} className="border-slate-600 hover:bg-slate-700">
              {t('common.cancelButton')}
            </Button>
            <Button onClick={handleConfirmAction} className="bg-red-600 hover:bg-red-700">
              {t('common.confirmButton')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </motion.div>
  );
};

export default UserManagementPage;