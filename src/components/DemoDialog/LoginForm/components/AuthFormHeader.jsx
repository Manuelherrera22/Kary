import React from 'react';

const AuthFormHeader = ({ isSignUpFlow, t }) => {
  return (
    <>
      <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
        {isSignUpFlow ? t("demoDialog.registerTitle") : t("demoDialog.accederTitle")}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        {isSignUpFlow ? t("demoDialog.registerSubtitle") : t("demoDialog.accederSubtitle")}
      </p>
    </>
  );
};

export default AuthFormHeader;