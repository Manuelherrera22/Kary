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
      <Card className="p-5 bg-slate-800/70 border border-slate-700 shadow-lg hover:shadow-xl hover:border-slate-600 transition-all duration-300 flex flex-col h-full">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-slate-300">{title}</h3>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
        <p className={`text-4xl font-bold ${color}`}>{value}</p>
        <div className="mt-auto pt-4">
          <Button 
            variant="ghost" 
            onClick={onAction}
            className={`w-full justify-start p-0 h-auto ${color} hover:text-white`}
          >
            {actionText}
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default StatCard;