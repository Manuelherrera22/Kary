import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, AlertTriangle } from "lucide-react";

export default function EmotionalTagSelector({ onSelect, initialSelectedTagId = "" }) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [tags, setTags] = useState([]);
  const [selected, setSelected] = useState(initialSelectedTagId);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTags = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data, error: supabaseError } = await supabase
          .from("emotional_tags")
          .select("id, label, classification_id")
          .order("label", { ascending: true });

        if (supabaseError) {
          throw supabaseError;
        }

        if (data) {
          setTags(data);
        }
      } catch (err) {
        console.error("Error fetching emotional tags:", err);
        setError(t('emotionalTagSelector.fetchError'));
        toast({
          title: t('toast.errorTitle'),
          description: t('emotionalTagSelector.fetchError'),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTags();
  }, [t, toast]);

  useEffect(() => {
    setSelected(initialSelectedTagId);
  }, [initialSelectedTagId]);

  const handleChange = (value) => {
    setSelected(value);
    if (onSelect) {
      onSelect(value);
    }
  };

  return (
    <div className="w-full">
      <label htmlFor="emotional-tag-select" className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
        {t('emotionalTagSelector.label')}
      </label>
      <Select value={selected} onValueChange={handleChange} disabled={isLoading || error}>
        <SelectTrigger id="emotional-tag-select" className="w-full bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-700">
          <SelectValue placeholder={t('emotionalTagSelector.placeholder')} />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-slate-800">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-5 w-5 animate-spin text-slate-500 dark:text-slate-400" />
              <span className="ml-2 text-slate-500 dark:text-slate-400">{t('common.loading')}</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center p-4 text-red-600 dark:text-red-400">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          ) : tags.length === 0 ? (
             <SelectItem value="no-tags" disabled>
                {t('emotionalTagSelector.noTagsAvailable')}
              </SelectItem>
          ) : (
            tags.map((tag) => (
              <SelectItem key={tag.id} value={tag.id} className="hover:bg-slate-100 dark:hover:bg-slate-700">
                {tag.label}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}