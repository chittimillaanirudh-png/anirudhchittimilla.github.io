import React from 'react';
import useScrollAnimations from '../hooks/useScrollAnimations';

const Projects = () => {
  useScrollAnimations();

  return (
    <main className="relative pt-32 pb-24 px-6 md:px-8 max-w-7xl mx-auto">
      <section className="relative mb-20">
        <div className="orbital-path w-[800px] h-[800px] -top-64 -left-32 hidden md:block"></div>
        <div className="max-w-3xl">
          <span className="label-md uppercase tracking-[0.2rem] text-secondary font-semibold mb-4 block">
            Portfolio
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-headline font-light tracking-tight mb-6 bg-gradient-to-r from-[#f3a77d] via-[#ff8a7a] to-[#c0ee91] bg-clip-text text-transparent leading-tight">
            My Projects
          </h1>
          <p className="text-xl text-on-surface-variant font-light leading-relaxed max-w-2xl">
            A showcase of my recent work and experiments. Exploring the boundaries between creative expression and technical precision.
          </p>
        </div>
      </section>

      <section className="relative min-h-[400px] md:min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none overflow-hidden">
          <div className="w-[600px] h-[600px] border border-outline-variant rounded-full animate-[pulse_8s_infinite]"></div>
          <div className="absolute w-[400px] h-[400px] border border-primary/30 rounded-full animate-[pulse_12s_infinite]"></div>
        </div>
        <div className="relative group z-10">
          <div className="w-full max-w-4xl p-10 md:p-16 lg:p-24 rounded-3xl md:rounded-full border border-dashed border-outline-variant/40 bg-surface-variant/10 backdrop-blur-xl flex flex-col items-center text-center transition-all duration-500 hover:border-primary/40 hover:bg-surface-variant/20">
            <div className="mb-8 relative">
              <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 group-hover:text-primary-dim/60 transition-colors duration-500">
                layers
              </span>
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            </div>
            <h2 className="text-3xl font-headline font-light text-on-surface mb-4">
              Under Development
            </h2>
            <p className="text-on-surface-variant max-w-md leading-relaxed">
              I am currently curating the most significant pieces of my work. The orbital laboratory is active, and new case studies will land here soon.
            </p>
            <div className="mt-12 flex flex-col md:flex-row items-center gap-6">
              <div className="flex items-center gap-3 px-4 py-2 bg-surface-container rounded-full border border-outline-variant/10">
                <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(192,238,145,0.8)]"></div>
                <span className="text-xs uppercase tracking-widest text-on-surface-variant">
                  Live Updates in Progress
                </span>
              </div>
              <button className="text-xs uppercase tracking-[0.15rem] font-bold text-primary hover:text-secondary transition-all duration-300 group/btn">
                Notify Me
                <div className="h-[1px] w-0 group-hover/btn:w-full bg-secondary transition-all duration-300 mx-auto mt-1"></div>
              </button>
            </div>
          </div>
          <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-tertiary-fixed-dim/10 backdrop-blur-md border border-white/5 hidden md:block"></div>
          <div className="absolute -bottom-6 -left-12 w-32 h-32 rounded-full bg-primary-fixed-dim/5 backdrop-blur-sm border border-white/5 hidden md:block"></div>
        </div>
      </section>

      <section className="mt-40 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-5 order-2 md:order-1 relative z-10">
          <span className="label-md uppercase tracking-[0.2rem] text-tertiary mb-4 block">
            Coming Soon
          </span>
          <h3 className="text-4xl font-headline font-light mb-6">The Aetheric Framework</h3>
          <p className="text-on-surface-variant leading-relaxed mb-8">
            An open-source exploration into cinematic UI motion libraries. Designed for high-fidelity storytelling and immersive web experiences.
          </p>
          <div className="w-12 h-[1px] bg-outline-variant"></div>
        </div>
        <div className="md:col-span-7 order-1 md:order-2 relative z-10">
          <div className="aspect-video bg-surface-container rounded-xl border border-outline-variant/20 overflow-hidden group">
            <img
              className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-700 scale-110 group-hover:scale-100"
              data-alt="Abstract digital render of flowing silk textures in deep coral and charcoal black tones with cinematic lighting and film grain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjQFY_E2rIoUchmXPkJedG6opl9nsisJB9BFVmLXzIYeYW_cInETuF_8TId9m3Oa82tezV32HnKfmwKmsX81TFuxydHOPGba7xio0XwUw-DgPqyM6SNM2-WnoTqY1Y19zt1rfJEdvHKjkCTCfXVnesE_6xLunLtuDyrQ5sud2TLfHT4t4SmeFC1qI25iQLPm_Emn7rgcugAx7r8zrXqsdyXCf8g4-Z9IN5cI5TJBk1TVAWBQHV6dxS8LEv6iwyQzpt43OL3knqQy6G"
              alt="Project Showcase"
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Projects;
