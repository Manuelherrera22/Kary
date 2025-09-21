import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useMockAuth } from '@/contexts/MockAuthContext';
import LogoutButton from '@/components/LogoutButton';
import { User, Mail, Shield } from 'lucide-react';

const UserHeader = ({ 
  position = 'top-right',
  showAvatar = true,
  showRole = true,
  showLogout = true,
  compact = false
}) => {
  const { user, userProfile, signOut } = useMockAuth();

  const getRoleColor = (role) => {
    switch (role) {
      case 'teacher':
        return 'bg-blue-600';
      case 'student':
        return 'bg-green-600';
      case 'parent':
        return 'bg-purple-600';
      case 'psychopedagogue':
        return 'bg-orange-600';
      case 'admin':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'teacher':
        return 'Profesor';
      case 'student':
        return 'Estudiante';
      case 'parent':
        return 'Padre/Madre';
      case 'psychopedagogue':
        return 'Psicopedagogo';
      case 'admin':
        return 'Administrador';
      default:
        return 'Usuario';
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      default:
        return 'top-4 right-4';
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (compact) {
    return (
      <div className={`fixed ${getPositionClasses()} z-50`}>
        <div className="flex items-center gap-2">
          {showAvatar && (
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-slate-700 text-white text-xs">
                {getInitials(userProfile?.full_name || user?.email)}
              </AvatarFallback>
            </Avatar>
          )}
          
          {showRole && (
            <Badge className={`${getRoleColor(userProfile?.role)} text-white text-xs`}>
              {getRoleLabel(userProfile?.role)}
            </Badge>
          )}
          
          {showLogout && (
            <LogoutButton 
              variant="ghost" 
              size="sm"
              showText={false}
              className="w-8 h-8 p-0"
              onLogout={signOut}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed ${getPositionClasses()} z-50`}>
      <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-lg p-3 shadow-lg">
        <div className="flex items-center gap-3">
          {showAvatar && (
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-slate-700 text-white">
                {getInitials(userProfile?.full_name || user?.email)}
              </AvatarFallback>
            </Avatar>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-white font-medium text-sm truncate">
                {userProfile?.full_name || user?.email || 'Usuario'}
              </span>
            </div>
            
            {showRole && (
              <div className="flex items-center gap-2">
                <Badge className={`${getRoleColor(userProfile?.role)} text-white text-xs`}>
                  <Shield className="w-3 h-3 mr-1" />
                  {getRoleLabel(userProfile?.role)}
                </Badge>
              </div>
            )}
            
            {user?.email && (
              <div className="flex items-center gap-1 mt-1">
                <Mail className="w-3 h-3 text-gray-500" />
                <span className="text-gray-400 text-xs truncate">
                  {user.email}
                </span>
              </div>
            )}
          </div>
          
          {showLogout && (
            <LogoutButton 
              variant="ghost" 
              size="sm"
              showText={false}
              className="w-8 h-8 p-0 ml-2"
              onLogout={signOut}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
