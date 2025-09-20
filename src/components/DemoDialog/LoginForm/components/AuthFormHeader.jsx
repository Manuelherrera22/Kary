import React from 'react';

const AuthFormHeader = ({ isSignUpFlow, t }) => {
  return (
    <>
      <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-1 sm:mb-2 text-center sm:text-left">
        {isSignUpFlow ? t("demoDialog.registerTitle") : t("demoDialog.accederTitle")}
      </h3>
      <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 md:mb-6 text-center sm:text-left leading-relaxed">
        {isSignUpFlow ? t("demoDialog.registerSubtitle") : t("demoDialog.accederSubtitle")}
      </p>
    </>
  );
};

export default AuthFormHeader;