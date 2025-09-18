import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Edit3, Paperclip, UploadCloud, Info, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabaseClient';

const StudentPiarSection = ({ studentData, studentId, canEditPiar, currentUserRole }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isEditingDiagnosis, setIsEditingDiagnosis] = useState(false);
  const [isEditingArea, setIsEditingArea] = useState(false);
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  
  const [institutionalDiagnosis, setInstitutionalDiagnosis] = useState(studentData?.piar_institutional_diagnosis || '');
  const [assignedArea, setAssignedArea] = useState(studentData?.piar_assigned_area || '');
  const [piarSummary, setPiarSummary] = useState(studentData?.piar_summary || '');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSave = async (field, value, successMsgKey, errorMsgKey, setStateFn) => {
    try {
      const updateData = { updated_at: new Date().toISOString() };
      updateData[field] = value;

      const { error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', studentId);

      if (error) throw error;
      
      setStateFn(false); // Close editing mode
      // Optionally update studentData in parent or refetch
      toast({ title: t('toast.successTitle'), description: t(successMsgKey), className: "bg-green-500 dark:bg-green-700 text-white" });
    } catch (error) {
      console.error(`Error saving ${field}:`, error);
      toast({ title: t('toast.errorTitle'), description: t(errorMsgKey), variant: 'destructive' });
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast({ title: t('toast.warningTitle'), description: t('studentProfilePage.piar.noFileSelected'), variant: "default" });
      return;
    }
    if (!studentId) {
      toast({ title: t('toast.errorTitle'), description: "Student ID is missing.", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    try {
      const fileName = `${studentId}/piar_documents/${Date.now()}_${selectedFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('student_documents') 
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('student_documents')
        .getPublicUrl(fileName);

      const documentUrl = publicUrlData.publicUrl;

      const { error: dbError } = await supabase
        .from('user_profiles')
        .update({ piar_document_url: documentUrl, updated_at: new Date().toISOString() })
        .eq('id', studentId);

      if (dbError) throw dbError;
      
      // Update local state if studentData is managed here, or inform parent
      studentData.piar_document_url = documentUrl; 
      setSelectedFile(null);
      toast({ title: t('toast.successTitle'), description: t('studentProfilePage.piar.fileUploadSuccess'), className: "bg-green-500 dark:bg-green-700 text-white" });
    } catch (error) {
      console.error("Error uploading PIAR document:", error);
      toast({ title: t('toast.errorTitle'), description: t('studentProfilePage.piar.fileUploadError'), variant: 'destructive' });
    } finally {
      setIsUploading(false);
    }
  };
  
  const renderEditableField = (labelKey, value, setValue, editing, setEditing, fieldName, successMsgKey, errorMsgKey, isTextArea = false) => (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <Label className="text-lg font-semibold text-sky-200">{t(labelKey)}</Label>
        {canEditPiar && !editing && (
          <Button variant="ghost" size="sm" onClick={() => setEditing(true)} className="text-sky-400 hover:text-sky-300">
            <Edit3 size={16} className="mr-1" /> {t('common.editButton')}
          </Button>
        )}
      </div>
      {editing && canEditPiar ? (
        <div className="space-y-2">
          {isTextArea ? (
            <Textarea value={value} onChange={(e) => setValue(e.target.value)} rows={4} className="bg-slate-700 border-slate-600 text-white focus:ring-sky-500" />
          ) : (
            <Input value={value} onChange={(e) => setValue(e.target.value)} className="bg-slate-700 border-slate-600 text-white focus:ring-sky-500" />
          )}
          <div className="flex gap-2">
            <Button onClick={() => handleSave(fieldName, value, successMsgKey, errorMsgKey, setEditing)} size="sm" className="bg-green-600 hover:bg-green-700">{t('common.saveButton')}</Button>
            <Button variant="outline" size="sm" onClick={() => { setEditing(false); /* Reset value if needed */ }} className="text-slate-300 border-slate-500 hover:bg-slate-600">{t('common.cancelButton')}</Button>
          </div>
        </div>
      ) : (
        <p className="text-slate-300 p-3 bg-slate-700/50 rounded-md min-h-[40px] whitespace-pre-wrap">
          {value || t('common.notAvailable')}
        </p>
      )}
    </div>
  );


  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Card className="bg-slate-800/60 border-slate-700/70 text-white shadow-xl hover:shadow-sky-500/10 transition-shadow duration-300">
        <CardHeader className="border-b border-slate-700/50 pb-4">
          <div className="flex items-center">
            <FileText size={28} className="mr-3 text-sky-400" />
            <div>
              <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-purple-400">
                {t('studentProfilePage.piar.title')}
              </CardTitle>
              <CardDescription className="text-slate-400">{t('studentProfilePage.piar.description')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          
          {renderEditableField(
            'studentProfilePage.piar.diagnosisLabel',
            institutionalDiagnosis,
            setInstitutionalDiagnosis,
            isEditingDiagnosis,
            setIsEditingDiagnosis,
            'piar_institutional_diagnosis',
            'studentProfilePage.piar.diagnosisUpdateSuccess',
            'studentProfilePage.piar.diagnosisUpdateError',
            true 
          )}

          {renderEditableField(
            'studentProfilePage.piar.assignedAreaLabel',
            assignedArea,
            setAssignedArea,
            isEditingArea,
            setIsEditingArea,
            'piar_assigned_area',
            'studentProfilePage.piar.areaUpdateSuccess',
            'studentProfilePage.piar.areaUpdateError'
          )}

          {renderEditableField(
            'studentProfilePage.piar.summaryLabel',
            piarSummary,
            setPiarSummary,
            isEditingSummary,
            setIsEditingSummary,
            'piar_summary',
            'studentProfilePage.piar.summaryUpdateSuccess',
            'studentProfilePage.piar.summaryUpdateError',
            true
          )}

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <Label className="text-lg font-semibold text-sky-200">{t('studentProfilePage.piar.documentLabel')}</Label>
            </div>
            {studentData?.piar_document_url ? (
              <div className="flex items-center space-x-3 p-3 bg-slate-700/50 rounded-md">
                <Paperclip size={20} className="text-green-400" />
                <a href={studentData.piar_document_url} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline flex-grow truncate">
                  {t('studentProfilePage.piar.viewDocument')}
                </a>
                {canEditPiar && (
                   <Button variant="ghost" size="sm" onClick={() => { studentData.piar_document_url = null; handleSave('piar_document_url', null, 'studentProfilePage.piar.documentRemoveSuccess', 'studentProfilePage.piar.documentRemoveError', () => {}); }} className="text-red-400 hover:text-red-300">
                     {t('common.removeButton')}
                   </Button>
                )}
              </div>
            ) : (
              <p className="text-slate-400 p-3 bg-slate-700/50 rounded-md">{t('studentProfilePage.piar.noDocumentUploaded')}</p>
            )}
            {canEditPiar && (
              <div className="mt-4 space-y-2">
                <Label htmlFor="piar-file-upload" className="text-sm text-slate-400">{t('studentProfilePage.piar.uploadNewDocument')}</Label>
                <div className="flex gap-2 items-center">
                  <Input id="piar-file-upload" type="file" onChange={handleFileChange} className="flex-grow bg-slate-700 border-slate-600 text-slate-300 file:mr-2 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-sky-600 file:text-white hover:file:bg-sky-700" />
                  <Button onClick={handleFileUpload} disabled={isUploading || !selectedFile} size="sm" className="bg-sky-600 hover:bg-sky-700">
                    {isUploading ? <UploadCloud size={16} className="mr-1 animate-pulse" /> : <UploadCloud size={16} className="mr-1" />}
                    {isUploading ? t('common.uploadingButton') : t('common.uploadButton')}
                  </Button>
                </div>
                {selectedFile && <p className="text-xs text-slate-500">{t('studentProfilePage.piar.selectedFileLabel')}: {selectedFile.name}</p>}
              </div>
            )}
          </div>

          {!canEditPiar && (
             <div className="mt-6 p-3 bg-sky-900/30 border border-sky-700/50 rounded-md flex items-center text-sm text-sky-300">
                <Info size={18} className="mr-2 flex-shrink-0" />
                <span>{t('studentProfilePage.readOnlyMessage')}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StudentPiarSection;