import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, MessageSquare } from 'lucide-react';
import FeedbackModal from './FeedbackModal';

const FeedbackBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-4 relative shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-lg">¡Ayúdanos a mejorar Kary!</div>
            <div className="text-sm opacity-90">Tu feedback es importante para nosotros</div>
          </div>
          <FeedbackModal />
        </div>
      </div>
    </div>
  );
};

export default FeedbackBanner;