import React from "react";

const Footer = () => {
  return (
    // We changed bg-black-100 to bg-[#1C1C1C] (Hardcoded Dark Charcoal)
    // We changed text-primary to text-[#EBEBEB] (Hardcoded Beige)
    <footer className="w-full bg-[#1C1C1C] text-[#EBEBEB] py-20 px-8">
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end">
        
        {/* Left Side: Big Call to Action */}
        <div>
          <h2 className="text-[12vw] md:text-[8vw] leading-[0.8] font-bold tracking-tighter uppercase mb-8 text-white">
            Let's <br/> Talk
          </h2>
          <div className="flex flex-col gap-2 text-lg opacity-70 font-light">
            <a href="mailto:naiya.dave@example.com" className="hover:text-white transition-colors">naiya.dave@example.com</a>
            <p>Gujarat, India</p>
          </div>
        </div>

        {/* Right Side: Links */}
        <div className="flex flex-col gap-4 mt-12 md:mt-0 text-left md:text-right">
          <a href="https://linkedin.com/in/naiya-dave" target="_blank" className="text-2xl font-bold uppercase hover:text-orange-500 transition-colors">LinkedIn ↗</a>
          <a href="https://github.com/ninikim89" target="_blank" className="text-2xl font-bold uppercase hover:text-orange-500 transition-colors">GitHub ↗</a>
          <a href="#" target="_blank" className="text-2xl font-bold uppercase hover:text-orange-500 transition-colors">Shopify Store ↗</a>
        </div>

      </div>
      
      {/* Bottom Copyright Line */}
      <div className="mt-20 pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between text-xs uppercase tracking-widest opacity-40">
        <p>© 2026 Naiya Dave. All Rights Reserved.</p>
        <p className="mt-2 md:mt-0">Built with React & Tailwind</p>
      </div>

    </footer>
  );
};

export default Footer;