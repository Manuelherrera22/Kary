import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarPlus as CalendarIcon, Edit3, Trash2, Brain, Book, Save, Send } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from '@/components/ui/badge';

const ActivityCard = ({ activity, onUpdate, onRemove, isEditable = true }) => {
  const { t, language } = useLanguage();
  const [editedActivity, setEditedActivity] = useState({ ...activity });
  const [isEditing, setIsEditing] = useState(false);

  const activityTypes = [
    { value: 'emotional', label: t('teacherDashboard.activityTypes.emotional'), icon: Brain },
    { value: 'academic', label: t('teacherDashboard.activityTypes.academic'), icon: Book },
  ];

  const handleInputChange = (field, value) => {
    setEditedActivity(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (date) => {
    setEditedActivity(prev => ({ ...prev, due_date: date ? date.toISOString() : null }));
  };

  const handleSave = () => {
    onUpdate(editedActivity);
    setIsEditing(false);
  };

  const currentTypeConfig = activityTypes.find(at => at.value === editedActivity.type) || activityTypes[0];
  const Icon = currentTypeConfig.icon;

  return (
    <Card 
      className={`bg-slate-800 border ${isEditing ? 'border-purple-500 shadow-purple-500/30' : 'border-slate-700'} shadow-lg rounded-xl overflow-hidden transition-all`}
      style={{ backgroundColor: '#0f172a', opacity: 1 }}
    >
      <CardHeader className="p-4 border-b border-slate-700">
        <div className="flex justify-between items-center">
          {isEditing ? (
            <Input
              value={editedActivity.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="text-lg font-semibold bg-slate-700 border-slate-600 text-white focus:ring-purple-500"
              placeholder={t('teacherDashboard.activityTitlePlaceholder')}
            />
          ) : (
            <CardTitle className="text-lg text-slate-100 flex items-center">
              <Icon size={20} className={`mr-2 ${editedActivity.type === 'emotional' ? 'text-pink-400' : 'text-sky-400'}`} />
              {editedActivity.title}
            </CardTitle>
          )}
          {isEditable && (
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)} className="text-slate-400 hover:text-purple-400">
              <Edit3 size={18} />
            </Button>
          )}
        </div>
        {editedActivity.status && (
            <Badge 
              variant={editedActivity.status === 'sent_to_student' ? 'success' : 'secondary'} 
              className="mt-2 text-xs w-fit"
            >
              {t(`teacherDashboard.activityStatus.${editedActivity.status}`, editedActivity.status)}
            </Badge>
        )}
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {isEditing ? (
          <>
            <Textarea
              value={editedActivity.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder={t('teacherDashboard.activityDescriptionPlaceholder')}
              className="min-h-[80px] bg-slate-700 border-slate-600 text-slate-200 focus:ring-purple-500"
            />
            <div className="grid grid-cols-2 gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal bg-slate-700 border-slate-600 hover:bg-slate-600 text-slate-200"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {editedActivity.due_date ? format(parseISO(editedActivity.due_date), "PPP", { locale: language === 'es' ? require('date-fns/locale/es') : require('date-fns/locale/en-US') }) : <span>{t('teacherDashboard.pickDate')}</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700" align="start">
                  <Calendar
                    mode="single"
                    selected={editedActivity.due_date ? parseISO(editedActivity.due_date) : null}
                    onSelect={handleDateChange}
                    initialFocus
                    className="text-white"
                  />
                </PopoverContent>
              </Popover>
              <Select value={editedActivity.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-200 focus:ring-purple-500">
                  <SelectValue placeholder={t('teacherDashboard.selectActivityType')} />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                  {activityTypes.map(type => (
                    <SelectItem key={type.value} value={type.value} className="hover:bg-slate-700 focus:bg-slate-600">
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <Button variant="outline" onClick={() => setIsEditing(false)} className="text-slate-300 border-slate-600 hover:bg-slate-700">
                {t('common.cancelButton')}
              </Button>
              <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700 text-white">
                <Save size={16} className="mr-2" /> {t('common.saveChangesButton')}
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-slate-300 min-h-[40px]">{editedActivity.description}</p>
            <div className="text-xs text-slate-400 flex items-center">
              <CalendarIcon className="mr-1.5 h-4 w-4 text-amber-400" />
              {t('teacherDashboard.dueDateLabel')}: {editedActivity.due_date ? format(parseISO(editedActivity.due_date), "PPP", { locale: language === 'es' ? require('date-fns/locale/es') : require('date-fns/locale/en-US') }) : t('common.notSpecified')}
            </div>
          </>
        )}
        {onRemove && isEditable && (
           <Button variant="ghost" size="sm" onClick={() => onRemove(activity.id)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 absolute top-3 right-12">
            <Trash2 size={16} />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityCard;