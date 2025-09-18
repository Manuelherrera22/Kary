import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/lib/supabaseClient.js';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/pages/Dashboard/hooks/useAuth';
import { Loader2, X, UploadCloud } from 'lucide-react';

const validResourceTypesForUpload = [
  { value: 'guía', labelKey: 'learningResourcesPage.typeGuia' },
  { value: 'actividad', labelKey: 'learningResourcesPage.typeActividad' },
  { value: 'video', labelKey: 'learningResourcesPage.typeVideo' },
  { value: 'documento', labelKey: 'learningResourcesPage.typeDocumento' },
];

const UploadRecursoModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      description: '',
      url: '',
      type: 'guía',
      tags: '',
      published: true,
    }
  });

  const onSubmit = async (formData) => {
    if (!user) {
      toast({
        title: t('toast.errorTitle'),
        description: t('learningResourcesPage.uploadErrorNoUser'),
        variant: 'destructive',
      });
      return;
    }

    if (!validResourceTypesForUpload.find(rt => rt.value === formData.type)) {
      toast({
        title: t('toast.warningTitle'),
        description: t('createResourceModal.validationErrorInvalidType'),
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      const resourceData = {
        title: formData.title,
        description: formData.description,
        url: formData.url,
        type: formData.type,
        tags: tagsArray,
        published: formData.published,
        created_by: user.id, 
      };

      const { error } = await supabase.from('learning_resources').insert([resourceData]);

      if (error) {
        throw error;
      }

      toast({
        title: t('toast.successTitle'),
        description: t('learningResourcesPage.uploadSuccess'),
      });
      reset();
      onUploadSuccess();
    } catch (error) {
      console.error('Error uploading resource:', error);
      toast({
        title: t('toast.errorTitle'),
        description: t('learningResourcesPage.uploadError') + (error.message ? `: ${error.message}` : ''),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); reset(); }}>
      <DialogContent className="sm:max-w-[525px] bg-slate-900 border-slate-700 text-slate-50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-amber-400">{t('learningResourcesPage.uploadModalTitle')}</DialogTitle>
          <DialogDescription className="text-slate-400">{t('learningResourcesPage.uploadModalDescription')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 py-4">
          <div>
            <Label htmlFor="title" className="text-slate-300">{t('learningResourcesPage.formFieldTitle')}</Label>
            <Input id="title" {...register('title', { required: t('learningResourcesPage.validationRequired') })} className="mt-1 bg-slate-800 border-slate-600 text-slate-50 focus:ring-amber-500 focus:border-amber-500" />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <Label htmlFor="description" className="text-slate-300">{t('learningResourcesPage.formFieldDescription')}</Label>
            <Textarea id="description" {...register('description')} className="mt-1 bg-slate-800 border-slate-600 text-slate-50 focus:ring-amber-500 focus:border-amber-500" />
          </div>

          <div>
            <Label htmlFor="url" className="text-slate-300">{t('learningResourcesPage.formFieldURL')}</Label>
            <Input id="url" type="url" {...register('url', { required: t('learningResourcesPage.validationRequired'), pattern: { value: /^(https?:\/\/).*/, message: t('learningResourcesPage.validationURL') } })} className="mt-1 bg-slate-800 border-slate-600 text-slate-50 focus:ring-amber-500 focus:border-amber-500" />
            {errors.url && <p className="text-red-500 text-xs mt-1">{errors.url.message}</p>}
          </div>

          <div>
            <Label htmlFor="type" className="text-slate-300">{t('learningResourcesPage.formFieldType')}</Label>
            <Controller
              name="type"
              control={control}
              rules={{ required: t('learningResourcesPage.validationRequired') }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger id="type" className="w-full mt-1 bg-slate-800 border-slate-600 text-slate-50 focus:ring-amber-500 focus:border-amber-500">
                    <SelectValue placeholder={t('learningResourcesPage.selectTypePlaceholder')} />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-slate-50">
                    {validResourceTypesForUpload.map(rt => (
                       <SelectItem key={rt.value} value={rt.value} className="hover:bg-slate-700">
                         {t(rt.labelKey, rt.value)}
                       </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="tags" className="text-slate-300">{t('learningResourcesPage.formFieldTags')}</Label>
            <Input id="tags" {...register('tags')} placeholder={t('learningResourcesPage.tagsPlaceholder')} className="mt-1 bg-slate-800 border-slate-600 text-slate-50 focus:ring-amber-500 focus:border-amber-500" />
            <p className="text-xs text-slate-500 mt-1">{t('learningResourcesPage.tagsHelperText')}</p>
          </div>

          <div className="flex items-center space-x-2">
            <Controller
                name="published"
                control={control}
                render={({ field }) => (
                    <Checkbox
                        id="published"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="border-slate-600 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-600"
                    />
                )}
            />
            <Label htmlFor="published" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-300">
              {t('learningResourcesPage.formFieldPublished')}
            </Label>
          </div>

          <DialogFooter className="sm:justify-between gap-2 pt-6">
            <Button type="button" variant="outline" onClick={() => { onClose(); reset(); }} className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-slate-100">
              <X size={18} className="mr-2" />{t('common.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
              {isSubmitting ? <Loader2 size={18} className="mr-2 animate-spin" /> : <UploadCloud size={18} className="mr-2" />}
              {t('learningResourcesPage.submitUploadButton')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadRecursoModal;