import React, { useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion';

const MagicParticle = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const controls = useAnimation();

  useEffect(() => {
    const animateParticle = () => {
      controls.start({
        x: Math.random() * (window.innerWidth - 50),
        y: Math.random() * (window.innerHeight - 50),
        transition: {
          duration: 15 + Math.random() * 15,
          ease: "linear",
          repeat: Infinity,
          repeatType: "mirror",
        },
      });
    };
    animateParticle();
  }, [controls]);

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        x,
        y,
        width: `${2 + Math.random() * 4}px`,
        height: `${2 + Math.random() * 4}px`,
        background: `radial-gradient(circle, rgba(255, 255, 255, ${0.2 + Math.random() * 0.5}) 0%, transparent 70%)`,
        boxShadow: `0 0 ${5 + Math.random() * 10}px rgba(200, 200, 255, ${0.2 + Math.random() * 0.3})`,
      }}
      animate={controls}
    />
  );
};

const MagicBackground = ({ children }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const constraintsRef = useRef(null);

  const handleMouseMove = (e) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  useEffect(() => {
    const starsContainer = document.getElementById('stars-container');
    if (starsContainer) {
      starsContainer.innerHTML = '';
      for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 5}s`;
        star.style.animationDuration = `${2 + Math.random() * 3}s`;
        starsContainer.appendChild(star);
      }
    }
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const backgroundX = useTransform(mouseX, [0, window.innerWidth], ['-5%', '5%']);
  const backgroundY = useTransform(mouseY, [0, window.innerHeight], ['-5%', '5%']);

  return (
    <div className="relative min-h-screen font-poppins text-white overflow-hidden bg-slate-900">
      <motion.div 
        ref={constraintsRef}
        className="fixed inset-0 overflow-hidden bg-slate-900 -z-10"
        style={{ x: backgroundX, y: backgroundY }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
        <div id="stars-container" className="absolute inset-0"></div>
        {[...Array(25)].map((_, i) => <MagicParticle key={i} />)}
        <motion.div 
          className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-purple-500/10 rounded-full filter blur-3xl opacity-40"
          animate={{ x: [-100, 200, -100], y: [-50, 150, -50], scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 35, repeat: Infinity, repeatType: 'reverse' }}
        />
        <motion.div 
          className="absolute bottom-[-15%] right-[-15%] w-[35vw] h-[35vw] bg-sky-500/10 rounded-full filter blur-3xl opacity-30"
          animate={{ x: [100, -200, 100], y: [50, -150, 50], scale: [1, 0.8, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 40, repeat: Infinity, repeatType: 'reverse', delay: 5 }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 w-[30vw] h-[30vw] bg-violet-500/5 rounded-full filter blur-3xl opacity-20"
          animate={{ x: [-50, 50, -50], y: [-30, 30, -30], scale: [1, 1.1, 1], rotate: [0, 180, 0] }}
          transition={{ duration: 50, repeat: Infinity, repeatType: 'reverse', delay: 10 }}
        />
      </motion.div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default MagicBackground;