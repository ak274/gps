import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Home from '../pages/Home';
import About from '../pages/About';
import Academics from '../pages/Academics';
import Admissions from '../pages/Admissions';
import Contact from '../pages/Contact';
import Privacy from '../pages/Privacy';
import Terms from '../pages/Terms';
import Sitemap from '../pages/Sitemap';
import MandatoryPublicDisclosure from '../pages/MandatoryPublicDisclosure';
import { useSmoothScroll } from '../hooks/useSmoothScroll';

export default function App() {
  useSmoothScroll();

  return (
    <>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Navigation />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/academics" element={<Academics />} />
            <Route path="/admissions" element={<Admissions />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/sitemap" element={<Sitemap />} />
            <Route
              path="/mandatory-public-disclosure"
              element={<MandatoryPublicDisclosure />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
      <Toaster />
    </>
  );
}
