import React from 'react';
import { useStudentsData } from '@/hooks/useStudentsData';

const StudentsDebug = () => {
  const { students, isLoading, error } = useStudentsData();

  if (isLoading) {
    return <div className="p-4 bg-blue-100 text-blue-800 rounded">Cargando estudiantes...</div>;
  }

  if (error) {
    return <div className="p-4 bg-red-100 text-red-800 rounded">Error: {error.message}</div>;
  }

  return (
    <div className="p-4 bg-green-100 text-green-800 rounded">
      <h3 className="font-bold">Estudiantes Encontrados: {students.length}</h3>
      <div className="mt-2">
        {students.map(student => (
          <div key={student.id} className="text-sm">
            - {student.full_name || student.name || student.email} (ID: {student.id})
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentsDebug;

