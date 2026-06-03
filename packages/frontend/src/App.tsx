import { About } from './components/About';
import { Benefits } from './components/Benefits';
import { CheckoutModal } from './components/CheckoutModal';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Gallery } from './components/Gallery';
import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';
import { OrderSection } from './components/OrderSection';
import { Pricing } from './components/Pricing';
import { Reviews } from './components/Reviews';
import { CheckoutProvider } from './context/CheckoutContext';

export default function App() {
  return (
    <CheckoutProvider>
      <Navbar />
      <Hero />
      <About />
      <Gallery />
      <Reviews />
      <Pricing />
      <OrderSection />
      <Benefits />
      <Contact />
      <Footer />
      <CheckoutModal />
    </CheckoutProvider>
  );
}
