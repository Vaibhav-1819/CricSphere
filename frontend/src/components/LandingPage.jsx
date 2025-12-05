import React from 'react';
import IntroSection from './IntroSection';
import AboutSection from './AboutSection';
import FeaturesSection from './FeaturesSection';
import Footer from './Footer';

const LandingPage = () => {
  return (
    <>
      <IntroSection />
      <AboutSection />
      <FeaturesSection />
      {/* We are reusing the main app's footer */}
      <Footer />
    </>
  );
};

export default LandingPage;