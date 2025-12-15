import React from "react";

const services = [
  {
    title: "AI & Research",
    desc: "Building the brain. Specialized in Computer Vision, CNNs, and Deep Learning models.",
    tools: ["Python", "TensorFlow", "OpenCV", "MediaPipe"],
  },
  {
    title: "Creative Dev",
    desc: "Building the body. Creating immersive 3D web experiences and interactive frontends.",
    tools: ["React", "Three.js", "Tailwind", "Framer Motion"],
  },
  {
    title: "Digital Design",
    desc: "Building the soul. Curating aesthetic digital assets and managing e-commerce flows.",
    tools: ["Shopify", "Figma", "Gen AI", "Digital Marketing"],
  },
];

const Services = () => {
  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-tertiary pb-6">
        <h2 className="text-6xl font-bold uppercase tracking-tighter">What I Do</h2>
        <p className="text-right text-lg font-medium">Three disciplines.<br/>One developer.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((item, index) => (
          <div key={index} className="bg-white p-8 rounded-none border border-tertiary hover:border-black-100 transition-colors h-full flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-4 uppercase">{item.title}</h3>
              <p className="text-secondary mb-8 leading-relaxed">{item.desc}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {item.tools.map((tool) => (
                <span key={tool} className="px-3 py-1 bg-primary text-xs font-bold uppercase tracking-widest rounded-full">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;