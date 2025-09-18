import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import EditableBlock from './EditableBlock';
import { Button } from '@/components/ui/button';
import { Save, Loader2, PlusCircle, Send } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';

const PlanEditor = ({ initialPlanBlocks, onSave, isLoading }) => {
  const { t } = useLanguage();
  const [planBlocks, setPlanBlocks] = useState(initialPlanBlocks || []);

  useEffect(() => {
    setPlanBlocks(initialPlanBlocks || []);
  }, [initialPlanBlocks]);


  const updateBlockContent = (id, newContent, newTitle) => {
    setPlanBlocks(planBlocks.map(block => (block.id === id ? { ...block, content: newContent, title: newTitle } : block)));
  };

  const deleteBlock = (id) => {
    setPlanBlocks(planBlocks.filter(block => block.id !== id));
  };

  const moveBlock = (index, direction) => {
    const newPlanBlocks = [...planBlocks];
    const [movedBlock] = newPlanBlocks.splice(index, 1);
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < planBlocks.length + 1) {
      newPlanBlocks.splice(newIndex, 0, movedBlock);
      setPlanBlocks(newPlanBlocks);
    }
  };

  const addCustomBlock = () => {
    const newBlock = {
      id: `custom-${Date.now()}`,
      key: 'custom', // Make sure this key matches a config in EditableBlock
      title: t('supportPlans.aiCanvas.blockTypes.custom'),
      content: t('supportPlans.aiCanvas.customBlockPlaceholder'),
    };
    setPlanBlocks([...planBlocks, newBlock]);
  };

  const handleSaveAndAssign = () => {
    onSave(planBlocks, true); 
  };

  const handleJustSave = () => {
    onSave(planBlocks, false); 
  };


  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">{t('supportPlans.aiCanvas.step3Title')}</h3>
        <p className="text-slate-400 text-sm mt-1">{t('supportPlans.aiCanvas.editInstruction')}</p>
      </div>
      <ScrollArea className="h-[calc(70vh - 200px)] pr-4 rounded-lg border border-slate-700/50 bg-slate-800/30 p-2 shadow-inner">
        <div className="space-y-4 p-2">
          {(planBlocks || []).map((block, index) => (
            <EditableBlock
              key={block.id || `block-${index}`}
              id={block.id || `block-${index}`}
              blockKey={block.key || 'default'}
              title={block.title}
              content={block.content}
              onUpdate={updateBlockContent}
              onDelete={deleteBlock}
              onMove={moveBlock}
              index={index}
              isFirst={index === 0}
              isLast={index === (planBlocks || []).length - 1}
            />
          ))}
        </div>
      </ScrollArea>
      <div className="flex flex-col sm:flex-row justify-between items-center mt-8 pt-4 border-t border-slate-700 gap-4">
        <Button onClick={addCustomBlock} variant="outline" className="border-dashed border-purple-500 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300 transition-colors w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          {t('supportPlans.aiCanvas.addCustomBlock')}
        </Button>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button onClick={handleJustSave} disabled={isLoading} className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-6 py-3 text-base font-semibold shadow-lg hover:shadow-green-500/40 transition-all transform hover:scale-105 w-full sm:w-auto">
            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
            {t('supportPlans.aiCanvas.savePlanButton')}
          </Button>
          <Button onClick={handleSaveAndAssign} disabled={isLoading} className="bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white px-6 py-3 text-base font-semibold shadow-lg hover:shadow-sky-500/40 transition-all transform hover:scale-105 w-full sm:w-auto">
            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Send className="mr-2 h-5 w-5" />}
            {t('supportPlans.aiCanvas.assignPlanButton')}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default PlanEditor;