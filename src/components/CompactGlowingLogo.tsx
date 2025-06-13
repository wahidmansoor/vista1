import React from 'react';
import { motion } from 'framer-motion';

const CompactGlowingLogo: React.FC = () => {
  return (
    <motion.div
      className="relative flex justify-center items-center w-8 h-8"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.8,
        ease: "easeOut"
      }}
    >
      {/* Compact Background Glow */}
      <motion.div
        className="absolute inset-0 w-12 h-12 bg-gradient-to-br from-purple-500/20 via-blue-500/15 to-cyan-400/10 rounded-full blur-sm opacity-60"
        animate={{
          scale: [0.8, 1.2, 0.8],
          opacity: [0.4, 0.7, 0.4]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Inner Glow */}
      <motion.div
        className="absolute inset-0 w-10 h-10 bg-gradient-radial from-blue-400/25 via-purple-400/15 to-transparent rounded-full blur-xs opacity-70"
        animate={{
          rotate: [0, 360],
          scale: [0.7, 1.1, 0.7]
        }}
        transition={{
          rotate: { duration: 15, repeat: Infinity, ease: "linear" },
          scale: { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }}
      />      
      
      {/* Main Logo */}
      <motion.img
        src="/icons/mwoncovista-logo.png"
        alt="MWONCOVISTA Logo"
        className="relative z-10 w-8 h-8 object-contain"
        animate={{
          filter: [
            "drop-shadow(0 0 3px rgba(59, 130, 246, 0.6)) drop-shadow(0 0 6px rgba(147, 51, 234, 0.4))",
            "drop-shadow(0 0 5px rgba(59, 130, 246, 0.8)) drop-shadow(0 0 10px rgba(147, 51, 234, 0.6))",
            "drop-shadow(0 0 3px rgba(59, 130, 246, 0.6)) drop-shadow(0 0 6px rgba(147, 51, 234, 0.4))"
          ]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        whileHover={{
          scale: 1.1,
          filter: "drop-shadow(0 0 6px rgba(59, 130, 246, 1)) drop-shadow(0 0 12px rgba(147, 51, 234, 0.8))",
          transition: { duration: 0.3 }
        }}
      />
    </motion.div>
  );
};

export default CompactGlowingLogo;
