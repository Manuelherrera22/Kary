import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Type, FileText as FileTextIcon, Link as LinkIcon, Tag, Video as VideoIcon, Activity } from 'lucide-react';

const validResourceTypes = [
  { value: 'guía', labelKey: 'createResourceModal.types.guide', icon: FileTextIcon },
  { value: 'actividad', labelKey: 'createResourceModal.types.activity', icon: Activity },
  { value: 'video', labelKey: 'createResourceModal.types.video', icon: VideoIcon },
  { value: 'documento', labelKey: 'createResourceModal.types.document', icon: FileTextIcon },
];

const ResourceForm = ({ formData, onFormChange, t }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFormChange(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    onFormChange(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name, checked) => {
    onFormChange(prev => ({ ...prev, [name]: checked }));
  };

  return (
    <div className="grid gap-4 py-4 pr-3">
      <div className="space-y-1">
        <Label htmlFor="resource-title" className="text-slate-300 flex items-center">
          <FileTextIcon size={16} className="mr-2 text-sky-400" />
          {t('createResourceModal.resourceTitleLabel')} <span className="text-red-500 ml-1">*</span>
        </Label>
        <Input 
          id="resource-title" 
          name="title"
          value={formData.title} 
          onChange={handleInputChange} 
          placeholder={t('createResourceModal.resourceTitlePlaceholder')}
          className="bg-slate-700 border-slate-600 text-slate-50 focus:ring-sky-500" 
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="resource-type" className="text-slate-300 flex items-center">
          <Type size={16} className="mr-2 text-sky-400" />
          {t('createResourceModal.resourceTypeLabel')} <span className="text-red-500 ml-1">*</span>
        </Label>
        <Select name="type" value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
          <SelectTrigger id="resource-type" className="w-full bg-slate-700 border-slate-600 text-slate-50 focus:ring-sky-500">
            <SelectValue placeholder={t('createResourceModal.resourceTypePlaceholder')} />
          </SelectTrigger>
          <SelectContent className="bg-slate-700 border-slate-600 text-slate-50">
            {validResourceTypes.map((rt) => {
              const Icon = rt.icon;
              return (
                <SelectItem key={rt.value} value={rt.value} className="hover:bg-slate-600 focus:bg-slate-600">
                  <div className="flex items-center">
                    <Icon size={16} className="mr-2 opacity-70" /> {t(rt.labelKey, rt.value)}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label htmlFor="resource-description" className="text-slate-300 flex items-center">
          <FileTextIcon size={16} className="mr-2 text-sky-400" />
          {t('createResourceModal.resourceDescriptionLabel')}
        </Label>
        <Textarea 
          id="resource-description" 
          name="description"
          value={formData.description} 
          onChange={handleInputChange} 
          placeholder={t('createResourceModal.resourceDescriptionPlaceholder')}
          className="bg-slate-700 border-slate-600 text-slate-50 focus:ring-sky-500 min-h-[80px]"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="resource-url" className="text-slate-300 flex items-center">
          <LinkIcon size={16} className="mr-2 text-sky-400" />
          {t('createResourceModal.resourceUrlLabel')}
        </Label>
        <Input 
          id="resource-url" 
          name="url"
          type="url"
          value={formData.url} 
          onChange={handleInputChange} 
          placeholder={t('createResourceModal.resourceUrlPlaceholder')}
          className="bg-slate-700 border-slate-600 text-slate-50 focus:ring-sky-500" 
        />
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="resource-tags" className="text-slate-300 flex items-center">
          <Tag size={16} className="mr-2 text-sky-400" />
          {t('createResourceModal.resourceTagsLabel')}
        </Label>
        <Input 
          id="resource-tags" 
          name="tags"
          value={formData.tags} 
          onChange={handleInputChange} 
          placeholder={t('createResourceModal.resourceTagsPlaceholder')}
          className="bg-slate-700 border-slate-600 text-slate-50 focus:ring-sky-500" 
        />
        <p className="text-xs text-slate-400">{t('createResourceModal.resourceTagsHint')}</p>
      </div>

      <div className="flex items-center space-x-2 pt-2">
        <Switch 
          id="resource-published" 
          name="published"
          checked={formData.published} 
          onCheckedChange={(checked) => handleSwitchChange('published', checked)}
          className="data-[state=checked]:bg-sky-500 data-[state=unchecked]:bg-slate-600"
        />
        <Label htmlFor="resource-published" className="text-slate-300">
          {t('createResourceModal.publishResourceLabel')}
        </Label>
      </div>
    </div>
  );
};

export default ResourceForm;