import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, User, Users2, Info } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const AssignedUsersList = ({ title, assignments, onRemove, isLoading, itemType }) => {
  const { t } = useLanguage();

  if (isLoading) {
    return <p className="text-slate-400 mt-2">{t('common.loadingText')}</p>;
  }

  return (
    <Card className="mt-6 bg-slate-700/30 border-slate-600">
      <CardHeader>
        <CardTitle className="text-lg text-pink-300 flex items-center">
          {itemType === 'teacher' ? <Users2 className="mr-2 h-5 w-5" /> : <User className="mr-2 h-5 w-5" />}
          {title}
        </CardTitle>
        {assignments.length === 0 && (
          <CardDescription className="text-slate-400">{t('assignments.noAssignments')}</CardDescription>
        )}
      </CardHeader>
      {assignments.length > 0 && (
        <CardContent>
          <ScrollArea className="h-[200px] pr-3">
            <ul className="space-y-2">
              {assignments.map((assignment) => (
                <li 
                  key={assignment.id} 
                  className="flex items-center justify-between p-3 bg-slate-600/40 rounded-md hover:bg-slate-600/60 transition-colors"
                >
                  <span className="text-sm text-slate-200">{assignment.userFullName || assignment.userName || t('common.notSpecified')}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onRemove(assignment.id)}
                    className="text-red-400 hover:bg-red-500/20 hover:text-red-300"
                    title={t('common.deleteButton')}
                  >
                    <Trash2 size={16} />
                  </Button>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </CardContent>
      )}
    </Card>
  );
};

export default AssignedUsersList;