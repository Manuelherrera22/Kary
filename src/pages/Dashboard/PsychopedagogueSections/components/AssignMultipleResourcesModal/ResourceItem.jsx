import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { BookOpen, FileText as FileTextIcon, Video, Activity as ActivityIcon } from 'lucide-react';

const ResourceItem = ({ resource, isSelected, onToggleSelect, t }) => {
  const typeIconMapping = {
    guía: FileTextIcon,
    video: Video,
    actividad: ActivityIcon,
    documento: BookOpen,
    default: BookOpen,
  };
  const Icon = typeIconMapping[resource.type] || typeIconMapping.default;

  const typeLabelKeys = {
    guía: 'learningResourcesPage.typeGuia',
    video: 'learningResourcesPage.typeVideo',
    actividad: 'learningResourcesPage.typeActividad',
    documento: 'learningResourcesPage.typeDocumento',
  };
  const labelKey = typeLabelKeys[resource.type] || 'learningResourcesPage.typeUnknown';


  return (
    <div 
      className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 cursor-pointer
        ${isSelected ? 'bg-sky-500/20 border-sky-500 shadow-md' : 'bg-slate-700/50 border-slate-600 hover:bg-slate-600/70'}`}
      onClick={() => onToggleSelect(resource.id)}
    >
      <div className="flex items-center gap-3">
        <Icon size={20} className={isSelected ? "text-sky-300" : "text-slate-400"} />
        <div>
          <p className={`font-medium ${isSelected ? "text-sky-100" : "text-slate-200"}`}>{resource.title}</p>
          <p className={`text-xs ${isSelected ? "text-sky-300" : "text-slate-400"}`}>
            {t(labelKey, resource.type)}
          </p>
        </div>
      </div>
      <Checkbox checked={isSelected} onCheckedChange={() => onToggleSelect(resource.id)} className="border-slate-500 data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-600" />
    </div>
  );
};

export default ResourceItem;