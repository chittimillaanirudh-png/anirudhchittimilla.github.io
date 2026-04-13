import React from 'react';
import { NavLink } from 'react-router-dom';
import useScrollAnimations from '../hooks/useScrollAnimations';

const Home = () => {
  useScrollAnimations();

  return (
    <>
      <main className="relative min-h-screen flex items-center pt-24 px-8 md:px-16 lg:px-24 max-w-[1440px] mx-auto z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
          <div className="lg:col-span-6 order-1 lg:order-1 space-y-2 text-center lg:text-left w-full">
            <span className="label-md uppercase tracking-[0.2em] text-secondary font-headline text-[10px] md:text-xs">
              Building Digital Experiences
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-7xl lg:text-8xl font-headline font-light tracking-tight signature-gradient break-words leading-tight">
              ANIRUDH <br className="block md:hidden" /> CHITTIMILLA
            </h1>
          </div>
          <div className="lg:col-span-6 lg:row-span-2 home-right lg:justify-end lg:-mt-24 order-2 lg:order-2 w-full">
            <div className="home-image-wrap mx-auto">
              <div className="home-image-bg"></div>
              <img
                alt="Professional portrait of Anirudh Chittimilla"
                src="https://ik.imagekit.io/y3evpdae0/freepik_br_ee1db127-e0c6-4d46-afd5-449ad2120392.png"
              />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 border-l border-b border-primary/20 rounded-bl-3xl z-10"></div>
              <div className="absolute -top-8 -right-8 w-32 h-32 border-r border-t border-secondary/20 rounded-tr-3xl z-10"></div>
            </div>
          </div>
          <div className="lg:col-span-6 order-3 lg:order-3 space-y-8 text-center lg:text-left w-full">
            <div className="space-y-4 max-w-2xl mx-auto lg:mx-0">
              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <span className="w-8 h-[1px] bg-outline-variant/40"></span>
                <p className="text-sm md:text-base font-medium text-on-surface-variant font-body">
                  B.Tech Student | Developer | Problem Solver
                </p>
              </div>
              <p className="text-lg md:text-xl text-on-surface/80 font-light leading-relaxed">
                Passionate developer focused on building modern, efficient, and scalable digital solutions. I enjoy
                transforming ideas into real-world applications through clean code, creative design, and continuous
                learning.
              </p>
              <div className="flex items-center gap-2 text-primary font-headline font-light italic text-sm tracking-wide justify-center lg:justify-start">
                <span className="material-symbols-outlined text-xs">keyboard_arrow_right</span>
                <span>Explore My Portfolio</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-6 pt-4 justify-center lg:justify-start">
              <NavLink
                to="/projects.html"
                className="px-8 py-4 bg-transparent rounded-full border border-outline-variant/30 text-on-surface font-headline uppercase text-xs tracking-widest hover:border-primary hover:text-primary hover:shadow-[0_0_15px_-2px_#ff8e7f] transition-all duration-300 scale-95 active:scale-90 inline-block"
              >
                View Projects
              </NavLink>
              <NavLink
                to="/contact.html"
                className="px-8 py-4 bg-transparent rounded-full border border-outline-variant/30 text-on-surface font-headline uppercase text-xs tracking-widest hover:border-secondary hover:text-secondary hover:shadow-[0_0_15px_-2px_#c0ee91] transition-all duration-300 scale-95 active:scale-90 inline-block"
              >
                Contact Me
              </NavLink>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed left-8 bottom-0 hidden xl:flex flex-col items-center gap-6 pb-12 z-50">
        <a
          className="group flex flex-col items-center gap-1 text-[#acabaa] hover:text-primary transition-all duration-300"
          href="https://github.com/chittimillaanirudh-png"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="text-[9px] font-headline uppercase tracking-[0.2em] [writing-mode:vertical-lr] rotate-180 mb-4 opacity-50">
            GitHub
          </span>
          <span className="material-symbols-outlined text-lg">code</span>
        </a>
        <a
          className="group flex flex-col items-center gap-1 text-[#acabaa] hover:text-secondary transition-all duration-300"
          href="https://www.linkedin.com/in/anirudh-chittimilla-a74360341"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="text-[9px] font-headline uppercase tracking-[0.2em] [writing-mode:vertical-lr] rotate-180 mb-4 opacity-50">
            LinkedIn
          </span>
          <span className="material-symbols-outlined text-lg">link</span>
        </a>
        <a
          className="group flex flex-col items-center gap-1 text-[#acabaa] hover:text-tertiary transition-all duration-300"
          href="https://www.instagram.com/ch_anirudh37_official"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="text-[9px] font-headline uppercase tracking-[0.2em] [writing-mode:vertical-lr] rotate-180 mb-4 opacity-50">
            Instagram
          </span>
          <span className="material-symbols-outlined text-lg">photo_camera</span>
        </a>
        <div className="w-[1px] h-24 bg-outline-variant/30 mt-4"></div>
      </div>
    </>
  );
};

export default Home;
