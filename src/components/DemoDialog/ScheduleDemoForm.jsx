import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Send, User, Mail, Briefcase, Building, MapPin, MessageSquare, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabaseClient";

const ScheduleDemoForm = ({ onOpenChange }) => {
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleAgendarSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const { error } = await supabase.from('demo_requests').insert([
        { 
          full_name: data.fullName, 
          email: data.email,
          role: data.role,
          institution: data.institution,
          city_country: data.cityCountry,
          datetime_preference: data.dateTimePref,
          comments: data.comments
        }
      ]);
      if (error) throw error;
      toast({
        title: t("toast.demoRequestSentTitle"),
        description: t("toast.demoRequestSentDescription"),
        className: "bg-green-500 text-white dark:bg-green-600"
      });
      onOpenChange(false);
      e.target.reset();
    } catch (error) {
      console.error("Error submitting demo request:", error);
      toast({
        title: t("toast.errorTitle"),
        description: t("toast.demoRequestErrorDescription"),
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">{t("demoDialog.agendarTitle")}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{t("demoDialog.agendarSubtitle")}</p>
      <form onSubmit={handleAgendarSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"><User size={14} className="mr-1.5 text-purple-500 dark:text-purple-400"/>{t("demoDialog.formFullName")}</Label>
            <Input name="fullName" id="fullName" placeholder={t("demoDialog.formFullNamePlaceholder")} className="mt-1 py-2.5 bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600" required />
          </div>
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"><Mail size={14} className="mr-1.5 text-purple-500 dark:text-purple-400"/>{t("demoDialog.formEmail")}</Label>
            <Input name="email" id="email" type="email" placeholder={t("demoDialog.formEmailPlaceholder")} className="mt-1 py-2.5 bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600" required />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="role" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"><Briefcase size={14} className="mr-1.5 text-purple-500 dark:text-purple-400"/>{t("demoDialog.formRole")}</Label>
            <Input name="role" id="role" placeholder={t("demoDialog.formRolePlaceholder")} className="mt-1 py-2.5 bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600" required />
          </div>
          <div>
            <Label htmlFor="institution" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"><Building size={14} className="mr-1.5 text-purple-500 dark:text-purple-400"/>{t("demoDialog.formInstitution")}</Label>
            <Input name="institution" id="institution" placeholder={t("demoDialog.formInstitutionPlaceholder")} className="mt-1 py-2.5 bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600" required />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <Label htmlFor="cityCountry" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"><MapPin size={14} className="mr-1.5 text-purple-500 dark:text-purple-400"/>{t("demoDialog.formCityCountry")}</Label>
                <Input name="cityCountry" id="cityCountry" placeholder={t("demoDialog.formCityCountryPlaceholder")} className="mt-1 py-2.5 bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600" required />
            </div>
            <div>
                <Label htmlFor="dateTimePref" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"><Clock size={14} className="mr-1.5 text-purple-500 dark:text-purple-400"/>{t("demoDialog.formDateTimePref")}</Label>
                <Input name="dateTimePref" id="dateTimePref" placeholder={t("demoDialog.formDateTimePrefPlaceholder")} className="mt-1 py-2.5 bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600" />
            </div>
        </div>
        <div>
          <Label htmlFor="comments" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"><MessageSquare size={14} className="mr-1.5 text-purple-500 dark:text-purple-400"/>{t("demoDialog.formComments")}</Label>
          <Input name="comments" as="textarea" id="comments" placeholder={t("demoDialog.formCommentsPlaceholder")} className="mt-1 min-h-[80px] py-2.5 bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600" />
        </div>
        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline" className="py-3 text-base border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">{t("demoDialog.buttonCancel")}</Button>
          </DialogClose>
          <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white py-3 text-base font-semibold">
            <Send size={16} className="mr-2" /> {t("demoDialog.buttonSend")}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
};

export default ScheduleDemoForm;