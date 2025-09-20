import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight } from 'lucide-react';

const StatCard = ({ title, value, Icon, color, actionText, onAction, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="p-5 bg-slate-800/70 border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-6 w-3/5 bg-slate-700" />
          <Skeleton className="h-8 w-8 rounded-full bg-slate-700" />
        </div>
        <Skeleton className="h-10 w-1/3 mb-4 bg-slate-700" />
        <Skeleton className="h-9 w-full bg-slate-700" />
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-2 sm:p-3 md:p-4 lg:p-5 bg-slate-800/70 border border-slate-700 shadow-lg hover:shadow-xl hover:border-slate-600 transition-all duration-300 flex flex-col h-full">
        <div className="flex items-center justify-between mb-1 sm:mb-2">
          <h3 className="font-semibold text-slate-300 text-xs sm:text-sm md:text-base truncate">{title}</h3>
          <Icon className={`h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 ${color} flex-shrink-0`} />
        </div>
        <p className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold ${color}`}>{value}</p>
        <div className="mt-auto pt-2 sm:pt-3 md:pt-4">
          <Button 
            variant="ghost" 
            onClick={onAction}
            className={`w-full justify-start p-0 h-auto text-xs sm:text-sm ${color} hover:text-white`}
          >
            <span className="truncate">{actionText}</span>
            <ArrowRight size={12} className="sm:hidden ml-1 flex-shrink-0" />
            <ArrowRight size={14} className="hidden sm:block ml-1.5 flex-shrink-0" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default StatCard;