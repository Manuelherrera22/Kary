import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const StudentQuickNotifications = ({ isCollapsed }) => {
  const [notifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Tarea Completada',
      message: 'Matemáticas - Ejercicios de álgebra',
      time: 'hace 5 min',
      icon: CheckCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Recordatorio',
      message: 'Tienes una tarea pendiente',
      time: 'hace 1 hora',
      icon: AlertTriangle,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20'
    },
    {
      id: 3,
      type: 'info',
      title: 'Nuevo Recurso',
      message: 'Video tutorial disponible',
      time: 'hace 2 horas',
      icon: Info,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    }
  ]);

  const [isOpen, setIsOpen] = useState(false);

  if (isCollapsed) {
    return (
      <div className="px-2 py-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 p-0 text-slate-400 hover:text-white hover:bg-slate-700/50 relative"
        >
          <Bell className="w-5 h-5" />
          <Badge className="absolute -top-1 -right-1 w-5 h-5 text-xs bg-red-500 text-white">
            {notifications.length}
          </Badge>
        </Button>
      </div>
    );
  }

  return (
    <div className="px-4 py-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between text-slate-400 hover:text-white hover:bg-slate-700/50"
      >
        <div className="flex items-center space-x-2">
          <Bell className="w-4 h-4" />
          <span className="text-sm">Notificaciones</span>
        </div>
        <Badge variant="secondary" className="bg-red-500/20 text-red-400 border-red-500/30">
          {notifications.length}
        </Badge>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-2 space-y-2 max-h-64 overflow-y-auto"
          >
            {notifications.map((notification, index) => {
              const IconComponent = notification.icon;
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`${notification.bgColor} ${notification.borderColor} border rounded-lg p-3`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-2 flex-1">
                      <IconComponent className={`w-4 h-4 ${notification.color} mt-0.5`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-medium ${notification.color}`}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-slate-400 truncate">
                          {notification.message}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-6 h-6 p-0 text-slate-500 hover:text-slate-300"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentQuickNotifications;


