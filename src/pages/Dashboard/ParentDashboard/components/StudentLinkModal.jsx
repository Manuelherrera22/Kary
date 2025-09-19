import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, User, School, Mail, CheckCircle, AlertCircle, Clock, UserPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import studentParentLinkService from '@/services/studentParentLinkService';

const StudentLinkModal = ({ isOpen, onClose, onLinkSuccess }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('code');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [linkRequest, setLinkRequest] = useState(null);

  // Estados para búsqueda por código
  const [verificationCode, setVerificationCode] = useState('');
  const [codeSearchResult, setCodeSearchResult] = useState(null);

  // Estados para búsqueda por nombre
  const [studentName, setStudentName] = useState('');
  const [schoolName, setSchoolName] = useState('');

  // Estados para la solicitud de vinculación
  const [relationship, setRelationship] = useState('parent');
  const [requestStatus, setRequestStatus] = useState('idle'); // idle, pending, success, error

  useEffect(() => {
    if (isOpen) {
      // Resetear estados cuando se abre el modal
      setActiveTab('code');
      setVerificationCode('');
      setStudentName('');
      setSchoolName('');
      setCodeSearchResult(null);
      setSearchResults([]);
      setSelectedStudent(null);
      setLinkRequest(null);
      setRequestStatus('idle');
    }
  }, [isOpen]);

  const handleCodeSearch = async () => {
    if (!verificationCode.trim()) return;

    setLoading(true);
    try {
      const result = await studentParentLinkService.searchStudentsByCode(verificationCode);
      if (result.success) {
        setCodeSearchResult(result.data);
      } else {
        setCodeSearchResult({ error: result.error });
      }
    } catch (error) {
      setCodeSearchResult({ error: 'Error al buscar estudiante' });
    } finally {
      setLoading(false);
    }
  };

  const handleNameSearch = async () => {
    if (!studentName.trim()) return;

    setLoading(true);
    try {
      const result = await studentParentLinkService.searchStudentsByName(studentName, schoolName);
      if (result.success) {
        setSearchResults(result.data);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
  };

  const handleCreateLinkRequest = async () => {
    if (!selectedStudent) return;

    setLoading(true);
    setRequestStatus('pending');
    
    try {
      const result = await studentParentLinkService.createLinkRequest(
        'parent-1', // ID del padre actual
        selectedStudent.id,
        relationship
      );

      if (result.success) {
        setLinkRequest(result.data);
        setRequestStatus('success');
        
        // Notificar éxito después de 2 segundos
        setTimeout(() => {
          onLinkSuccess?.(result.data);
          onClose();
        }, 2000);
      } else {
        setRequestStatus('error');
      }
    } catch (error) {
      setRequestStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = () => {
    switch (requestStatus) {
      case 'pending':
        return <Clock className="text-yellow-400" size={20} />;
      case 'success':
        return <CheckCircle className="text-green-400" size={20} />;
      case 'error':
        return <AlertCircle className="text-red-400" size={20} />;
      default:
        return <UserPlus className="text-blue-400" size={20} />;
    }
  };

  const getStatusMessage = () => {
    switch (requestStatus) {
      case 'pending':
        return 'Creando solicitud de vinculación...';
      case 'success':
        return 'Solicitud enviada exitosamente. Esperando aprobación.';
      case 'error':
        return 'Error al crear la solicitud. Inténtalo de nuevo.';
      default:
        return 'Selecciona un estudiante para vincular';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-slate-900 rounded-xl shadow-2xl border border-slate-700/50 w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
            <div>
              <h2 className="text-2xl font-bold text-slate-200">Vincular Estudiante</h2>
              <p className="text-slate-400 mt-1">Conecta tu cuenta con el perfil de tu hijo/a</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              <X size={24} />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
                <TabsTrigger value="code" className="data-[state=active]:bg-purple-600">
                  <Search size={16} className="mr-2" />
                  Código de Verificación
                </TabsTrigger>
                <TabsTrigger value="search" className="data-[state=active]:bg-purple-600">
                  <User size={16} className="mr-2" />
                  Búsqueda por Nombre
                </TabsTrigger>
              </TabsList>

              {/* Tab: Código de Verificación */}
              <TabsContent value="code" className="space-y-6 mt-6">
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-lg text-slate-200 flex items-center gap-2">
                      <Search className="text-blue-400" />
                      Buscar por Código
                    </CardTitle>
                    <p className="text-slate-400 text-sm">
                      Ingresa el código de verificación proporcionado por la institución
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-3">
                      <Input
                        placeholder="Ej: ABC123"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                        className="bg-slate-700/50 border-slate-600 text-slate-200 placeholder:text-slate-400"
                        maxLength={6}
                      />
                      <Button
                        onClick={handleCodeSearch}
                        disabled={!verificationCode.trim() || loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {loading ? 'Buscando...' : 'Buscar'}
                      </Button>
                    </div>

                    {codeSearchResult && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4"
                      >
                        {codeSearchResult.error ? (
                          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <div className="flex items-center gap-2">
                              <AlertCircle className="text-red-400" size={20} />
                              <span className="text-red-300">{codeSearchResult.error}</span>
                            </div>
                          </div>
                        ) : (
                          <Card className="bg-slate-700/30 border-slate-600/50">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-green-500/20 rounded-lg">
                                    <User className="text-green-400" size={24} />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-slate-200">{codeSearchResult.name}</h3>
                                    <p className="text-sm text-slate-400">{codeSearchResult.grade} • {codeSearchResult.school}</p>
                                  </div>
                                </div>
                                <Button
                                  onClick={() => handleSelectStudent(codeSearchResult)}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  Seleccionar
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab: Búsqueda por Nombre */}
              <TabsContent value="search" className="space-y-6 mt-6">
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-lg text-slate-200 flex items-center gap-2">
                      <User className="text-purple-400" />
                      Buscar por Nombre
                    </CardTitle>
                    <p className="text-slate-400 text-sm">
                      Busca estudiantes por nombre y escuela
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input
                        placeholder="Nombre del estudiante"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        className="bg-slate-700/50 border-slate-600 text-slate-200 placeholder:text-slate-400"
                      />
                      <Input
                        placeholder="Escuela (opcional)"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        className="bg-slate-700/50 border-slate-600 text-slate-200 placeholder:text-slate-400"
                      />
                    </div>
                    <Button
                      onClick={handleNameSearch}
                      disabled={!studentName.trim() || loading}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      {loading ? 'Buscando...' : 'Buscar Estudiantes'}
                    </Button>

                    {searchResults.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3 mt-4"
                      >
                        <h4 className="font-semibold text-slate-200">Resultados de búsqueda:</h4>
                        {searchResults.map((student) => (
                          <Card
                            key={student.id}
                            className={`bg-slate-700/30 border-slate-600/50 cursor-pointer transition-all ${
                              selectedStudent?.id === student.id
                                ? 'border-purple-500 bg-purple-500/10'
                                : 'hover:border-slate-500'
                            }`}
                            onClick={() => handleSelectStudent(student)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-blue-500/20 rounded-lg">
                                    <User className="text-blue-400" size={20} />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-slate-200">{student.name}</h3>
                                    <p className="text-sm text-slate-400">{student.grade} • {student.school}</p>
                                  </div>
                                </div>
                                {selectedStudent?.id === student.id && (
                                  <CheckCircle className="text-green-400" size={20} />
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Selected Student and Link Request */}
            {selectedStudent && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-lg text-slate-200 flex items-center gap-2">
                      {getStatusIcon()}
                      {requestStatus === 'idle' ? 'Estudiante Seleccionado' : 'Solicitud de Vinculación'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-slate-700/30 rounded-lg">
                      <div className="p-2 bg-green-500/20 rounded-lg">
                        <User className="text-green-400" size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-200">{selectedStudent.name}</h3>
                        <p className="text-sm text-slate-400">{selectedStudent.grade} • {selectedStudent.school}</p>
                      </div>
                    </div>

                    {requestStatus === 'idle' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Relación con el estudiante
                          </label>
                          <select
                            value={relationship}
                            onChange={(e) => setRelationship(e.target.value)}
                            className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200"
                          >
                            <option value="parent">Padre/Madre</option>
                            <option value="guardian">Acudiente</option>
                            <option value="tutor">Tutor</option>
                          </select>
                        </div>

                        <Button
                          onClick={handleCreateLinkRequest}
                          disabled={loading}
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                        >
                          {loading ? 'Creando Solicitud...' : 'Crear Solicitud de Vinculación'}
                        </Button>
                      </div>
                    )}

                    {requestStatus !== 'idle' && (
                      <div className="text-center space-y-2">
                        <p className={`text-sm ${
                          requestStatus === 'success' ? 'text-green-400' :
                          requestStatus === 'error' ? 'text-red-400' :
                          'text-yellow-400'
                        }`}>
                          {getStatusMessage()}
                        </p>
                        {linkRequest && (
                          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                            ID: {linkRequest.id}
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StudentLinkModal;

