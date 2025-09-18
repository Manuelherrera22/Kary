import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const MagicPortalCard = ({ title, description, Icon, link, custom, auraColor }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      custom={custom}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, y: 50, scale: 0.85 },
        visible: (i) => ({
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { delay: i * 0.1 + 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] },
        }),
      }}
      whileHover={{ y: -12, boxShadow: `0px 25px 40px -15px ${auraColor}` }}
      onClick={() => navigate(link)}
      className="p-6 rounded-3xl bg-slate-800/40 border border-white/10 shadow-lg cursor-pointer flex flex-col text-center items-center h-full transition-all duration-300 group backdrop-blur-sm overflow-hidden relative"
    >
      <motion.div className="absolute -inset-24 opacity-0 group-hover:opacity-25 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle, ${auraColor} 0%, transparent 70%)` }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear'}}
      />
      <motion.div 
        className="p-4 mb-4 rounded-full inline-block bg-slate-900/60 relative transition-all duration-300 group-hover:scale-110"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: custom * 0.2 }}
      >
        <Icon size={36} className="text-slate-200" />
      </motion.div>
      <h3 className="text-xl font-bold text-slate-100 mb-2">{title}</h3>
      <p className="text-sm text-slate-400 flex-grow">{description}</p>
    </motion.div>
  );
};

export default MagicPortalCard;