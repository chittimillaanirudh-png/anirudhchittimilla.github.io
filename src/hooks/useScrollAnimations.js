import { useEffect } from 'react';

const useScrollAnimations = () => {
  useEffect(() => {
    const isTouchDevice =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches;

    // Floating elements
    const handleFloating = (e) => {
      const xPercent = e.clientX / window.innerWidth - 0.5;
      const yPercent = e.clientY / window.innerHeight - 0.5;
      document.querySelectorAll('.float-element').forEach((el) => {
        const depth = parseFloat(el.getAttribute('data-depth')) || 20;
        el.style.transform = `translate(${xPercent * depth}px, ${yPercent * depth}px)`;
      });
    };
    document.addEventListener('mousemove', handleFloating);

    // Intersection Observer
    const animElements = document.querySelectorAll('[data-animation]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.animation =
              entry.target.dataset.animation || 'slide-in-left 0.8s ease-out forwards';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    animElements.forEach((el) => observer.observe(el));

    // Parallax scroll
    const handleParallax = () => {
      document.querySelectorAll('[data-parallax]').forEach((el) => {
        const yPos = window.pageYOffset * (parseFloat(el.dataset.parallax) || 0.5);
        el.style.transform = `translateY(${yPos}px)`;
      });
    };
    window.addEventListener('scroll', handleParallax);

    // Hover tilt
    const hoverTiltCards = document.querySelectorAll('.card, .project-item, .skill-card');
    const tiltHandlers = [];

    if (!isTouchDevice) {
      hoverTiltCards.forEach((card) => {
        card.style.willChange = 'transform, box-shadow';
        card.style.transition = 'box-shadow 0.4s ease-out';

        const enterHandler = () => {
          card.style.transition = 'transform 0.1s ease-out, box-shadow 0.4s ease-out';
          card.style.boxShadow = '0 10px 30px rgba(255, 142, 127, 0.15), 0 0 15px rgba(255, 142, 127, 0.05)';
        };
        const moveHandler = (e) => {
          const rect = card.getBoundingClientRect();
          const rotateX = (e.clientY - rect.top - rect.height / 2) / -10;
          const rotateY = (rect.width / 2 - (e.clientX - rect.left)) / -10;
          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px) scale(1.03)`;
        };
        const leaveHandler = () => {
          card.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.5s ease-out';
          card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0) scale(1)';
          card.style.boxShadow = 'none';
        };

        card.addEventListener('mouseenter', enterHandler);
        card.addEventListener('mousemove', moveHandler);
        card.addEventListener('mouseleave', leaveHandler);
        
        tiltHandlers.push({ card, enterHandler, moveHandler, leaveHandler });
      });
    }

    // Viewport zoom reveal
    const zoomElements = document.querySelectorAll('.card, .project-item, .skill-card');
    const zoomObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'scale(1)';
            setTimeout(() => {
              entry.target.style.transition = 'box-shadow 0.4s ease-out';
              entry.target.style.willChange = 'auto';
            }, 600);
            zoomObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    
    zoomElements.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'scale(0.95)';
      el.style.transition = 'opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      el.style.willChange = 'opacity, transform';
      zoomObserver.observe(el);
    });

    return () => {
      document.removeEventListener('mousemove', handleFloating);
      animElements.forEach((el) => observer.unobserve(el));
      window.removeEventListener('scroll', handleParallax);
      
      tiltHandlers.forEach(({ card, enterHandler, moveHandler, leaveHandler }) => {
        card.removeEventListener('mouseenter', enterHandler);
        card.removeEventListener('mousemove', moveHandler);
        card.removeEventListener('mouseleave', leaveHandler);
      });
      
      zoomElements.forEach((el) => zoomObserver.unobserve(el));
    };
  }, []);
};

export default useScrollAnimations;
