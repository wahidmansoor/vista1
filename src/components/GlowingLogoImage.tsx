import React from 'react';
import { motion } from 'framer-motion';

const GlowingLogoImage: React.FC = () => {
  return (
    <motion.div
      className="relative flex justify-center items-center py-12"
      initial={{ opacity: 0, scale: 0.8, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 1.5,
        ease: "easeOut",
        delay: 0.2
      }}
    >
      {/* Outer Atmospheric Blur */}
      <motion.div
        className="absolute inset-0 w-[50rem] h-[50rem] mx-auto bg-gradient-to-r from-purple-600/20 via-violet-500/15 to-cyan-500/20 rounded-full blur-[120px] opacity-40"
        animate={{
          scale: [0.8, 1.2, 0.8],
          opacity: [0.2, 0.5, 0.2],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Primary Background Glow */}
      <motion.div
        className="absolute inset-0 w-[40rem] h-[40rem] mx-auto bg-gradient-to-br from-purple-500/30 via-blue-500/25 to-cyan-400/20 rounded-full blur-[80px] opacity-70"
        animate={{
          scale: [0.9, 1.1, 0.9],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Secondary Blur Layer */}
      <motion.div
        className="absolute inset-0 w-[32rem] h-[32rem] mx-auto bg-gradient-to-r from-violet-400/25 via-purple-500/30 to-blue-400/20 rounded-full blur-[60px] opacity-60"
        animate={{
          scale: [1.1, 0.8, 1.1],
          opacity: [0.4, 0.7, 0.4]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      {/* Inner Radial Glow */}
      <motion.div
        className="absolute inset-0 w-[24rem] h-[24rem] mx-auto bg-gradient-radial from-blue-400/30 via-purple-400/20 to-transparent rounded-full blur-[40px] opacity-80"
        animate={{
          rotate: [0, 360],
          scale: [0.7, 1.3, 0.7]
        }}
        transition={{
          rotate: { duration: 25, repeat: Infinity, ease: "linear" },
          scale: { duration: 10, repeat: Infinity, ease: "easeInOut" }
        }}
      />      
      {/* Main Logo */}
      <motion.img
        src="/icons/mwoncovista-logo.png"
        alt="MWONCOVISTA Logo"
        className="relative z-10 w-80 sm:w-96 md:w-[28rem] lg:w-[32rem] xl:w-[36rem] h-auto object-contain"
        animate={{
          filter: [
            "drop-shadow(0 0 25px rgba(59, 130, 246, 0.8)) drop-shadow(0 0 50px rgba(147, 51, 234, 0.6)) drop-shadow(0 0 75px rgba(168, 85, 247, 0.4))",
            "drop-shadow(0 0 35px rgba(59, 130, 246, 1)) drop-shadow(0 0 70px rgba(147, 51, 234, 0.8)) drop-shadow(0 0 100px rgba(168, 85, 247, 0.6))",
            "drop-shadow(0 0 30px rgba(59, 130, 246, 0.9)) drop-shadow(0 0 60px rgba(147, 51, 234, 0.7)) drop-shadow(0 0 90px rgba(168, 85, 247, 0.5))",
            "drop-shadow(0 0 35px rgba(59, 130, 246, 1)) drop-shadow(0 0 70px rgba(147, 51, 234, 0.8)) drop-shadow(0 0 100px rgba(168, 85, 247, 0.6))",
            "drop-shadow(0 0 25px rgba(59, 130, 246, 0.8)) drop-shadow(0 0 50px rgba(147, 51, 234, 0.6)) drop-shadow(0 0 75px rgba(168, 85, 247, 0.4))"
          ]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        whileHover={{
          scale: 1.08,
          filter: "drop-shadow(0 0 40px rgba(59, 130, 246, 1.2)) drop-shadow(0 0 80px rgba(147, 51, 234, 1)) drop-shadow(0 0 120px rgba(168, 85, 247, 0.8))",
          transition: { duration: 0.4 }
        }}
      />
      
      {/* Ambient Particles Effect */}
      <motion.div
        className="absolute inset-0 w-[20rem] h-[20rem] mx-auto opacity-50"
        animate={{
          background: [
            "radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, rgba(59, 130, 246, 0.3) 40%, rgba(34, 197, 94, 0.2) 70%, transparent 90%)",
            "radial-gradient(circle, rgba(168, 85, 247, 0.6) 0%, rgba(59, 130, 246, 0.5) 40%, rgba(34, 197, 94, 0.3) 70%, transparent 90%)",
            "radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, rgba(59, 130, 246, 0.3) 40%, rgba(34, 197, 94, 0.2) 70%, transparent 90%)"
          ]
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3
        }}
        style={{
          filter: "blur(50px)",
          transform: "scale(0.6)"
        }}
      />      {/* Final Outer Glow */}
      <div className="absolute inset-0 w-full h-full max-w-[48rem] max-h-[48rem] mx-auto bg-gradient-to-r from-purple-400/8 to-cyan-400/8 rounded-full blur-[100px] opacity-40"></div>
    </motion.div>
  );
};

export default GlowingLogoImage;
