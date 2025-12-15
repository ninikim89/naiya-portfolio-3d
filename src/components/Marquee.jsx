import React from "react";
import { motion } from "framer-motion";

const Marquee = () => {
  const marqueeVariants = {
    animate: {
      x: [0, -1000],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 20,
          ease: "linear",
        },
      },
    },
  };

  return (
    <div className="w-full py-10 bg-secondary overflow-hidden rotate-[-2deg] my-20 scale-105">
      <motion.div
        className="flex whitespace-nowrap"
        variants={marqueeVariants}
        animate="animate"
      >
        {[...Array(2)].map((_, i) => (
          <h1 key={i} className="text-primary text-6xl font-bold uppercase tracking-tighter mx-4">
            AI RESEARCHER • CREATIVE DEVELOPER • SHOPIFY CREATOR • COMPUTER VISION • 
          </h1>
        ))}
      </motion.div>
    </div>
  );
};

export default Marquee;