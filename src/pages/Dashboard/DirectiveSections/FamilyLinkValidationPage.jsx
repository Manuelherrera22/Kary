import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { UserCheck, ShieldCheck, Link as LinkIcon, AlertTriangle, Search, Users, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import LoadingScreen from '@/pages/Dashboard/components/LoadingScreen';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const FamilyLinkValidationPage = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [requests, setRequests] = useState([]);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState(''); 

  const fetchLinkRequests = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('family_link_requests')
        .select(`
          id, created_at, status, request_code,
          parent:parent_user_id (id, full_name, email),
          student:student_user_id (id, full_name, email, grade)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setRequests(data.filter(req => req.status === 'pending'));
      setHistory(data.filter(req => req.status !== 'pending'));
    } catch (error) {
      console.error('Error fetching link requests:', error);
      toast({ title: t('common.errorTitle'), description: t('directive.familyValidation.fetchError'), variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [t, toast]);

  useEffect(() => {
    fetchLinkRequests();
  }, [fetchLinkRequests]);

  const handleAction = async () => {
    if (!selectedRequest || !actionType) return;
    
    setIsLoading(true);
    try {
      const { data: updatedRequest, error: updateError } = await supabase
        .from('family_link_requests')
        .update({ status: actionType, validated_at: new Date().toISOString() }) 
        .eq('id', selectedRequest.id)
        .select()
        .single();

      if (updateError) throw updateError;

      if (actionType === 'approved') {
        const { error: linkError } = await supabase
          .from('parent_student_links')
          .upsert({
            parent_user_id: selectedRequest.parent.id,
            student_user_id: selectedRequest.student.id,
            validation_status: 'validated',
            validation_code: selectedRequest.request_code,
            validation_requested_at: selectedRequest.created_at,
            updated_at: new Date().toISOString()
          }, { 
            onConflict: 'parent_user_id, student_user_id',
            ignoreDuplicates: false 
          });
          
        if (linkError) {
          console.warn("Error upserting to parent_student_links, but request status updated:", linkError);
           toast({ title: t('common.warningTitle'), description: t('directive.familyValidation.linkUpsertWarning', {details: linkError.message}), variant: 'default' });
        }
      }
      
      toast({ title: t('common.successTitle'), description: t(`directive.familyValidation.${actionType}Success`) });
      fetchLinkRequests(); 
    } catch (error) {
      console.error(`Error ${actionType}ing request:`, error);
      toast({ title: t('common.errorTitle'), description: t('directive.familyValidation.actionError'), variant: 'destructive' });
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
      setSelectedRequest(null);
    }
  };

  const openModal = (request, type) => {
    setSelectedRequest(request);
    setActionType(type);
    setIsModalOpen(true);
  };

  const filteredRequests = requests.filter(req =>
    req.parent?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.student?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.request_code?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredHistory = history.filter(req =>
    req.parent?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.student?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.request_code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return <Badge variant="outline" className="border-yellow-500 text-yellow-400 bg-yellow-900/30">{t('directive.familyValidation.statusPending')}</Badge>;
      case 'approved': return <Badge variant="outline" className="border-green-500 text-green-400 bg-green-900/30">{t('directive.familyValidation.statusApproved')}</Badge>;
      case 'rejected': return <Badge variant="outline" className="border-red-500 text-red-400 bg-red-900/30">{t('directive.familyValidation.statusRejected')}</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading && requests.length === 0 && history.length === 0) return <LoadingScreen text={t('common.loadingText')} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-6 bg-gradient-to-br from-slate-900 via-purple-900 to-pink-800 min-h-screen text-white"
    >
      <header className="mb-8 text-center">
        <LinkIcon size={48} className="mx-auto mb-4 text-emerald-400" />
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-sky-400 to-purple-400">
          {t('directive.familyValidation.pageTitle')}
        </h1>
        <p className="text-slate-400 mt-2 max-w-2xl mx-auto">
          {t('directive.familyValidation.pageDescription')}
        </p>
      </header>

      <Card className="bg-slate-800/70 border-slate-700 shadow-xl mb-8">
        <CardHeader>
          <CardTitle className="text-xl text-pink-400 flex items-center">
            <Clock className="mr-2" /> {t('directive.familyValidation.pendingRequestsTitle')}
          </CardTitle>
          <CardDescription className="text-slate-400">{t('directive.familyValidation.pendingRequestsDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 relative">
            <Input
              type="text"
              placeholder={t('directive.familyValidation.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-1/2 bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:ring-pink-500 pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          </div>
          {isLoading && filteredRequests.length === 0 ? <p className="text-center text-slate-400 py-4">{t('common.loadingText')}</p> : 
            filteredRequests.length === 0 ? <p className="text-center text-slate-400 py-4">{t('directive.familyValidation.noPendingRequests')}</p> : (
            <ScrollArea className="h-[300px]">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700 hover:bg-slate-700/30">
                    <TableHead className="text-pink-300">{t('directive.familyValidation.table.parent')}</TableHead>
                    <TableHead className="text-pink-300">{t('directive.familyValidation.table.student')}</TableHead>
                    <TableHead className="text-pink-300">{t('directive.familyValidation.table.grade')}</TableHead>
                    <TableHead className="text-pink-300">{t('directive.familyValidation.table.requestCode')}</TableHead>
                    <TableHead className="text-pink-300">{t('directive.familyValidation.table.date')}</TableHead>
                    <TableHead className="text-right text-pink-300">{t('directive.familyValidation.table.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map(req => (
                    <TableRow key={req.id} className="border-slate-700 hover:bg-slate-700/30">
                      <TableCell>{req.parent?.full_name || 'N/A'}</TableCell>
                      <TableCell>{req.student?.full_name || 'N/A'}</TableCell>
                      <TableCell>{req.student?.grade || 'N/A'}</TableCell>
                      <TableCell>{req.request_code || 'N/A'}</TableCell>
                      <TableCell>{format(new Date(req.created_at), 'PPP', { locale: es })}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => openModal(req, 'approved')} className="text-green-400 hover:text-green-300 hover:bg-green-500/20">
                          <CheckCircle size={18} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openModal(req, 'rejected')} className="text-red-400 hover:text-red-300 hover:bg-red-500/20">
                          <XCircle size={18} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
      
      <Card className="bg-slate-800/70 border-slate-700 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl text-sky-400 flex items-center">
             {t('directive.familyValidation.historyTitle')}
          </CardTitle>
           <CardDescription className="text-slate-400">{t('directive.familyValidation.historyDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
            {isLoading && filteredHistory.length === 0 ? <p className="text-center text-slate-400 py-4">{t('common.loadingText')}</p> :
            filteredHistory.length === 0 ? <p className="text-center text-slate-400 py-4">{t('directive.familyValidation.noHistory')}</p> : (
             <ScrollArea className="h-[300px]">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700 hover:bg-slate-700/30">
                    <TableHead className="text-sky-300">{t('directive.familyValidation.table.parent')}</TableHead>
                    <TableHead className="text-sky-300">{t('directive.familyValidation.table.student')}</TableHead>
                    <TableHead className="text-sky-300">{t('directive.familyValidation.table.status')}</TableHead>
                    <TableHead className="text-sky-300">{t('directive.familyValidation.table.validationDate')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.map(req => (
                    <TableRow key={req.id} className="border-slate-700 hover:bg-slate-700/30">
                      <TableCell>{req.parent?.full_name || 'N/A'}</TableCell>
                      <TableCell>{req.student?.full_name || 'N/A'}</TableCell>
                      <TableCell>{getStatusBadge(req.status)}</TableCell>
                      <TableCell>{req.validated_at ? format(new Date(req.validated_at), 'PPP p', { locale: es }) : 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
            )}
        </CardContent>
      </Card>


      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl text-pink-400">{t('directive.familyValidation.confirmActionTitle')}</DialogTitle>
            <DialogDescription className="text-slate-400">
              {t(actionType === 'approved' ? 'directive.familyValidation.confirmApproveDesc' : 'directive.familyValidation.confirmRejectDesc', { 
                parentName: selectedRequest?.parent?.full_name, 
                studentName: selectedRequest?.student?.full_name 
              })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline" className="text-slate-300 border-slate-600 hover:bg-slate-700">
                {t('common.cancelButton')}
              </Button>
            </DialogClose>
            <Button 
              onClick={handleAction} 
              disabled={isLoading}
              className={actionType === 'approved' ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
            >
              {isLoading ? t('common.savingButton') : t(actionType === 'approved' ? 'directive.familyValidation.approveButton' : 'directive.familyValidation.rejectButton')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </motion.div>
  );
};

export default FamilyLinkValidationPage;