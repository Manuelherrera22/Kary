import React from 'react';
import { motion } from 'framer-motion';
import { User, ChevronDown, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMockAuth } from '@/contexts/MockAuthContext';

const StudentSidebarHeader = ({ isCollapsed, onToggleCollapse }) => {
  const { userProfile, handleLogout } = useMockAuth();

  return (
    <motion.div 
      className="p-4 border-b border-slate-700/50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        {!isCollapsed && (
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-800"></div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-white font-semibold text-sm truncate">
                {userProfile?.full_name?.split(' ')[0] || 'Estudiante'}
              </h2>
              <p className="text-slate-400 text-xs">Estudiante Activo</p>
            </div>
          </motion.div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all duration-200"
        >
          {isCollapsed ? (
            <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
          ) : (
            <ChevronDown className="w-4 h-4 rotate-90" />
          )}
        </Button>
      </div>
      
      {!isCollapsed && (
        <motion.div 
          className="mt-3 flex space-x-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-xs text-slate-400 hover:text-white hover:bg-slate-700/50"
          >
            <Settings className="w-3 h-3 mr-1" />
            Configurar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-xs text-slate-400 hover:text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="w-3 h-3" />
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default StudentSidebarHeader;


