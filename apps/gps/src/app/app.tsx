import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Home from '../pages/Home';
import About from '../pages/About';
import Academics from '../pages/Academics';
import Admissions from '../pages/Admissions';
import Contact from '../pages/Contact';
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
          </Routes>
        </main>
        <Footer />
      </div>
      <Toaster />
    </>
  );
}
