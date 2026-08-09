import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import PageTransition from './PageTransition';
import useScrollToTop from '../../hooks/useScrollToTop';

export default function Layout() {
  const location = useLocation();
  useScrollToTop();

  return (
    <div className="app-shell">
      <Navbar />
      <main>
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
