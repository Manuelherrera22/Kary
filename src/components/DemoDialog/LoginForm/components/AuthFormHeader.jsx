import React from 'react';

const AuthFormHeader = ({ isSignUpFlow, t }) => {
  return (
    <>
      <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2 text-center sm:text-left">
        {isSignUpFlow ? t("demoDialog.registerTitle") : t("demoDialog.accederTitle")}
      </h3>
      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 text-center sm:text-left leading-relaxed">
        {isSignUpFlow ? t("demoDialog.registerSubtitle") : t("demoDialog.accederSubtitle")}
      </p>
    </>
  );
};

export default AuthFormHeader;