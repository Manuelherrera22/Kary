import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { LogOut, User } from 'lucide-react';

const LogoutButton = ({ 
  variant = 'outline', 
  size = 'default', 
  showIcon = true, 
  showText = true,
  className = '',
  onLogout
}) => {
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      // Mostrar confirmación
      const confirmed = window.confirm('¿Estás seguro de que quieres cerrar sesión?');
      
      if (!confirmed) {
        return;
      }

      // Ejecutar logout personalizado si se proporciona
      if (onLogout) {
        await onLogout();
      } else {
        // Logout por defecto - recargar la página para volver al login
        window.location.href = '/';
      }

      toast({
        title: '✅ Sesión Cerrada',
        description: 'Has cerrado sesión exitosamente',
        variant: 'default',
      });

    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast({
        title: '❌ Error',
        description: 'Hubo un problema al cerrar sesión',
        variant: 'destructive',
      });
    }
  };

  return (
    <Button
      onClick={handleLogout}
      variant={variant}
      size={size}
      className={`text-gray-300 border-gray-600 hover:bg-red-600 hover:border-red-600 hover:text-white transition-colors ${className}`}
    >
      {showIcon && <LogOut className="w-4 h-4 mr-2" />}
      {showText && 'Cerrar Sesión'}
    </Button>
  );
};

export default LogoutButton;
