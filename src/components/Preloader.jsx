import React from "react";
import { motion } from "framer-motion";

const Preloader = () => {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: "-100%" }}
      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 2 }} // Waits 2s then slides up
      className="fixed inset-0 z-[99] bg-[#1C1C1C] flex items-center justify-center"
    >
      <motion.h1 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="text-white text-6xl md:text-9xl font-bold uppercase tracking-tighter"
      >
        Naiya Dave
      </motion.h1>
    </motion.div>
  );
};

export default Preloader;