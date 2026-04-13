import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import ParticleBg from './components/ParticleBg';
import LoadingScreen from './components/LoadingScreen';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Skills from './pages/Skills';
import Projects from './pages/Projects';
import Contact from './pages/Contact';

function App() {
  const location = useLocation();
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    if (isFirstLoad) {
      setIsFirstLoad(false);
      return;
    }
    
    // Trigger blink on subsequent navigations
    const torch = document.getElementById('torch-transition');
    if (torch) {
      torch.classList.remove('active');
      void torch.offsetWidth; // Trigger reflow
      torch.classList.add('active');
      
      setTimeout(() => {
        torch.classList.remove('active');
      }, 1200);
    }
  }, [location.pathname]);

  return (
    <div className="app-container">
      <CustomCursor />
      <LoadingScreen />
      <ParticleBg />
      
      <div id="page-content">
        <Navbar />
        
        {/* Route definitions */}
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/index.html" element={<Home />} />
          <Route path="/about.html" element={<About />} />
          <Route path="/skills.html" element={<Skills />} />
          <Route path="/projects.html" element={<Projects />} />
          <Route path="/contact.html" element={<Contact />} />
        </Routes>
        
        <Footer />
      </div>

      {/* Shared transition elements */}
      <div id="torch-transition">
        <div className="blob left"></div>
        <div className="blob right"></div>
      </div>
    </div>
  );
}

export default App;
