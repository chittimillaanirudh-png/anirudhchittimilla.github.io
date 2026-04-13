import React, { useRef, useState, useEffect } from 'react';
import useScrollAnimations from '../hooks/useScrollAnimations';

const Contact = () => {
  useScrollAnimations();
  const formRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Load EmailJS script
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js';
    script.async = true;
    script.onload = () => {
      if (window.emailjs) {
        window.emailjs.init('KqrFRK0YlakuNxj9K');
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!window.emailjs) {
      alert('Email service is still loading, please try again in a moment.');
      return;
    }

    setIsSubmitting(true);
    window.emailjs
      .sendForm('service_bdu1n5v', 'template_7u102re', formRef.current)
      .then(
        () => {
          alert('✅ Message sent successfully! Thank you.');
          formRef.current.reset();
          setIsSubmitting(false);
        },
        () => {
          alert('❌ Failed to send. Please try again.');
          setIsSubmitting(false);
        }
      );
  };

  return (
    <main className="flex-grow pt-40 pb-20 px-8 relative z-10 max-w-[1440px] mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        <div className="lg:col-span-5 flex flex-col justify-center space-y-12">
          <header className="space-y-6">
            <span className="label-md uppercase tracking-[0.2em] text-secondary font-headline text-[10px]">
              Contact
            </span>
            <h1 className="text-5xl md:text-7xl font-headline font-light leading-tight text-transparent bg-clip-text bg-gradient-to-r from-[#f3a77d] via-[#ff8a7a] to-[#c0ee91] tracking-tight">
              Get In Touch
            </h1>
            <p className="text-lg md:text-xl text-on-surface-variant font-light leading-relaxed max-w-md">
              Have a project idea, collaboration opportunity, or just want to connect? Feel free to reach out — I’d love to hear from you.
            </p>
          </header>
          <div className="space-y-8">
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center border border-outline-variant/10 group-hover:border-primary/40 transition-colors duration-500">
                <span className="material-symbols-outlined text-primary text-xl" data-icon="mail">
                  mail
                </span>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-headline">
                  Email
                </p>
                <a className="text-on-surface hover:text-primary transition-colors" href="mailto:chittimillaanirudh@gmail.com">
                  chittimillaanirudh@gmail.com
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center border border-outline-variant/10 group-hover:border-secondary/40 transition-colors duration-500">
                <span className="material-symbols-outlined text-secondary text-xl" data-icon="share">
                  share
                </span>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-headline">
                  Social Profiles
                </p>
                <div className="flex gap-4 mt-1">
                  <a
                    className="text-sm text-on-surface hover:text-secondary transition-colors"
                    href="https://www.linkedin.com/in/anirudh-chittimilla-a74360341"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </a>
                  <span className="text-outline-variant">/</span>
                  <a
                    className="text-sm text-on-surface hover:text-secondary transition-colors"
                    href="https://www.instagram.com/ch_anirudh37_official"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Instagram
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-outline-variant/10">
            <p className="text-lg font-headline font-light italic text-on-surface-variant/60">
              "Let’s build something amazing together."
            </p>
          </div>
        </div>
        
        <div className="lg:col-span-7">
          <div className="bg-surface-variant/40 backdrop-blur-2xl rounded-3xl p-8 md:p-12 border border-outline-variant/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8">
              <span className="material-symbols-outlined text-outline-variant/20 text-6xl" data-icon="send">
                send
              </span>
            </div>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="label-md uppercase tracking-widest text-[10px] text-on-surface-variant ml-1" htmlFor="name">
                    Name
                  </label>
                  <input
                    className="w-full bg-surface-container-high/50 border border-outline-variant/20 rounded-xl px-6 py-4 text-on-surface placeholder:text-outline-variant/40 focus:outline-none focus:ring-0 focus:border-primary/50 transition-all duration-300"
                    id="name"
                    name="user_name"
                    placeholder="John Doe"
                    type="text"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="label-md uppercase tracking-widest text-[10px] text-on-surface-variant ml-1" htmlFor="email">
                    Email
                  </label>
                  <input
                    className="w-full bg-surface-container-high/50 border border-outline-variant/20 rounded-xl px-6 py-4 text-on-surface placeholder:text-outline-variant/40 focus:outline-none focus:ring-0 focus:border-primary/50 transition-all duration-300"
                    id="email"
                    name="user_email"
                    placeholder="john@example.com"
                    type="email"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="label-md uppercase tracking-widest text-[10px] text-on-surface-variant ml-1" htmlFor="message">
                  Message
                </label>
                <textarea
                  className="w-full bg-surface-container-high/50 border border-outline-variant/20 rounded-xl px-6 py-4 text-on-surface placeholder:text-outline-variant/40 focus:outline-none focus:ring-0 focus:border-primary/50 transition-all duration-300 resize-none"
                  id="message"
                  name="message"
                  placeholder="Tell me about your vision..."
                  rows="5"
                  required
                ></textarea>
              </div>
              <div className="pt-4">
                <button
                  className="group relative w-full md:w-auto overflow-hidden rounded-xl px-12 py-5 font-headline font-medium tracking-widest text-on-surface transition-all duration-500"
                  type="submit"
                  disabled={isSubmitting}
                >
                  <div className="absolute inset-0 bg-transparent border border-outline-variant/20 group-hover:border-primary group-hover:shadow-[0_0_25px_-5px_#ff8a7a] transition-all duration-500"></div>
                  <span className="relative flex items-center justify-center gap-3 text-xs uppercase">
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                    {!isSubmitting && (
                      <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform" data-icon="arrow_forward">
                        arrow_forward
                      </span>
                    )}
                  </span>
                </button>
              </div>
            </form>
          </div>
          
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="h-24 rounded-2xl bg-surface-container-low border border-outline-variant/10 overflow-hidden">
              <img
                className="w-full h-full object-cover grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
                data-alt="abstract cosmic satellite view of city lights at night from space with soft orange and blue glows"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC--R7O-2vLV7GMpr8vmkWeq9aHYEKwKLssMzvgjSmLfQETbuAQpiTwZSklAt83IXRYpSsLw1g_KG6bQmgUonevAa32JpReTg3e_RsmN0Q8h54W7LEfEGWwlCE9pDa2veoZkl8NAJCGfBn-jWT2AgBVcGSVd1Ar7YiFRahvudx9_q6cq6n1tJgtp9j-VaMVwj28n8hWhFrn34vD8S4ftoAKZOg0an2gk4MK3jvdlX7aH60ufXw40Imi4NSKKJ3uBcCGajjrMO9jVY3c"
                alt="Cosmic satellite view"
              />
            </div>
            <div className="col-span-2 h-24 rounded-2xl bg-surface-container-low border border-outline-variant/10 flex items-center px-8">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
                  Available for remote collaborations worldwide
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Contact;
