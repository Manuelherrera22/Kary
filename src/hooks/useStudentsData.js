import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { MOCK_USERS } from '@/lib/mockAuth';

/**
 * Hook centralizado para manejar datos de estudiantes
 * Garantiza sincronización entre todos los componentes
 */
export const useStudentsData = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const { t } = useLanguage();

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Intentando cargar estudiantes desde Supabase...');
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, full_name, email, grade, status, admission_date, role')
        .eq('role', 'student')
        .eq('status', 'active')
        .order('full_name', { ascending: true });

      if (error) {
        console.log('Error de Supabase, usando datos mock:', error);
        throw error;
      }
      
      const formattedStudents = (data || []).map(student => ({
        ...student,
        id: student.id,
        name: student.full_name,
        displayName: student.full_name || student.email,
        grade: student.grade || 'Sin grado asignado',
        status: student.status || 'active'
      }));

      console.log('Estudiantes cargados desde Supabase:', formattedStudents);
      
      // Si no hay estudiantes en Supabase, usar datos mock inmediatamente
      if (formattedStudents.length === 0) {
        console.log('No hay estudiantes en Supabase, usando datos mock...');
        throw new Error('No students found in Supabase');
      }
      
      setStudents(formattedStudents);
      
      // Notificar a otros componentes que los datos han cambiado
      window.dispatchEvent(new CustomEvent('studentsDataUpdated', { 
        detail: { students: formattedStudents } 
      }));
      
    } catch (error) {
      console.log('Usando datos mock como respaldo...');
      // Usar datos mock como respaldo
      const mockStudents = MOCK_USERS
        .filter(user => user.role === 'student')
        .map(student => ({
          ...student,
          id: student.id,
          name: student.full_name,
          displayName: student.full_name || student.email,
          grade: student.grade || 'Sin grado asignado',
          status: student.status || 'active'
        }));

      console.log('Estudiantes mock cargados:', mockStudents);
      setStudents(mockStudents);
      
      // Notificar a otros componentes que los datos han cambiado
      window.dispatchEvent(new CustomEvent('studentsDataUpdated', { 
        detail: { students: mockStudents } 
      }));
      
      // No mostrar error si usamos datos mock
      if (mockStudents.length === 0) {
        setError(error);
        toast({
          title: t('toast.errorTitle'),
          description: t('studentList.errorFetchingStudents'),
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [toast, t]);

  // Cargar estudiantes al montar el componente
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Escuchar actualizaciones de otros componentes
  useEffect(() => {
    const handleStudentsUpdate = (event) => {
      if (event.detail && event.detail.students) {
        setStudents(event.detail.students);
      }
    };

    window.addEventListener('studentsDataUpdated', handleStudentsUpdate);
    return () => {
      window.removeEventListener('studentsDataUpdated', handleStudentsUpdate);
    };
  }, []);

  // Métodos para manipular datos
  const addStudent = useCallback((newStudent) => {
    setStudents(prev => [...prev, newStudent]);
    // Notificar a otros componentes
    window.dispatchEvent(new CustomEvent('studentsDataUpdated', { 
      detail: { students: [...students, newStudent] } 
    }));
  }, [students]);

  const updateStudent = useCallback((studentId, updates) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId ? { ...student, ...updates } : student
    ));
    // Notificar a otros componentes
    const updatedStudents = students.map(student => 
      student.id === studentId ? { ...student, ...updates } : student
    );
    window.dispatchEvent(new CustomEvent('studentsDataUpdated', { 
      detail: { students: updatedStudents } 
    }));
  }, [students]);

  const removeStudent = useCallback((studentId) => {
    setStudents(prev => prev.filter(student => student.id !== studentId));
    // Notificar a otros componentes
    const updatedStudents = students.filter(student => student.id !== studentId);
    window.dispatchEvent(new CustomEvent('studentsDataUpdated', { 
      detail: { students: updatedStudents } 
    }));
  }, [students]);

  // Métodos de búsqueda y filtrado
  const getStudentById = useCallback((studentId) => {
    return students.find(student => student.id === studentId);
  }, [students]);

  const getStudentsByGrade = useCallback((grade) => {
    return students.filter(student => student.grade === grade);
  }, [students]);

  const searchStudents = useCallback((searchTerm) => {
    if (!searchTerm) return students;
    
    const term = searchTerm.toLowerCase();
    return students.filter(student => 
      student.name?.toLowerCase().includes(term) ||
      student.email?.toLowerCase().includes(term) ||
      student.grade?.toLowerCase().includes(term)
    );
  }, [students]);

  return {
    students,
    isLoading,
    error,
    fetchStudents,
    addStudent,
    updateStudent,
    removeStudent,
    getStudentById,
    getStudentsByGrade,
    searchStudents
  };
};

export default useStudentsData;
