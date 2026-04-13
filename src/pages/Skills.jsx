import React from 'react';
import useScrollAnimations from '../hooks/useScrollAnimations';

const Skills = () => {
  useScrollAnimations();

  return (
    <main className="relative pt-32 pb-24 px-6 md:px-12 max-w-[1440px] mx-auto min-h-screen">
      <div className="absolute -top-24 -left-24 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/2 -right-48 w-[600px] h-[600px] rounded-full bg-secondary/5 blur-[150px] pointer-events-none"></div>
      
      <section className="max-w-4xl mx-auto mb-20 text-center md:text-left relative z-10">
        <div className="inline-block px-3 py-1 mb-6 border border-outline-variant/20 rounded-full">
          <span className="label-md uppercase tracking-[0.2em] text-secondary text-[10px]">
            Expertise &amp; Technical Stack
          </span>
        </div>
        <h1 className="font-headline font-light text-5xl md:text-8xl leading-tight mb-8 hero-gradient">
          My Skills
        </h1>
        <p className="font-body text-lg md:text-xl text-on-surface-variant max-w-2xl leading-relaxed mb-4">
          I focus on building strong fundamentals in programming and continuously improving my problem-solving abilities through practice and real-world applications.
        </p>
        <p className="font-headline font-medium text-secondary text-sm tracking-widest uppercase">
          Always learning, always improving.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 max-w-6xl mx-auto relative z-10">
        {/* C Skill */}
        <div className="md:col-span-5 group relative p-8 rounded-xl bg-surface-container-low border border-outline-variant/10 hover:border-primary-dim/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(238,125,110,0.05)]">
          <div className="flex justify-between items-start mb-12">
            <div className="p-4 rounded-lg bg-surface-container-high">
              <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                terminal
              </span>
            </div>
            <span className="label-md text-primary-dim/60 font-mono tracking-tighter">01</span>
          </div>
          <h3 className="font-headline font-light text-3xl text-on-surface mb-4">C</h3>
          <p className="text-on-surface-variant font-light mb-8 leading-relaxed">
            Strong foundation in programming concepts, memory management, and procedural logic implementation.
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-xs uppercase tracking-widest text-primary-dim mb-1">
              <span>Proficiency</span>
              <span>85%</span>
            </div>
            <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full bg-primary-dim rounded-full transition-all duration-1000 ease-out" style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>

        {/* C++ Skill */}
        <div className="md:col-span-7 group relative p-8 rounded-xl bg-surface-container-low border border-outline-variant/10 hover:border-secondary/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(192,238,145,0.05)] overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 blur-3xl rounded-full"></div>
          <div className="flex justify-between items-start mb-12">
            <div className="p-4 rounded-lg bg-surface-container-high">
              <span className="material-symbols-outlined text-secondary text-3xl">developer_board</span>
            </div>
            <span className="label-md text-secondary/60 font-mono tracking-tighter">02</span>
          </div>
          <h3 className="font-headline font-light text-3xl text-on-surface mb-4">C++</h3>
          <p className="text-on-surface-variant font-light mb-8 leading-relaxed">
            Object-oriented programming, STL mastery, and high-performance problem solving for competitive coding.
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-xs uppercase tracking-widest text-secondary mb-1">
              <span>Proficiency</span>
              <span>90%</span>
            </div>
            <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full bg-secondary rounded-full transition-all duration-1000 ease-out" style={{ width: '90%' }}></div>
            </div>
          </div>
        </div>

        {/* Python Skill */}
        <div className="md:col-span-7 group relative p-8 rounded-xl bg-surface-container-low border border-outline-variant/10 hover:border-tertiary-fixed/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(243,167,125,0.05)]">
          <div className="flex justify-between items-start mb-12">
            <div className="p-4 rounded-lg bg-surface-container-high">
              <span className="material-symbols-outlined text-tertiary-fixed text-3xl">code_blocks</span>
            </div>
            <span className="label-md text-tertiary-fixed/60 font-mono tracking-tighter">03</span>
          </div>
          <h3 className="font-headline font-light text-3xl text-on-surface mb-4">Python</h3>
          <p className="text-on-surface-variant font-light mb-8 leading-relaxed">
            Scripting, logic building, and application development with a focus on clean, readable, and efficient code.
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-xs uppercase tracking-widest text-tertiary-fixed mb-1">
              <span>Proficiency</span>
              <span>80%</span>
            </div>
            <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full bg-tertiary-fixed rounded-full transition-all duration-1000 ease-out" style={{ width: '80%' }}></div>
            </div>
          </div>
        </div>

        {/* DSA Skill */}
        <div className="md:col-span-5 group relative p-8 rounded-xl bg-surface-container-low border border-outline-variant/10 hover:border-primary/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(255,142,127,0.05)] overflow-hidden">
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 blur-3xl rounded-full"></div>
          <div className="flex justify-between items-start mb-12">
            <div className="p-4 rounded-lg bg-surface-container-high">
              <span className="material-symbols-outlined text-primary text-3xl">account_tree</span>
            </div>
            <span className="label-md text-primary/60 font-mono tracking-tighter">04</span>
          </div>
          <h3 className="font-headline font-light text-3xl text-on-surface mb-4">DSA</h3>
          <p className="text-on-surface-variant font-light mb-8 leading-relaxed">
            Efficient problem-solving using advanced data structures and optimized algorithms for complex challenges.
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-xs uppercase tracking-widest text-primary mb-1">
              <span>Proficiency</span>
              <span>95%</span>
            </div>
            <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" style={{ width: '95%' }}></div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-32 max-w-6xl mx-auto relative z-10">
        <div className="relative w-full h-[400px] rounded-2xl overflow-hidden bg-surface-container-low border border-outline-variant/5">
          <img
            className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
            data-alt="Futuristic glowing neural network visualization with abstract floating nodes and lines in pastel neon colors against a dark background"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBU4EVBgo1w7Fe1MDOmiZa01aOht1Btmyf30iYQPaZUhFvXYZqL8Nvm_gyNeTnbFZP949JaHBcSGP5l0DtTIXpFLoMcVx-Gh_NnaQn20uukRQvN5BZZ3YckxvSFd0NFOKSccF5MBrRrAICIUAo7UmUBDJI1dbAVQAnHcMdmF-ey_sWU6_FCSs7Uipwdf3mj6OOtudBCL5WR_bTsoYIv8i0DBpAXI-IJSN7YZrtFMS5RPjh3Panl9fXwHvQKWWaCX1HXLUyJb3vUqKnC"
            alt="Architecture Visualization"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8">
            <span className="material-symbols-outlined text-secondary text-5xl mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>
              flare
            </span>
            <h2 className="font-headline text-3xl md:text-5xl font-extralight text-on-surface tracking-tighter max-w-2xl leading-tight">
              Architecture of the <span className="text-primary italic">Digital Frontier</span>
            </h2>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Skills;
