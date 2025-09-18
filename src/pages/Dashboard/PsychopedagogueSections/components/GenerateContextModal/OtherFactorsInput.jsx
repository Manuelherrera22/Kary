import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const OtherFactorsInput = ({ otherFactors, setOtherFactors, t }) => {
  return (
    <div className="space-y-1">
      <Label htmlFor="otherFactors" className="text-slate-300">{t('supportPlans.generateContextModal.otherFactorsLabel')}</Label>
      <Textarea
        id="otherFactors"
        value={otherFactors}
        onChange={(e) => setOtherFactors(e.target.value)}
        placeholder={t('supportPlans.generateContextModal.otherFactorsPlaceholder')}
        className="bg-slate-800 border-slate-700 min-h-[100px] focus:ring-cyan-500"
      />
    </div>
  );
};

export default OtherFactorsInput;