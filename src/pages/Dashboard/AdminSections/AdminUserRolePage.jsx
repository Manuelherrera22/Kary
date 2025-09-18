import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMockAuth } from '@/contexts/MockAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Users, Edit3, ShieldCheck, Trash2, Search, AlertTriangle } from 'lucide-react';
import LoadingScreen from '@/pages/Dashboard/components/LoadingScreen';

const AdminUserRolePage = () => {
  const { t } = useLanguage();
  const { loading: authLoading, refreshUserProfile } = useMockAuth(); 
  const { toast } = useToast();

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchUsersAndRoles = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: usersData, error: usersError } = await supabase
        .from('user_profiles')
        .select('id, full_name, email, role, status'); 
      if (usersError) throw usersError;
      setUsers(usersData || []);

      const { data: rolesData, error: rolesError } = await supabase
        .from('roles')
        .select('name, display_name_key');
      if (rolesError) throw rolesError;
      setRoles(rolesData || []);

    } catch (error) {
      console.error('Error fetching users or roles:', error);
      toast({ title: t('toast.errorTitle'), description: t('adminUserRolePage.errorFetchingData'), variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [t, toast]);

  useEffect(() => {
    fetchUsersAndRoles();
  }, [fetchUsersAndRoles]);

  const handleEditUser = (userToEdit) => {
    setEditingUser(userToEdit);
    setSelectedRole(userToEdit.role || '');
    setSelectedStatus(userToEdit.status || 'active');
    setIsEditModalOpen(true);
  };
  
  const handleSaveUserChanges = async () => {
    if (!editingUser || !selectedRole || !selectedStatus) {
      toast({ title: t('toast.errorTitle'), description: t('adminUserRolePage.errorAllFieldsRequiredModal'), variant: 'destructive'});
      return;
    }
    
    const targetUserId = editingUser.id; 

    if (!targetUserId) {
        toast({ title: t('toast.errorTitle'), description: t('adminUserRolePage.errorMissingUserId'), variant: 'destructive'});
        return;
    }

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ role: selectedRole, status: selectedStatus, updated_at: new Date().toISOString() })
        .eq('id', targetUserId); 
      
      if (error) throw error;

      toast({ title: t('toast.successTitle'), description: t('adminUserRolePage.updateSuccess', {userName: editingUser.full_name}) });
      setIsEditModalOpen(false);
      setEditingUser(null);
      fetchUsersAndRoles(); 
      
    } catch (error) {
      console.error('Error updating user role/status:', error);
      toast({ title: t('toast.errorTitle'), description: `${t('adminUserRolePage.updateError')}: ${error.message}`, variant: 'destructive' });
    }
  };
  
  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setIsConfirmDeleteModalOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    
    console.warn(`Simulating deletion of user: ${userToDelete.full_name} (ID: ${userToDelete.id})`);
    
    toast({ title: t('toast.infoTitle'), description: t('adminUserRolePage.deleteSimulation', {userName: userToDelete.full_name}) });
    setIsConfirmDeleteModalOpen(false);
    setUserToDelete(null);
  };


  const filteredUsers = users.filter(u => 
    (u.full_name && u.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (authLoading || isLoading) {
    return <LoadingScreen text={t('common.loadingText')} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-6"
    >
      <header className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-indigo-300 to-purple-300">
          {t('adminUserRolePage.pageTitle')}
        </h1>
        <p className="text-slate-300 mt-2 text-md sm:text-lg">
          {t('adminUserRolePage.pageSubtitle')}
        </p>
      </header>

      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-grow w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input 
            type="text"
            placeholder={t('adminUserRolePage.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-700 text-white focus:ring-sky-500 focus:border-sky-500 w-full"
          />
        </div>
      </div>

      <motion.div 
        className="bg-slate-800/70 border border-slate-700/50 rounded-xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Table className="min-w-full">
          <TableHeader className="bg-slate-700/50">
            <TableRow>
              <TableHead className="text-slate-300 px-4 py-3">{t('adminUserRolePage.table.name')}</TableHead>
              <TableHead className="text-slate-300 px-4 py-3">{t('adminUserRolePage.table.email')}</TableHead>
              <TableHead className="text-slate-300 px-4 py-3">{t('adminUserRolePage.table.role')}</TableHead>
              <TableHead className="text-slate-300 px-4 py-3">{t('adminUserRolePage.table.status')}</TableHead>
              <TableHead className="text-slate-300 px-4 py-3 text-right">{t('adminUserRolePage.table.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? filteredUsers.map((userItem) => (
              <TableRow key={userItem.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                <TableCell className="text-white px-4 py-3">{userItem.full_name || 'N/A'}</TableCell>
                <TableCell className="text-slate-300 px-4 py-3">{userItem.email  || 'N/A'}</TableCell>
                <TableCell className="text-slate-300 px-4 py-3 capitalize">{t(`roles.${userItem.role || 'notAssigned'}`, userItem.role || t('roles.notAssigned'))}</TableCell>
                <TableCell className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    userItem.status === 'active' ? 'bg-green-500/20 text-green-300' :
                    userItem.status === 'suspended' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {t(`adminUserRolePage.status.${userItem.status || 'unknown'}`, userItem.status || t('common.unknown'))}
                  </span>
                </TableCell>
                <TableCell className="text-right px-4 py-3">
                  <Button variant="ghost" size="sm" onClick={() => handleEditUser(userItem)} className="text-sky-400 hover:text-sky-300 mr-2">
                    <Edit3 size={16} className="mr-1" /> {t('common.editButton')}
                  </Button>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-slate-400 py-10">
                  {t('adminUserRolePage.noUsersFound')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </motion.div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-sky-300">{t('adminUserRolePage.editUserTitle', { userName: editingUser?.full_name || t('common.thisUser') })}</DialogTitle>
            <DialogDescription className="text-slate-400">
              {t('adminUserRolePage.editUserDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <label htmlFor="edit-role" className="block text-sm font-medium text-slate-300 mb-1">
                {t('adminUserRolePage.assignRoleLabel')}
              </label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger id="edit-role" className="w-full bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder={t('adminUserRolePage.selectRolePlaceholder')} />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 text-white border-slate-600">
                  {roles.map(role => (
                    <SelectItem key={role.name} value={role.name} className="focus:bg-sky-600">
                      {t(role.display_name_key, role.name)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="edit-status" className="block text-sm font-medium text-slate-300 mb-1">
                {t('adminUserRolePage.statusLabel')}
              </label>
              <Select 
                value={selectedStatus} 
                onValueChange={setSelectedStatus}
              >
                <SelectTrigger id="edit-status" className="w-full bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder={t('adminUserRolePage.selectStatusPlaceholder')} />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 text-white border-slate-600">
                  <SelectItem value="active" className="focus:bg-green-600">{t('adminUserRolePage.status.active')}</SelectItem>
                  <SelectItem value="suspended" className="focus:bg-yellow-600">{t('adminUserRolePage.status.suspended')}</SelectItem>
                  <SelectItem value="inactive" className="focus:bg-red-600">{t('adminUserRolePage.status.inactive')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)} className="text-slate-300 border-slate-600 hover:bg-slate-700 hover:text-white">
              {t('common.cancelButton')}
            </Button>
            <Button onClick={handleSaveUserChanges} className="bg-sky-600 hover:bg-sky-700">
              <ShieldCheck size={18} className="mr-2" />
              {t('common.saveChangesButton')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isConfirmDeleteModalOpen} onOpenChange={setIsConfirmDeleteModalOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-red-400 flex items-center">
              <AlertTriangle size={24} className="mr-2" /> 
              {t('adminUserRolePage.confirmDeleteTitle')}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {t('adminUserRolePage.confirmDeleteDescription', {userName: userToDelete?.full_name || t('common.thisUser')})}
              <br/>
              {t('adminUserRolePage.confirmDeleteWarning')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDeleteModalOpen(false)} className="text-slate-300 border-slate-600 hover:bg-slate-700 hover:text-white">
              {t('common.cancelButton')}
            </Button>
            <Button onClick={confirmDeleteUser} className="bg-red-600 hover:bg-red-700">
              <Trash2 size={18} className="mr-2" />
              {t('adminUserRolePage.confirmDeleteButton')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </motion.div>
  );
};

export default AdminUserRolePage;