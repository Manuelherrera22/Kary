import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Volume2, VolumeX, Type, MousePointer, Settings, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

const AccessibilityFeatures = () => {
  const { t } = useLanguage();
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReader: false,
    audioDescriptions: false,
    fontSize: 16,
    colorBlindMode: 'none',
    focusIndicators: true
  });

  const [isOpen, setIsOpen] = useState(false);

  // Aplicar configuraciones de accesibilidad
  useEffect(() => {
    const root = document.documentElement;
    
    if (accessibilitySettings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    if (accessibilitySettings.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }

    if (accessibilitySettings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    root.style.fontSize = `${accessibilitySettings.fontSize}px`;
  }, [accessibilitySettings]);

  const handleSettingChange = (setting, value) => {
    setAccessibilitySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const colorBlindModes = [
    { value: 'none', label: 'Normal', description: 'Sin ajustes' },
    { value: 'protanopia', label: 'Protanopia', description: 'Dificultad con rojos' },
    { value: 'deuteranopia', label: 'Deuteranopia', description: 'Dificultad con verdes' },
    { value: 'tritanopia', label: 'Tritanopia', description: 'Dificultad con azules' }
  ];

  return (
    <>
      {/* Botón flotante de accesibilidad */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
          aria-label="Configuración de accesibilidad"
        >
          <Settings size={24} />
        </Button>
      </motion.div>

      {/* Panel de configuración */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-0 right-0 h-full w-80 bg-slate-900 border-l border-slate-700 z-40 overflow-y-auto"
          >
            <Card className="border-0 bg-transparent h-full">
              <CardHeader className="border-b border-slate-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
                      <Settings size={20} className="text-purple-400" />
                    </div>
                    <CardTitle className="text-lg font-bold text-purple-300">
                      {t('studentDashboard.accessibility.title', 'Accesibilidad')}
                    </CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-slate-400 hover:text-slate-200"
                  >
                    ×
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* Configuraciones visuales */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <Eye size={16} className="text-blue-400" />
                    {t('studentDashboard.accessibility.visual', 'Configuración Visual')}
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-slate-300">
                          {t('studentDashboard.accessibility.highContrast', 'Alto Contraste')}
                        </label>
                        <p className="text-xs text-slate-400">
                          {t('studentDashboard.accessibility.highContrastDesc', 'Mejora el contraste de colores')}
                        </p>
                      </div>
                      <Switch
                        checked={accessibilitySettings.highContrast}
                        onCheckedChange={(checked) => handleSettingChange('highContrast', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-slate-300">
                          {t('studentDashboard.accessibility.largeText', 'Texto Grande')}
                        </label>
                        <p className="text-xs text-slate-400">
                          {t('studentDashboard.accessibility.largeTextDesc', 'Aumenta el tamaño del texto')}
                        </p>
                      </div>
                      <Switch
                        checked={accessibilitySettings.largeText}
                        onCheckedChange={(checked) => handleSettingChange('largeText', checked)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">
                        {t('studentDashboard.accessibility.fontSize', 'Tamaño de Fuente')}
                      </label>
                      <Slider
                        value={[accessibilitySettings.fontSize]}
                        onValueChange={([value]) => handleSettingChange('fontSize', value)}
                        min={12}
                        max={24}
                        step={1}
                        className="w-full"
                      />
                      <div className="text-xs text-slate-400 text-center">
                        {accessibilitySettings.fontSize}px
                      </div>
                    </div>
                  </div>
                </div>

                {/* Configuraciones de movimiento */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <MousePointer size={16} className="text-green-400" />
                    {t('studentDashboard.accessibility.motion', 'Configuración de Movimiento')}
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-slate-300">
                          {t('studentDashboard.accessibility.reducedMotion', 'Movimiento Reducido')}
                        </label>
                        <p className="text-xs text-slate-400">
                          {t('studentDashboard.accessibility.reducedMotionDesc', 'Reduce las animaciones')}
                        </p>
                      </div>
                      <Switch
                        checked={accessibilitySettings.reducedMotion}
                        onCheckedChange={(checked) => handleSettingChange('reducedMotion', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-slate-300">
                          {t('studentDashboard.accessibility.focusIndicators', 'Indicadores de Foco')}
                        </label>
                        <p className="text-xs text-slate-400">
                          {t('studentDashboard.accessibility.focusIndicatorsDesc', 'Resalta elementos enfocados')}
                        </p>
                      </div>
                      <Switch
                        checked={accessibilitySettings.focusIndicators}
                        onCheckedChange={(checked) => handleSettingChange('focusIndicators', checked)}
                      />
                    </div>
                  </div>
                </div>

                {/* Configuraciones de audio */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <Volume2 size={16} className="text-orange-400" />
                    {t('studentDashboard.accessibility.audio', 'Configuración de Audio')}
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-slate-300">
                          {t('studentDashboard.accessibility.screenReader', 'Lector de Pantalla')}
                        </label>
                        <p className="text-xs text-slate-400">
                          {t('studentDashboard.accessibility.screenReaderDesc', 'Optimiza para lectores de pantalla')}
                        </p>
                      </div>
                      <Switch
                        checked={accessibilitySettings.screenReader}
                        onCheckedChange={(checked) => handleSettingChange('screenReader', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-slate-300">
                          {t('studentDashboard.accessibility.audioDescriptions', 'Descripciones de Audio')}
                        </label>
                        <p className="text-xs text-slate-400">
                          {t('studentDashboard.accessibility.audioDescriptionsDesc', 'Añade descripciones de audio')}
                        </p>
                      </div>
                      <Switch
                        checked={accessibilitySettings.audioDescriptions}
                        onCheckedChange={(checked) => handleSettingChange('audioDescriptions', checked)}
                      />
                    </div>
                  </div>
                </div>

                {/* Modo de daltonismo */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <Type size={16} className="text-purple-400" />
                    {t('studentDashboard.accessibility.colorBlind', 'Modo de Daltonismo')}
                  </h3>
                  
                  <div className="space-y-2">
                    {colorBlindModes.map((mode) => (
                      <button
                        key={mode.value}
                        onClick={() => handleSettingChange('colorBlindMode', mode.value)}
                        className={`w-full p-3 rounded-lg border text-left transition-all ${
                          accessibilitySettings.colorBlindMode === mode.value
                            ? 'border-purple-500/50 bg-purple-500/20'
                            : 'border-slate-600/50 bg-slate-700/30 hover:bg-slate-700/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium text-slate-200">
                              {mode.label}
                            </div>
                            <div className="text-xs text-slate-400">
                              {mode.description}
                            </div>
                          </div>
                          {accessibilitySettings.colorBlindMode === mode.value && (
                            <CheckCircle size={16} className="text-purple-400" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Resumen de configuraciones activas */}
                <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                  <h4 className="text-sm font-semibold text-slate-200 mb-2">
                    {t('studentDashboard.accessibility.activeSettings', 'Configuraciones Activas')}
                  </h4>
                  <div className="space-y-1">
                    {Object.entries(accessibilitySettings).map(([key, value]) => {
                      if (typeof value === 'boolean' && value) {
                        return (
                          <div key={key} className="text-xs text-slate-300 flex items-center gap-2">
                            <CheckCircle size={12} className="text-green-400" />
                            {t(`studentDashboard.accessibility.${key}`, key)}
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AccessibilityFeatures;



