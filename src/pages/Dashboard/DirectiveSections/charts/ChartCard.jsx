import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const ChartCard = ({ titleKey, descriptionKey, icon, chartData, ChartComponent, options, additionalInfo = null, loading, error }) => {
  const { t } = useLanguage();

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white hover-lift h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center">{icon} {t(titleKey || 'dashboard.defaultTitle', 'Gráfico')}</CardTitle>
        <CardDescription className="text-purple-300">{t(descriptionKey || 'dashboard.defaultDescription', 'Descripción del gráfico')}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-center">
        {loading ? (
          <div className="h-60 flex items-center justify-center text-purple-200">{t('dashboard.loadingText', 'Cargando...')}</div>
        ) : error ? (
          <div className="h-60 flex flex-col items-center justify-center text-red-300">
            <AlertCircle size={32} className="mb-2"/>
            <p>{t('common.errorLoadingData', 'Error al cargar datos')}</p>
            <p className="text-xs mt-1">{error}</p>
          </div>
        ) : chartData ? (
          <div className="h-60 relative">
            <ChartComponent data={chartData} options={options} />
            {additionalInfo && <p className="text-sm text-purple-200 mt-2 text-center">{additionalInfo}</p>}
          </div>
        ) : (
          <div className="h-60 flex items-center justify-center text-purple-200">{t('common.noDataAvailable')}</div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChartCard;