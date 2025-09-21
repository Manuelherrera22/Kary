import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Star, Zap, CheckCircle, AlertCircle } from 'lucide-react';

const MicroInteractions = () => {
  const [floatingElements, setFloatingElements] = useState([]);
  const [celebration, setCelebration] = useState(false);

  // Crear elementos flotantes aleatorios
  useEffect(() => {
    const createFloatingElement = () => {
      const elements = ['sparkles', 'heart', 'star', 'zap'];
      const randomElement = elements[Math.floor(Math.random() * elements.length)];
      
      return {
        id: Date.now() + Math.random(),
        type: randomElement,
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + 50,
        delay: Math.random() * 2
      };
    };

    const interval = setInterval(() => {
      setFloatingElements(prev => {
        const newElement = createFloatingElement();
        return [...prev.slice(-4), newElement];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Simular celebración ocasional
  useEffect(() => {
    const celebrationInterval = setInterval(() => {
      setCelebration(true);
      setTimeout(() => setCelebration(false), 2000);
    }, 15000);

    return () => clearInterval(celebrationInterval);
  }, []);

  const getElementIcon = (type) => {
    switch (type) {
      case 'sparkles': return <Sparkles size={16} className="text-yellow-400" />;
      case 'heart': return <Heart size={16} className="text-pink-400" />;
      case 'star': return <Star size={16} className="text-purple-400" />;
      case 'zap': return <Zap size={16} className="text-blue-400" />;
      default: return <Sparkles size={16} className="text-yellow-400" />;
    }
  };

  const getElementColor = (type) => {
    switch (type) {
      case 'sparkles': return 'text-yellow-400';
      case 'heart': return 'text-pink-400';
      case 'star': return 'text-purple-400';
      case 'zap': return 'text-blue-400';
      default: return 'text-yellow-400';
    }
  };

  return (
    <>
      {/* Elementos flotantes */}
      <AnimatePresence>
        {floatingElements.map((element) => (
          <motion.div
            key={element.id}
            initial={{ 
              x: element.x, 
              y: element.y, 
              opacity: 0, 
              scale: 0.5 
            }}
            animate={{ 
              x: element.x + (Math.random() - 0.5) * 100,
              y: -100, 
              opacity: [0, 1, 0], 
              scale: [0.5, 1, 0.5] 
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ 
              duration: 4, 
              delay: element.delay,
              ease: "easeOut" 
            }}
            className="fixed pointer-events-none z-50"
            style={{ left: 0, top: 0 }}
          >
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className={getElementColor(element.type)}
            >
              {getElementIcon(element.type)}
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Celebración */}
      <AnimatePresence>
        {celebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center"
            >
              <motion.div
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 0.8, 
                  repeat: 3, 
                  ease: "easeInOut" 
                }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-yellow-300"
              >
                ¡Excelente trabajo!
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-lg text-slate-300"
              >
                Sigue así, estás haciendo un gran progreso
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Partículas de fondo sutiles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-slate-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 0.5, 0],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </>
  );
};

export default MicroInteractions;





