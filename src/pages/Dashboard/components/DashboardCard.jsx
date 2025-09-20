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
  buttonTextKey,
  // Nuevas propiedades para métricas
  progress = null,
  status = 'active',
  metrics = null,
  specialValue = null,
  specialColor = 'text-slate-400',
  disabled = false
}) => {
  const { t } = useLanguage();
  const defaultCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const cardBaseClasses = `p-3 sm:p-4 md:p-5 rounded-xl shadow-lg hover:shadow-xl border border-slate-700/60 flex flex-col justify-between h-full transition-all duration-300 ease-out group ${bgColor} ${hoverBgColor} ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`;
  
  const content = (
    <>
      <div className="flex-grow">
        {IconComponent && (
          <div className={`mb-2 sm:mb-3 p-1.5 sm:p-2 md:p-2.5 rounded-lg inline-block ${iconColor.replace('text-', 'bg-')}/10`}>
            <IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${iconColor}`} />
          </div>
        )}
        {title && (
          <h3 className={`text-sm sm:text-base md:text-lg font-semibold text-slate-100 mb-1 sm:mb-1.5 md:mb-2 ${IconComponent ? '' : 'mt-2'} leading-tight`}>{title}</h3>
        )}
        {description && (
          <p className="text-xs sm:text-sm text-slate-400 mb-2 sm:mb-3 leading-relaxed">{description}</p>
        )}
        
        {/* Mostrar métricas si están disponibles */}
        {metrics && status === 'active' && (
          <div className="mt-4 space-y-2">
            {progress !== null && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Progreso</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {/* Mostrar métricas específicas */}
            {Object.entries(metrics).map(([key, value]) => (
              <div key={key} className="flex justify-between text-xs">
                <span className="text-slate-400 capitalize">{key}:</span>
                <span className="text-slate-300 font-medium">{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {children}
      
      {/* Footer con información adicional */}
      <div className="mt-auto pt-2 sm:pt-3 border-t border-slate-700/50">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            {link && !children && (
              <span className={`inline-flex items-center text-xs sm:text-sm font-medium ${iconColor.replace('text-','text-')} group-hover:underline`}>
                {t(buttonTextKey || 'common.accessNowButton')}
                <ArrowRight size={14} className="sm:hidden ml-1" />
                <ArrowRight size={16} className="hidden sm:block ml-1.5 transform transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            )}
            {specialValue && (
              <span className={`text-xs font-medium ${specialColor} mt-1`}>
                {specialValue}
              </span>
            )}
          </div>
          {status === 'active' && !disabled && (
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          )}
        </div>
      </div>
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