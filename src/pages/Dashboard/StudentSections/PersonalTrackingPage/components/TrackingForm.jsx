import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Send, Tag, Info } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const TrackingForm = ({
  trackingText,
  setTrackingText,
  classifications,
  tags,
  selectedTags,
  toggleTag,
  onGuardarSeguimiento,
  isSubmitting,
  authLoading,
  isAnalyzing,
  isLoadingClassifications,
  isLoadingTags,
  selectedTagObjects
}) => {
  const { t } = useLanguage();
  const isLoadingInitialData = isLoadingClassifications || isLoadingTags;

  return (
    <Card className="bg-slate-800/60 backdrop-blur-md border-slate-700 shadow-2xl mb-6">
      <CardHeader>
        <CardTitle className="text-2xl text-slate-200 flex items-center">
          <Tag size={24} className="mr-2 text-rose-400" />
          {t('studentDashboard.personalTrackingPage.formTitle')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-2">
        <div>
          <Label htmlFor="trackingText" className="text-slate-300 text-base mb-1 block">
            {t('studentDashboard.personalTrackingPage.descriptionLabel')}
          </Label>
          <Textarea
            id="trackingText"
            value={trackingText}
            onChange={e => setTrackingText(e.target.value)}
            placeholder={t('studentDashboard.personalTrackingPage.descriptionPlaceholder')}
            className="bg-slate-700 border-slate-600 text-white focus:ring-rose-500 min-h-[120px] text-base"
            rows={4}
          />
        </div>

        <div>
          <Label className="text-slate-300 text-base mb-2 block">
            {t('studentDashboard.personalTrackingPage.selectTagsLabel')}
          </Label>
          {isLoadingInitialData ? (
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-slate-700 rounded w-1/3 animate-pulse"></div>
                  <div className="flex flex-wrap gap-2">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="h-8 bg-slate-700 rounded-full w-20 animate-pulse"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : classifications.length === 0 && tags.length === 0 ? (
            <div className="flex items-center p-3 text-sm text-yellow-300 bg-yellow-700/30 rounded-md border border-yellow-600">
              <Info size={18} className="mr-2 shrink-0" />
              <p>{t('studentDashboard.personalTrackingPage.noTagsOrClassifications')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {classifications.map(cls => {
                const classificationTags = tags.filter(tag => tag.classification_id === cls.id);
                if (classificationTags.length === 0) return null;
                return (
                  <div key={cls.id} className="w-full">
                    <p className="text-sm font-medium mb-2" style={{ color: cls.color_code || '#FFFFFF' }}>
                      {cls.name}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {classificationTags.map(tag => (
                        <Badge
                          key={tag.id}
                          variant={selectedTags.includes(tag.id) ? 'default' : 'outline'}
                          onClick={() => toggleTag(tag)}
                          className={`cursor-pointer transition-all duration-200 ease-out text-sm px-3 py-1.5 hover:opacity-80
                            ${selectedTags.includes(tag.id)
                              ? 'bg-rose-500 border-rose-500 text-white dark:bg-rose-600 dark:border-rose-600'
                              : 'border-slate-500 text-slate-300 hover:bg-slate-700 hover:border-slate-400'
                            }`}
                          style={selectedTags.includes(tag.id) ? { backgroundColor: cls.color_code, borderColor: cls.color_code, color: '#fff' } : { borderColor: cls.color_code, color: cls.color_code }}
                        >
                          {tag.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <Button
          onClick={onGuardarSeguimiento}
          disabled={isSubmitting || (!trackingText.trim() && selectedTagObjects.length === 0) || authLoading || isLoadingInitialData || isAnalyzing}
          className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold py-3 text-base disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting || authLoading || isAnalyzing ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Send size={18} className="mr-2" />
          )}
          {isSubmitting ? t('common.submitting') : authLoading ? t('common.loadingAuthenticating') : isAnalyzing ? t('studentDashboard.personalTrackingPage.analyzing') : t('studentDashboard.personalTrackingPage.submitButton')}
        </Button>
      </CardContent>
    </Card>
  );
};

export default TrackingForm;