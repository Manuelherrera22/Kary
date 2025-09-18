import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit3, Trash2, Eye, UserPlus, BookOpen } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import AssignResourceToStudentModal from '@/pages/Dashboard/PsychopedagogueSections/components/AssignResourceToStudentModal';

const UserActions = ({ user, onEdit, onDelete, onViewDetails, onRegisterStudent, onAssignmentSuccess }) => {
  const { t } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      {onViewDetails && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(user)}
          className="border-blue-500 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300"
          title={t('userManagementPage.viewDetailsTooltip')}
        >
          <Eye size={16} />
        </Button>
      )}
      {onEdit && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(user)}
          className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/20 hover:text-yellow-300"
          title={t('userManagementPage.editUserTooltip')}
        >
          <Edit3 size={16} />
        </Button>
      )}
      {user.role === 'student' && (
         <AssignResourceToStudentModal 
            studentId={user.id} 
            studentName={user.full_name}
            onAssignmentSuccess={onAssignmentSuccess}
          />
      )}
      {onDelete && (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(user)}
          className="bg-red-500/80 hover:bg-red-600"
          title={t('userManagementPage.deleteUserTooltip')}
        >
          <Trash2 size={16} />
        </Button>
      )}
      {onRegisterStudent && user.role === 'parent' && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRegisterStudent(user)}
          className="border-green-500 text-green-400 hover:bg-green-500/20 hover:text-green-300"
          title={t('userManagementPage.registerStudentForParentTooltip')}
        >
          <UserPlus size={16} />
        </Button>
      )}
    </div>
  );
};

export default UserActions;