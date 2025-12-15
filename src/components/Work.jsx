import React from "react";

const projects = [
  {
    id: "01",
    title: "AI Virtual Mouse",
    category: "Computer Vision",
    tech: "OpenCV / MediaPipe",
    desc: "A touchless interface controlled purely by hand gestures. No hardware required.",
  },
  {
    id: "02",
    title: "Digit Recognition",
    category: "Deep Learning",
    tech: "CNN / TensorFlow",
    desc: "High-accuracy neural network trained to recognize handwritten digits.",
  },
  {
    id: "03",
    title: "Aesthetic Store",
    category: "E-Commerce",
    tech: "Shopify / GenAI",
    desc: "A fully automated digital storefront for curated design assets.",
  },
];

const Work = () => {
  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <h2 className="text-6xl font-bold uppercase tracking-tighter mb-16">Selected Work</h2>
      
      <div className="flex flex-col gap-20">
        {projects.map((project) => (
          <div key={project.id} className="group grid grid-cols-1 md:grid-cols-2 gap-10 items-center cursor-pointer">
            {/* The Image Placeholder (Replace bg-tertiary with <img src={...} /> later) */}
            <div className="w-full h-[400px] bg-tertiary relative overflow-hidden">
               <div className="absolute inset-0 bg-black-100 opacity-0 group-hover:opacity-10 transition-opacity" />
               <p className="absolute bottom-4 left-4 text-xs font-bold bg-white px-2 py-1">PREVIEW IMAGE</p>
            </div>

            {/* The Info */}
            <div>
              <span className="text-accent font-bold text-sm tracking-widest mb-2 block">{project.category}</span>
              <h3 className="text-5xl font-bold mb-4 uppercase group-hover:text-secondary transition-colors">{project.title}</h3>
              <p className="text-lg text-secondary mb-6 max-w-md">{project.desc}</p>
              <div className="flex items-center gap-4 text-sm font-bold uppercase tracking-wider">
                <span>{project.tech}</span>
                <span className="w-10 h-[1px] bg-black-100"></span>
                <span>{project.id}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Work;