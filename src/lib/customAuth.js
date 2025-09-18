import { supabase } from './supabaseClient';
import { useState } from 'react';
import { MOCK_USERS, MOCK_EMAILS, simulateNetworkDelay, simulateNetworkError } from './mockAuth';

// Sistema de autenticación personalizado para Kary
export class CustomAuth {
  // Iniciar sesión con email y contraseña
  static async signIn(email, password) {
    try {
      // Simular delay de red
      await simulateNetworkDelay(300);

      // Simular error de red ocasional
      if (simulateNetworkError()) {
        return {
          success: false,
          error: 'Error de conexión temporal. Intenta nuevamente.'
        };
      }

      // Buscar usuario en datos mock
      const user = MOCK_USERS.find(u => u.email === email);

      if (!user) {
        return {
          success: false,
          error: 'Usuario no encontrado'
        };
      }

      // Verificar contraseña (comparación simple por ahora)
      if (user.password_hash !== password) {
        return {
          success: false,
          error: 'Contraseña incorrecta'
        };
      }

      // Crear sesión personalizada
      const session = {
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          status: user.status,
          grade: user.grade,
          preferred_language: user.preferred_language,
          timezone: user.timezone,
          notifications_enabled: user.notifications_enabled,
          avatar_url: user.avatar_url,
          academic_risk: user.academic_risk,
          emotional_risk: user.emotional_risk,
          diagnostic_summary: user.diagnostic_summary
        },
        access_token: this.generateToken(user.id),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 horas
      };

      // Guardar sesión en localStorage
      localStorage.setItem('kary_session', JSON.stringify(session));
      localStorage.setItem('kary_user', JSON.stringify(session.user));

      return {
        success: true,
        data: session
      };

    } catch (error) {
      console.error('Error en signIn:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }

  // Cerrar sesión
  static async signOut() {
    try {
      // Limpiar localStorage
      localStorage.removeItem('kary_session');
      localStorage.removeItem('kary_user');
      
      return {
        success: true
      };
    } catch (error) {
      console.error('Error en signOut:', error);
      return {
        success: false,
        error: 'Error al cerrar sesión'
      };
    }
  }

  // Obtener usuario actual
  static getCurrentUser() {
    try {
      const user = localStorage.getItem('kary_user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error obteniendo usuario actual:', error);
      return null;
    }
  }

  // Obtener sesión actual
  static getCurrentSession() {
    try {
      const session = localStorage.getItem('kary_session');
      if (!session) return null;

      const parsedSession = JSON.parse(session);
      
      // Verificar si la sesión ha expirado
      if (new Date(parsedSession.expires_at) < new Date()) {
        this.signOut();
        return null;
      }

      return parsedSession;
    } catch (error) {
      console.error('Error obteniendo sesión actual:', error);
      return null;
    }
  }

  // Verificar si el usuario está autenticado
  static isAuthenticated() {
    const session = this.getCurrentSession();
    return session !== null;
  }

  // Generar token simple (en producción usar JWT)
  static generateToken(userId) {
    return `kary_${userId}_${Date.now()}`;
  }

  // Registrar nuevo usuario
  static async signUp(userData) {
    try {
      // Simular registro de usuario (temporal mientras se resuelve el problema de Supabase)
      const newUser = {
        id: `mock-${userData.role}-${Date.now()}`,
        email: userData.email,
        full_name: userData.full_name,
        role: userData.role,
        status: userData.status || 'active',
        grade: userData.grade,
        preferred_language: userData.preferred_language || 'es',
        timezone: userData.timezone || 'America/Mexico_City',
        notifications_enabled: userData.notifications_enabled !== false,
        password_hash: userData.password,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Simular delay de red
      await simulateNetworkDelay(500);

      // Simular verificación de email único
      if (MOCK_EMAILS.includes(userData.email)) {
        return {
          success: false,
          error: 'El usuario ya está registrado'
        };
      }

      return {
        success: true,
        data: newUser
      };

    } catch (error) {
      console.error('Error en signUp:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }

  // Actualizar perfil de usuario
  static async updateProfile(userId, updates) {
    try {
      // Simular actualización de perfil (temporal mientras se resuelve el problema de Supabase)
      const currentUser = this.getCurrentUser();
      if (!currentUser || currentUser.id !== userId) {
        return {
          success: false,
          error: 'Usuario no encontrado'
        };
      }

      const updatedUser = {
        ...currentUser,
        ...updates,
        updated_at: new Date().toISOString()
      };

      // Actualizar usuario en localStorage
      localStorage.setItem('kary_user', JSON.stringify(updatedUser));

      return {
        success: true,
        data: updatedUser
      };

    } catch (error) {
      console.error('Error actualizando perfil:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }
}

// Hook personalizado para usar en React
export const useCustomAuth = () => {
  const [user, setUser] = useState(CustomAuth.getCurrentUser());
  const [loading, setLoading] = useState(false);

  const signIn = async (email, password) => {
    setLoading(true);
    const result = await CustomAuth.signIn(email, password);
    if (result.success) {
      setUser(result.data.user);
    }
    setLoading(false);
    return result;
  };

  const signOut = async () => {
    setLoading(true);
    const result = await CustomAuth.signOut();
    if (result.success) {
      setUser(null);
    }
    setLoading(false);
    return result;
  };

  const signUp = async (userData) => {
    setLoading(true);
    const result = await CustomAuth.signUp(userData);
    setLoading(false);
    return result;
  };

  const updateProfile = async (updates) => {
    setLoading(true);
    const result = await CustomAuth.updateProfile(user?.id, updates);
    if (result.success) {
      setUser(result.data);
    }
    setLoading(false);
    return result;
  };

  return {
    user,
    loading,
    signIn,
    signOut,
    signUp,
    updateProfile,
    isAuthenticated: CustomAuth.isAuthenticated()
  };
};

