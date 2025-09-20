import React from 'react';

const FormSeparator = ({ t }) => {
  return (
    <div className="relative my-3 sm:my-4 md:my-6">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-gray-300 dark:border-gray-600" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-white dark:bg-gray-800 px-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">{t("demoDialog.orContinueWith")}</span>
      </div>
    </div>
  );
};

export default FormSeparator;