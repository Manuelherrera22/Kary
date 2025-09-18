import React from 'react';
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

const FormErrorDisplay = ({ errorText }) => {
  if (!errorText) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start p-3 text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-500/50 rounded-md"
    >
      <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
      <p>{errorText}</p>
    </motion.div>
  );
};

export default FormErrorDisplay;