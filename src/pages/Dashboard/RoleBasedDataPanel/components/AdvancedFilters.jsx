import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Filter, RotateCcw } from 'lucide-react';

const AdvancedFilters = ({ onFilterChange }) => {
  const { t } = useLanguage();
  const [filters, setFilters] = useState({
    diagnostic: 'all',
    performance: 'all',
    emotional_status: 'all',
    last_contact: 'all',
    attendance: 'all',
    last_resource_date: 'all',
    view_by: 'individual',
  });

  const handleSelectChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  const handleReset = () => {
    const initialFilters = {
      diagnostic: 'all',
      performance: 'all',
      emotional_status: 'all',
      last_contact: 'all',
      attendance: 'all',
      last_resource_date: 'all',
      view_by: 'individual',
    };
    setFilters(initialFilters);
    onFilterChange(initialFilters); 
  };

  const filterOptions = {
    diagnostic: [
      { value: 'all', labelKey: 'roleBasedDataPanel.filters.allDiagnostics' },
      { value: 'tdah', labelKey: 'roleBasedDataPanel.filters.diagnostics.tdah' },
      { value: 'dislexia', labelKey: 'roleBasedDataPanel.filters.diagnostics.dislexia' },
      { value: 'ansiedad', labelKey: 'roleBasedDataPanel.filters.diagnostics.anxiety' },
    ],
    performance: [
      { value: 'all', labelKey: 'roleBasedDataPanel.filters.allPerformances' },
      { value: 'high', labelKey: 'roleBasedDataPanel.filters.performance.high' },
      { value: 'medium', labelKey: 'roleBasedDataPanel.filters.performance.medium' },
      { value: 'low', labelKey: 'roleBasedDataPanel.filters.performance.low' },
    ],
    view_by: [
        { value: 'individual', labelKey: 'roleBasedDataPanel.filters.viewBy.individual' },
        { value: 'groups', labelKey: 'roleBasedDataPanel.filters.viewBy.groups' },
        { value: 'courses', labelKey: 'roleBasedDataPanel.filters.viewBy.courses' },
    ]
    // Add more options for emotional_status, last_contact, attendance, last_resource_date
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700/60">
      <CardHeader>
        <CardTitle className="text-xl text-sky-300 flex items-center">
          <Filter className="mr-2 text-purple-400" />
          {t('roleBasedDataPanel.filters.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.keys(filterOptions).map((filterKey) => (
            <div key={filterKey}>
              <label htmlFor={filterKey} className="block text-sm font-medium text-slate-300 mb-1">
                {t(`roleBasedDataPanel.filters.labels.${filterKey}`)}
              </label>
              <Select
                name={filterKey}
                value={filters[filterKey]}
                onValueChange={(value) => handleSelectChange(filterKey, value)}
              >
                <SelectTrigger id={filterKey} className="w-full bg-slate-700 border-slate-600 text-white focus:ring-sky-500">
                  <SelectValue placeholder={t(`roleBasedDataPanel.filters.placeholders.${filterKey}`)} />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600 text-white">
                  {filterOptions[filterKey].map(option => (
                    <SelectItem key={option.value} value={option.value} className="hover:bg-slate-600 focus:bg-slate-600">
                      {t(option.labelKey)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
          
          <div className="flex space-x-3 pt-2">
            <Button type="submit" className="flex-1 bg-sky-500 hover:bg-sky-600 text-white">
              <Filter size={16} className="mr-2" />{t('roleBasedDataPanel.filters.applyButton')}
            </Button>
            <Button type="button" variant="outline" onClick={handleReset} className="flex-1 text-slate-300 border-slate-600 hover:bg-slate-700">
              <RotateCcw size={16} className="mr-2" />{t('roleBasedDataPanel.filters.resetButton')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdvancedFilters;