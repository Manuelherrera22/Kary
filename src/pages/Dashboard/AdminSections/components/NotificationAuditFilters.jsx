import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabaseClient';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, RotateCcw } from 'lucide-react';

const NotificationAuditFilters = ({ onFilterChange, initialFilters }) => {
  const { t } = useLanguage();
  const [filters, setFilters] = useState(initialFilters);
  const [institutions, setInstitutions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [eventTypes, setEventTypes] = useState([]); 

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const { data: institutionsData, error: institutionsError } = await supabase
          .from('user_profiles')
          .select('institution_name')
          .distinct();
        if (institutionsError) throw institutionsError;
        setInstitutions([...new Set(institutionsData.map(i => i.institution_name).filter(Boolean))]);

        const { data: rolesData, error: rolesError } = await supabase
          .from('roles')
          .select('name, display_name_key');
        if (rolesError) throw rolesError;
        setRoles(rolesData.map(r => ({ value: r.name, label: t(r.display_name_key, r.name) })));
        
        const { data: eventTypesData, error: eventTypesError } = await supabase
          .from('mensaje_plantillas_eventos')
          .select('tipo_evento')
          .distinct();
        if (eventTypesError) throw eventTypesError;
        setEventTypes([...new Set(eventTypesData.map(e => e.tipo_evento).filter(Boolean))]);

      } catch (error) {
        console.error('Error fetching filter options:', error);
      }
    };
    fetchFilterOptions();
  }, [t]);

  const handleInputChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name, checked) => {
    setFilters(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      p_institucion: null,
      p_tipo_evento: null,
      p_rol_destinatario: null,
      p_solo_no_leidas: false,
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <Card className="bg-slate-800/60 border-slate-700/70 shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-sky-300 flex items-center">
          <Filter size={22} className="mr-2" />
          {t('notificationAuditPage.filtersTitle')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="p_institucion" className="text-slate-300">{t('notificationAuditPage.filterInstitution')}</Label>
              <Select value={filters.p_institucion || ''} onValueChange={(value) => handleInputChange('p_institucion', value === 'all' ? null : value)}>
                <SelectTrigger id="p_institucion" className="w-full bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder={t('common.selectOption')} />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 text-white border-slate-600">
                  <SelectItem value="all">{t('common.all')}</SelectItem>
                  {institutions.map(inst => <SelectItem key={inst} value={inst}>{inst}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="p_rol_destinatario" className="text-slate-300">{t('notificationAuditPage.filterRecipientRole')}</Label>
              <Select value={filters.p_rol_destinatario || ''} onValueChange={(value) => handleInputChange('p_rol_destinatario', value === 'all' ? null : value)}>
                <SelectTrigger id="p_rol_destinatario" className="w-full bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder={t('common.selectOption')} />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 text-white border-slate-600">
                  <SelectItem value="all">{t('common.all')}</SelectItem>
                  {roles.map(role => <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="p_tipo_evento" className="text-slate-300">{t('notificationAuditPage.filterEventType')}</Label>
              <Select value={filters.p_tipo_evento || ''} onValueChange={(value) => handleInputChange('p_tipo_evento', value === 'all' ? null : value)}>
                <SelectTrigger id="p_tipo_evento" className="w-full bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder={t('common.selectOption')} />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 text-white border-slate-600">
                  <SelectItem value="all">{t('common.all')}</SelectItem>
                  {eventTypes.map(type => <SelectItem key={type} value={type}>{t(`eventTitles.${type}`, type)}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <div className="flex items-center space-x-2 pt-6">
                <Checkbox
                  id="p_solo_no_leidas"
                  checked={filters.p_solo_no_leidas}
                  onCheckedChange={(checked) => handleCheckboxChange('p_solo_no_leidas', checked)}
                  className="border-slate-500 data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500"
                />
                <Label htmlFor="p_solo_no_leidas" className="text-slate-300 cursor-pointer">{t('notificationAuditPage.filterUnreadOnly')}</Label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-700/50">
            <Button type="button" variant="outline" onClick={handleReset} className="text-slate-300 border-slate-600 hover:bg-slate-700 hover:text-white">
              <RotateCcw size={16} className="mr-2" />
              {t('common.resetButton')}
            </Button>
            <Button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white">
              <Filter size={16} className="mr-2" />
              {t('common.applyFiltersButton')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default NotificationAuditFilters;