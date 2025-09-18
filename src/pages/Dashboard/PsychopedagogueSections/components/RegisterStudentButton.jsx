import React, { useState } from 'react';
import RegisterStudentModal from '@/pages/Dashboard/PsychopedagogueSections/components/RegisterStudentModal';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { UserPlus } from 'lucide-react';

export default function RegisterStudentButton({ onStudentCreated }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline" className="bg-sky-500 hover:bg-sky-600 text-white border-sky-500 hover:border-sky-600">
        <UserPlus size={18} className="mr-2" />
        {t('registerStudentModal.registerButtonText')}
      </Button>
      <RegisterStudentModal 
        open={open} 
        onClose={() => setOpen(false)} 
        onStudentCreated={onStudentCreated} 
      />
    </>
  );
}