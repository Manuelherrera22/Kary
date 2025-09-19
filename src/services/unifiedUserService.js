/**
 * Servicio unificado para gestión de usuarios de la plataforma Kary
 * Sincroniza usuarios de todos los contextos: MockAuth, Supabase, y datos locales
 */

import { supabase } from '@/lib/supabaseClient';

// Datos de usuarios de la plataforma Kary - San Luis Gonzaga
const PLATFORM_USERS = {
  // Usuarios Directivos
  directive: [
    {
      id: 'directive-1',
      full_name: 'Dr. María Elena Rodríguez',
      email: 'maria.rodriguez@sanluisgonzaga.edu.co',
      role: 'directive',
      status: 'active',
      grade: null,
      admission_date: '2020-01-15',
      department: 'Dirección General',
      phone: '+57 301 234 5678',
      institution_id: 'san-luis-gonzaga',
      institution_name: 'Institución Educativa San Luis Gonzaga',
      created_at: '2020-01-15T08:00:00Z'
    },
    {
      id: 'directive-2',
      full_name: 'Lic. Carlos Alberto Mendoza',
      email: 'carlos.mendoza@sanluisgonzaga.edu.co',
      role: 'directive',
      status: 'active',
      grade: null,
      admission_date: '2020-03-01',
      department: 'Coordinación Académica',
      phone: '+57 302 345 6789',
      institution_id: 'san-luis-gonzaga',
      institution_name: 'Institución Educativa San Luis Gonzaga',
      created_at: '2020-03-01T08:00:00Z'
    }
  ],

  // Docentes
  teacher: [
    {
      id: 'teacher-1',
      full_name: 'Prof. Ana Lucía García',
      email: 'ana.garcia@sanluisgonzaga.edu.co',
      role: 'teacher',
      status: 'active',
      grade: '1°',
      admission_date: '2021-02-01',
      department: 'Primaria',
      phone: '+57 303 456 7890',
      subjects: ['Matemáticas', 'Español'],
      institution_id: 'san-luis-gonzaga',
      institution_name: 'Institución Educativa San Luis Gonzaga',
      created_at: '2021-02-01T08:00:00Z'
    },
    {
      id: 'teacher-2',
      full_name: 'Prof. Roberto Silva',
      email: 'roberto.silva@sanluisgonzaga.edu.co',
      role: 'teacher',
      status: 'active',
      grade: '2°',
      admission_date: '2021-02-01',
      department: 'Primaria',
      phone: '+57 304 567 8901',
      subjects: ['Ciencias', 'Sociales'],
      institution_id: 'san-luis-gonzaga',
      institution_name: 'Institución Educativa San Luis Gonzaga',
      created_at: '2021-02-01T08:00:00Z'
    },
    {
      id: 'teacher-3',
      full_name: 'Prof. Carmen Elena Vásquez',
      email: 'carmen.vasquez@sanluisgonzaga.edu.co',
      role: 'teacher',
      status: 'active',
      grade: '3°',
      admission_date: '2021-02-01',
      department: 'Primaria',
      phone: '+57 305 678 9012',
      subjects: ['Matemáticas', 'Ciencias'],
      institution_id: 'san-luis-gonzaga',
      institution_name: 'Institución Educativa San Luis Gonzaga',
      created_at: '2021-02-01T08:00:00Z'
    },
    {
      id: 'teacher-4',
      full_name: 'Prof. Diego Fernando López',
      email: 'diego.lopez@sanluisgonzaga.edu.co',
      role: 'teacher',
      status: 'active',
      grade: '4°',
      admission_date: '2021-02-01',
      department: 'Primaria',
      phone: '+57 306 789 0123',
      subjects: ['Español', 'Sociales'],
      institution_id: 'san-luis-gonzaga',
      institution_name: 'Institución Educativa San Luis Gonzaga',
      created_at: '2021-02-01T08:00:00Z'
    },
    {
      id: 'teacher-5',
      full_name: 'Prof. Patricia Milena Torres',
      email: 'patricia.torres@sanluisgonzaga.edu.co',
      role: 'teacher',
      status: 'active',
      grade: '5°',
      admission_date: '2021-02-01',
      department: 'Primaria',
      phone: '+57 307 890 1234',
      subjects: ['Matemáticas', 'Español', 'Ciencias'],
      institution_id: 'san-luis-gonzaga',
      institution_name: 'Institución Educativa San Luis Gonzaga',
      created_at: '2021-02-01T08:00:00Z'
    }
  ],

  // Estudiantes
  student: [
    {
      id: '550e8400-e29b-41d4-a716-446655440002', // María García
      full_name: 'María García',
      email: 'maria.garcia@estudiante.sanluisgonzaga.edu.co',
      role: 'student',
      status: 'active',
      grade: '4°',
      admission_date: '2023-01-15',
      department: 'Primaria',
      phone: '+57 311 111 1111',
      parent_id: 'parent-1',
      institution_id: 'san-luis-gonzaga',
      institution_name: 'Institución Educativa San Luis Gonzaga',
      created_at: '2023-01-15T08:00:00Z'
    },
    {
      id: 'student-2',
      full_name: 'Juan Carlos Pérez',
      email: 'juan.perez@estudiante.sanluisgonzaga.edu.co',
      role: 'student',
      status: 'active',
      grade: '1°',
      admission_date: '2024-01-15',
      department: 'Primaria',
      phone: '+57 312 222 2222',
      parent_id: 'parent-2',
      institution_id: 'san-luis-gonzaga',
      institution_name: 'Institución Educativa San Luis Gonzaga',
      created_at: '2024-01-15T08:00:00Z'
    },
    {
      id: 'student-3',
      full_name: 'Sofía Alejandra Ruiz',
      email: 'sofia.ruiz@estudiante.sanluisgonzaga.edu.co',
      role: 'student',
      status: 'active',
      grade: '2°',
      admission_date: '2023-01-15',
      department: 'Primaria',
      phone: '+57 313 333 3333',
      parent_id: 'parent-3',
      institution_id: 'san-luis-gonzaga',
      institution_name: 'Institución Educativa San Luis Gonzaga',
      created_at: '2023-01-15T08:00:00Z'
    },
    {
      id: 'student-4',
      full_name: 'Andrés Felipe González',
      email: 'andres.gonzalez@estudiante.sanluisgonzaga.edu.co',
      role: 'student',
      status: 'active',
      grade: '3°',
      admission_date: '2023-01-15',
      department: 'Primaria',
      phone: '+57 314 444 4444',
      parent_id: 'parent-4',
      institution_id: 'san-luis-gonzaga',
      institution_name: 'Institución Educativa San Luis Gonzaga',
      created_at: '2023-01-15T08:00:00Z'
    },
    {
      id: 'student-5',
      full_name: 'Valentina Morales',
      email: 'valentina.morales@estudiante.sanluisgonzaga.edu.co',
      role: 'student',
      status: 'active',
      grade: '5°',
      admission_date: '2022-01-15',
      department: 'Primaria',
      phone: '+57 315 555 5555',
      parent_id: 'parent-5',
      institution_id: 'san-luis-gonzaga',
      institution_name: 'Institución Educativa San Luis Gonzaga',
      created_at: '2022-01-15T08:00:00Z'
    }
  ],

  // Acudientes
  parent: [
    {
      id: 'parent-1',
      full_name: 'Ana Rodríguez',
      email: 'ana.rodriguez@email.com',
      role: 'parent',
      status: 'active',
      grade: null,
      admission_date: '2023-01-15',
      department: 'Familia',
      phone: '+57 320 111 1111',
      student_ids: ['550e8400-e29b-41d4-a716-446655440002'],
      institution_id: 'san-luis-gonzaga',
      institution_name: 'Institución Educativa San Luis Gonzaga',
      created_at: '2023-01-15T08:00:00Z'
    },
    {
      id: 'parent-2',
      full_name: 'Carlos Pérez',
      email: 'carlos.perez@email.com',
      role: 'parent',
      status: 'active',
      grade: null,
      admission_date: '2024-01-15',
      department: 'Familia',
      phone: '+57 320 222 2222',
      student_ids: ['student-2'],
      institution_id: 'san-luis-gonzaga',
      institution_name: 'Institución Educativa San Luis Gonzaga',
      created_at: '2024-01-15T08:00:00Z'
    },
    {
      id: 'parent-3',
      full_name: 'María Ruiz',
      email: 'maria.ruiz@email.com',
      role: 'parent',
      status: 'active',
      grade: null,
      admission_date: '2023-01-15',
      department: 'Familia',
      phone: '+57 320 333 3333',
      student_ids: ['student-3'],
      institution_id: 'san-luis-gonzaga',
      institution_name: 'Institución Educativa San Luis Gonzaga',
      created_at: '2023-01-15T08:00:00Z'
    },
    {
      id: 'parent-4',
      full_name: 'Fernando González',
      email: 'fernando.gonzalez@email.com',
      role: 'parent',
      status: 'active',
      grade: null,
      admission_date: '2023-01-15',
      department: 'Familia',
      phone: '+57 320 444 4444',
      student_ids: ['student-4'],
      institution_id: 'san-luis-gonzaga',
      institution_name: 'Institución Educativa San Luis Gonzaga',
      created_at: '2023-01-15T08:00:00Z'
    },
    {
      id: 'parent-5',
      full_name: 'Elena Morales',
      email: 'elena.morales@email.com',
      role: 'parent',
      status: 'active',
      grade: null,
      admission_date: '2022-01-15',
      department: 'Familia',
      phone: '+57 320 555 5555',
      student_ids: ['student-5'],
      institution_id: 'san-luis-gonzaga',
      institution_name: 'Institución Educativa San Luis Gonzaga',
      created_at: '2022-01-15T08:00:00Z'
    }
  ],

  // Psicopedagogos
  psychopedagogue: [
    {
      id: 'psycho-1',
      full_name: 'Dra. Laura Esperanza Jiménez',
      email: 'laura.jimenez@sanluisgonzaga.edu.co',
      role: 'psychopedagogue',
      status: 'active',
      grade: null,
      admission_date: '2021-08-01',
      department: 'Orientación Escolar',
      phone: '+57 310 123 4567',
      specialization: 'Psicología Educativa',
      institution_id: 'san-luis-gonzaga',
      institution_name: 'Institución Educativa San Luis Gonzaga',
      created_at: '2021-08-01T08:00:00Z'
    },
    {
      id: 'psycho-2',
      full_name: 'Psic. Miguel Ángel Castro',
      email: 'miguel.castro@sanluisgonzaga.edu.co',
      role: 'psychopedagogue',
      status: 'active',
      grade: null,
      admission_date: '2022-02-01',
      department: 'Orientación Escolar',
      phone: '+57 310 234 5678',
      specialization: 'Psicopedagogía',
      institution_id: 'san-luis-gonzaga',
      institution_name: 'Institución Educativa San Luis Gonzaga',
      created_at: '2022-02-01T08:00:00Z'
    }
  ]
};

class UnifiedUserService {
  constructor() {
    this.users = this.getAllUsers();
  }

  /**
   * Obtiene todos los usuarios de la plataforma
   */
  getAllUsers() {
    const allUsers = [];
    
    // Combinar usuarios de todos los roles
    Object.values(PLATFORM_USERS).forEach(roleUsers => {
      allUsers.push(...roleUsers);
    });

    return allUsers.sort((a, b) => a.full_name.localeCompare(b.full_name));
  }

  /**
   * Obtiene usuarios por rol específico
   */
  getUsersByRole(role) {
    return PLATFORM_USERS[role] || [];
  }

  /**
   * Obtiene estadísticas de usuarios por rol
   */
  getUserStatsByRole() {
    const stats = {};
    
    Object.keys(PLATFORM_USERS).forEach(role => {
      const users = PLATFORM_USERS[role];
      stats[role] = {
        total: users.length,
        active: users.filter(u => u.status === 'active').length,
        suspended: users.filter(u => u.status === 'suspended').length,
        inactive: users.filter(u => u.status === 'inactive').length
      };
    });

    return stats;
  }

  /**
   * Busca usuarios por término
   */
  searchUsers(searchTerm) {
    if (!searchTerm) return this.getAllUsers();
    
    const term = searchTerm.toLowerCase();
    return this.getAllUsers().filter(user => 
      user.full_name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.role.toLowerCase().includes(term) ||
      (user.grade && user.grade.toLowerCase().includes(term)) ||
      (user.department && user.department.toLowerCase().includes(term))
    );
  }

  /**
   * Filtra usuarios por múltiples criterios
   */
  filterUsers(filters = {}) {
    let users = this.getAllUsers();

    if (filters.role) {
      users = users.filter(user => user.role === filters.role);
    }

    if (filters.status) {
      users = users.filter(user => user.status === filters.status);
    }

    if (filters.grade) {
      users = users.filter(user => user.grade === filters.grade);
    }

    if (filters.department) {
      users = users.filter(user => user.department === filters.department);
    }

    return users;
  }

  /**
   * Obtiene un usuario por ID
   */
  getUserById(id) {
    return this.getAllUsers().find(user => user.id === id);
  }

  /**
   * Obtiene usuarios relacionados (ej: estudiantes de un acudiente)
   */
  getRelatedUsers(userId) {
    const user = this.getUserById(userId);
    if (!user) return [];

    if (user.role === 'parent' && user.student_ids) {
      return user.student_ids.map(studentId => this.getUserById(studentId)).filter(Boolean);
    }

    if (user.role === 'student' && user.parent_id) {
      return [this.getUserById(user.parent_id)].filter(Boolean);
    }

    return [];
  }

  /**
   * Simula operaciones de base de datos
   */
  async createUser(userData) {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newUser = {
      id: `user-${Date.now()}`,
      ...userData,
      status: userData.status || 'active',
      admission_date: userData.admission_date || new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString()
    };

    // Agregar al array correspondiente
    if (PLATFORM_USERS[userData.role]) {
      PLATFORM_USERS[userData.role].push(newUser);
      this.users = this.getAllUsers();
    }

    return newUser;
  }

  async updateUser(userId, userData) {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const userIndex = this.users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      this.users[userIndex] = { ...this.users[userIndex], ...userData };
      
      // Actualizar en el array del rol correspondiente
      Object.values(PLATFORM_USERS).forEach(roleUsers => {
        const roleUserIndex = roleUsers.findIndex(user => user.id === userId);
        if (roleUserIndex !== -1) {
          roleUsers[roleUserIndex] = { ...roleUsers[roleUserIndex], ...userData };
        }
      });
    }

    return this.users[userIndex];
  }

  async deleteUser(userId) {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Remover de todos los arrays
    Object.values(PLATFORM_USERS).forEach(roleUsers => {
      const index = roleUsers.findIndex(user => user.id === userId);
      if (index !== -1) {
        roleUsers.splice(index, 1);
      }
    });

    this.users = this.getAllUsers();
    return true;
  }

  async toggleUserStatus(userId) {
    const user = this.getUserById(userId);
    if (!user) throw new Error('Usuario no encontrado');

    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    return await this.updateUser(userId, { status: newStatus });
  }

  /**
   * Obtiene datos de la institución San Luis Gonzaga
   */
  getInstitutionData() {
    return {
      id: 'san-luis-gonzaga',
      name: 'Institución Educativa San Luis Gonzaga',
      address: 'Calle 123 #45-67, Bogotá, Colombia',
      phone: '+57 (1) 234-5678',
      email: 'info@sanluisgonzaga.edu.co',
      totalStudents: PLATFORM_USERS.student.length,
      totalTeachers: PLATFORM_USERS.teacher.length,
      totalParents: PLATFORM_USERS.parent.length,
      totalDirectives: PLATFORM_USERS.directive.length,
      totalPsychopedagogues: PLATFORM_USERS.psychopedagogue.length,
      totalUsers: this.getAllUsers().length
    };
  }

  /**
   * Obtiene usuarios por institución
   */
  getUsersByInstitution(institutionId = 'san-luis-gonzaga') {
    return this.getAllUsers().filter(user => user.institution_id === institutionId);
  }

  /**
   * Verifica si un usuario está vinculado a la institución
   */
  isUserLinkedToInstitution(userId, institutionId = 'san-luis-gonzaga') {
    const user = this.getUserById(userId);
    return user && user.institution_id === institutionId;
  }

  /**
   * Obtiene estadísticas por institución
   */
  getInstitutionStats(institutionId = 'san-luis-gonzaga') {
    const institutionUsers = this.getUsersByInstitution(institutionId);
    const stats = {};

    Object.keys(PLATFORM_USERS).forEach(role => {
      const roleUsers = institutionUsers.filter(user => user.role === role);
      stats[role] = {
        total: roleUsers.length,
        active: roleUsers.filter(u => u.status === 'active').length,
        suspended: roleUsers.filter(u => u.status === 'suspended').length,
        inactive: roleUsers.filter(u => u.status === 'inactive').length
      };
    });

    return {
      institutionId,
      totalUsers: institutionUsers.length,
      ...stats
    };
  }

  /**
   * Vincula un usuario a la institución
   */
  async linkUserToInstitution(userId, institutionId = 'san-luis-gonzaga', institutionName = 'Institución Educativa San Luis Gonzaga') {
    const user = this.getUserById(userId);
    if (!user) throw new Error('Usuario no encontrado');

    return await this.updateUser(userId, {
      institution_id: institutionId,
      institution_name: institutionName
    });
  }
}

// Crear instancia singleton
const unifiedUserService = new UnifiedUserService();

export default unifiedUserService;
