import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const DashboardCard = ({ 
  title, 
  description, 
  IconComponent, // Renamed from icon to IconComponent for clarity
  iconColor = 'text-sky-400', // Default icon color
  link, 
  className, 
  colSpan = "sm:col-span-1", 
  cardVariants,
  children,
  bgColor = 'bg-slate-800/50', // Default background color
  hoverBgColor = 'hover:bg-slate-700/70', // Default hover background color
  buttonTextKey 
}) => {
  const { t } = useLanguage();
  const defaultCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const cardBaseClasses = `p-5 rounded-xl shadow-lg hover:shadow-xl border border-slate-700/60 flex flex-col justify-between h-full transition-all duration-300 ease-out group ${bgColor} ${hoverBgColor}`;
  
  const content = (
    <>
      <div className="flex-grow">
        {IconComponent && (
          <div className={`mb-3 p-2.5 rounded-lg inline-block ${iconColor.replace('text-', 'bg-')}/10`}>
            <IconComponent className={`w-6 h-6 ${iconColor}`} />
          </div>
        )}
        {title && (
          <h3 className={`text-lg font-semibold text-slate-100 mb-1.5 ${IconComponent ? '' : 'mt-2'}`}>{title}</h3>
        )}
        {description && (
          <p className="text-sm text-slate-400 mb-3 leading-relaxed">{description}</p>
        )}
      </div>
      {children}
      {link && !children && (
         <div className="mt-auto pt-3 border-t border-slate-700/50">
            <span className={`inline-flex items-center text-sm font-medium ${iconColor.replace('text-','text-')} group-hover:underline`}>
              {t(buttonTextKey || 'common.accessNowButton')}
              <ArrowRight size={16} className="ml-1.5 transform transition-transform duration-200 group-hover:translate-x-1" />
            </span>
          </div>
      )}
    </>
  );

  return (
    <motion.div
      variants={cardVariants || defaultCardVariants}
      className={cn(
        cardBaseClasses,
        className, 
        colSpan
      )}
    >
      {link ? (
        <Link to={link} className="flex flex-col h-full">
          {content}
        </Link>
      ) : (
        content
      )}
    </motion.div>
  );
};

export default DashboardCard;