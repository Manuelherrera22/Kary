import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import UserActions from './UserActions';

const UserTable = ({ users, onEditUser, onConfirmAction, onToggleUserStatus, onDeleteUser }) => {
  const { t } = useLanguage();

  if (users.length === 0) {
    return <p className="text-center text-purple-300 py-8">{t('dashboards.directive.userManagement.noUsersFound')}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-purple-500/50">
            <th className="p-3 font-semibold text-orange-300">{t('dashboards.directive.userManagement.table.name')}</th>
            <th className="p-3 font-semibold text-orange-300">{t('dashboards.directive.userManagement.table.email')}</th>
            <th className="p-3 font-semibold text-orange-300">{t('dashboards.directive.userManagement.table.role')}</th>
            <th className="p-3 font-semibold text-orange-300">{t('dashboards.directive.userManagement.table.status')}</th>
            <th className="p-3 font-semibold text-orange-300">{t('dashboards.directive.userManagement.table.grade')}</th>
            <th className="p-3 font-semibold text-orange-300">{t('dashboards.directive.userManagement.table.institution')}</th>
            <th className="p-3 font-semibold text-orange-300">{t('dashboards.directive.userManagement.table.admissionDate')}</th>
            <th className="p-3 font-semibold text-orange-300 text-right">{t('dashboards.directive.userManagement.table.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-b border-purple-500/30 hover:bg-white/5 transition-colors">
              <td className="p-3">{user.full_name || t('common.notSpecified')}</td>
              <td className="p-3">{user.email || t('common.notSpecified')}</td>
              <td className="p-3">{t(`roles.${user.role}`)}</td>
              <td className="p-3">
                <span className={`px-2 py-1 text-xs rounded-full ${user.status === 'active' ? 'bg-green-500/30 text-green-200' : 'bg-red-500/30 text-red-200'}`}>
                  {t(`common.status${user.status?.charAt(0).toUpperCase() + user.status?.slice(1)}`)}
                </span>
              </td>
              <td className="p-3">{user.grade || 'N/A'}</td>
              <td className="p-3">
                <span className="bg-blue-500/20 text-blue-200 px-2 py-1 text-xs rounded-full">
                  {user.institution_name || 'San Luis Gonzaga'}
                </span>
              </td>
              <td className="p-3">{user.admission_date ? new Date(user.admission_date).toLocaleDateString() : 'N/A'}</td>
              <td className="p-3 text-right">
                <UserActions 
                  user={user} 
                  onEdit={onEditUser} 
                  onConfirmAction={onConfirmAction}
                  onToggleStatus={onToggleUserStatus}
                  onDelete={onDeleteUser}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;