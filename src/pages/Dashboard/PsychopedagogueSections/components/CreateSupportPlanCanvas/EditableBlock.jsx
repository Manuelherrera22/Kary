import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { GripVertical, Trash2, Edit, Save, ArrowUp, ArrowDown, ClipboardCheck, Lightbulb, Heart, Users, Flag, MessageSquare } from 'lucide-react';

const blockConfig = {
  diagnosis: { icon: ClipboardCheck, color: 'text-blue-400', titleKey: 'supportPlans.aiCanvas.blockTypes.diagnosis' },
  recommendations: { icon: Lightbulb, color: 'text-yellow-400', titleKey: 'supportPlans.aiCanvas.blockTypes.recommendations' },
  emotionalSupport: { icon: Heart, color: 'text-pink-400', titleKey: 'supportPlans.aiCanvas.blockTypes.emotionalSupport' },
  familyTips: { icon: Users, color: 'text-green-400', titleKey: 'supportPlans.aiCanvas.blockTypes.familyTips' },
  trackingIndicators: { icon: Flag, color: 'text-red-400', titleKey: 'supportPlans.aiCanvas.blockTypes.trackingIndicators' },
  custom: { icon: MessageSquare, color: 'text-purple-400', titleKey: 'supportPlans.aiCanvas.blockTypes.custom'},
  default: { icon: Edit, color: 'text-slate-400', titleKey: 'supportPlans.aiCanvas.blockTypes.default' },
};

const EditableBlock = ({ id, blockKey, title: propTitle, content, onUpdate, onDelete, onMove, index, isFirst, isLast }) => {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [currentContent, setCurrentContent] = useState(typeof content === 'string' ? content : JSON.stringify(content, null, 2));
  const [currentTitle, setCurrentTitle] = useState(propTitle);

  const { icon: Icon, color, titleKey } = blockConfig[blockKey] || blockConfig.default;
  const displayTitle = currentTitle || t(titleKey, propTitle);

  const handleSave = () => {
    onUpdate(id, currentContent, currentTitle);
    setIsEditing(false);
  };
  
  const renderContent = () => {
    if (isEditing) {
      return (
        <Textarea
          value={currentContent}
          onChange={(e) => setCurrentContent(e.target.value)}
          className="w-full min-h-[120px] bg-slate-900 border-slate-600 focus:ring-purple-500 text-slate-200"
          autoFocus
        />
      );
    }
    if(typeof content === 'object' && content !== null){
      return <pre className="text-sm whitespace-pre-wrap p-3 bg-slate-800/50 rounded-md border border-slate-700 text-slate-300">{JSON.stringify(content, null, 2)}</pre>;
    }
    return <p className="text-slate-300 whitespace-pre-line leading-relaxed">{content}</p>;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "circOut" }}
      className="p-4 bg-gradient-to-br from-slate-800/80 to-slate-850/70 rounded-xl border border-slate-700/80 flex gap-4 shadow-lg hover:shadow-purple-500/20 transition-shadow"
    >
      <div className="flex flex-col items-center gap-2 text-slate-500 pt-1">
        <GripVertical className="cursor-grab text-slate-600 hover:text-purple-400 transition-colors" />
        <Button variant="ghost" size="icon" disabled={isFirst} onClick={() => onMove(index, 'up')} className="h-7 w-7 disabled:opacity-30 text-slate-400 hover:text-sky-400 transition-colors"><ArrowUp size={18} /></Button>
        <Button variant="ghost" size="icon" disabled={isLast} onClick={() => onMove(index, 'down')} className="h-7 w-7 disabled:opacity-30 text-slate-400 hover:text-sky-400 transition-colors"><ArrowDown size={18} /></Button>
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-3">
          {isEditing ? (
            <Input 
              value={currentTitle}
              onChange={(e) => setCurrentTitle(e.target.value)}
              className={`font-semibold text-lg ${color} bg-slate-900 border-slate-600 focus:ring-purple-500 w-2/3`}
              placeholder={t('supportPlans.aiCanvas.blockTitlePlaceholder')}
            />
          ) : (
            <h4 className={`flex items-center gap-2 font-semibold text-lg ${color}`}>
              <Icon size={20} />
              {displayTitle}
            </h4>
          )}
          <div className="flex items-center gap-2">
            {isEditing ? (
              <Button size="sm" onClick={handleSave} className="bg-green-600 hover:bg-green-700 h-9 text-white shadow-md hover:shadow-green-500/40 transition-all">
                <Save size={16} className="mr-1.5" /> {t('common.saveButton')}
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="h-9 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
                <Edit size={16} className="mr-1.5" /> {t('common.editButton')}
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={() => onDelete(id)} className="text-red-500 hover:bg-red-500/10 hover:text-red-400 h-9 w-9 transition-colors">
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
        <div className="prose prose-invert prose-sm max-w-none text-slate-300">
          {renderContent()}
        </div>
      </div>
    </motion.div>
  );
};

export default EditableBlock;