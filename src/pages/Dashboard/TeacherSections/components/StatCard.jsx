import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight } from 'lucide-react';

const StatCard = ({ title, value, Icon, color, actionText, onAction, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="p-8 bg-slate-800/70 border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-8 w-3/5 bg-slate-700" />
          <Skeleton className="h-12 w-12 rounded-full bg-slate-700" />
        </div>
        <Skeleton className="h-12 w-1/3 mb-6 bg-slate-700" />
        <Skeleton className="h-12 w-full bg-slate-700" />
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 sm:p-8 md:p-10 lg:p-12 bg-slate-800/70 border border-slate-700 shadow-lg hover:shadow-xl hover:border-slate-600 transition-all duration-300 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="font-semibold text-slate-300 text-base sm:text-lg md:text-xl truncate">{title}</h3>
          <Icon className={`h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 ${color} flex-shrink-0`} />
        </div>
        <p className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold ${color}`}>{value}</p>
        <div className="mt-auto pt-4 sm:pt-6 md:pt-8">
          <Button 
            variant="ghost" 
            onClick={onAction}
            className={`w-full justify-start p-0 h-auto text-sm sm:text-base ${color} hover:text-white`}
          >
            <span className="truncate">{actionText}</span>
            <ArrowRight size={16} className="sm:hidden ml-2 flex-shrink-0" />
            <ArrowRight size={18} className="hidden sm:block ml-3 flex-shrink-0" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default StatCard;