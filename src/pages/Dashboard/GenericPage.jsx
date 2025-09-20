import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GenericPage = ({ 
  title, 
  description, 
  icon: Icon, 
  children, 
  showBackButton = true,
  backPath = '/dashboard'
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          {showBackButton && (
            <Button
              variant="ghost"
              onClick={() => navigate(backPath)}
              className="mb-4 text-slate-300 hover:text-white"
            >
              <ArrowLeft size={16} className="mr-2" />
              {t('common.back', 'Volver')}
            </Button>
          )}
          
          <div className="flex items-center gap-4">
            {Icon && (
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
                <Icon size={32} className="text-white" />
              </div>
            )}
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                {title}
              </h1>
              {description && (
                <p className="text-slate-400 mt-2 text-sm sm:text-base">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {children || (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  {t('common.comingSoon', 'Próximamente')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  {t('common.featureInDevelopment', 'Esta funcionalidad está en desarrollo. Pronto estará disponible.')}
                </p>
                <Button
                  onClick={() => navigate('/dashboard')}
                  className="mt-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  <Home size={16} className="mr-2" />
                  {t('common.backToDashboard', 'Volver al Dashboard')}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenericPage;
