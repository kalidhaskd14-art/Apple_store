import React, { useEffect, useState } from 'react';
import { useStore } from './store';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeViews from './components/HomeViews';
import CollectionPage from './components/CollectionPage';
import ProductDetails from './components/ProductDetails';
import AuthForm from './components/AuthForm';
import AdminPanel from './components/AdminPanel';
import DashboardView from './components/DashboardView';
import CompareProducts from './components/CompareProducts';
import { CartView, WishlistView, CheckoutView, InfoPagesView } from './components/TransactionalViews';
import { motion, AnimatePresence } from 'motion/react';
import CinematicIntro from './components/CinematicIntro';

export default function App() {
  const { currentView, currentViewParams, setView, user, fetchMyOrders, syncAuth, isDarkMode, isAuthenticated } = useStore();
  const [scrollProgress, setScrollProgress] = useState(0);

  // Cinematic Intro active state tracking once per tab session
  const [introActive, setIntroActive] = useState(() => {
    if (typeof window !== 'undefined') {
      return !sessionStorage.getItem('istore-intro-played');
    }
    return true;
  });

  // Handle body overflow during cinematic intro
  useEffect(() => {
    if (introActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [introActive]);

  // Scroll Progress Tracker for premium look
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      } else {
        setScrollProgress(0);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView, currentViewParams]);

  // Try to restore user session on mount & Synchronize Browser Pathname Routing
  useEffect(() => {
    syncAuth();

    const handleLocationChange = () => {
      const path = window.location.pathname;
      if (path === '/signup') {
        setView('signup');
      } else if (path === '/signin') {
        setView('login');
      } else if (path === '/' || path === '') {
        const current = useStore.getState().currentView;
        if (current === 'login' || current === 'signup') {
          setView('home');
        }
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, [setView, syncAuth]);

  // Synchronize Dark Mode Class on Root
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Scroll to top on route change to respect Apple's clean UX
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentView, currentViewParams]);

  const renderActiveView = () => {
    switch (currentView) {
      case 'home':
        return <HomeViews setView={setView} />;
      
      case 'collection':
        return <CollectionPage setView={setView} />;
      
      case 'details':
        return <ProductDetails productId={currentViewParams?.id || 'iphone-16-pro-max'} setView={setView} />;
      
      case 'cart':
        return <CartView setView={setView} />;
      
      case 'wishlist':
        return <WishlistView setView={setView} />;
      
      case 'checkout':
        return <CheckoutView setView={setView} />;
      
      case 'login':
        return (
          <div className="max-w-md mx-auto py-16 px-4">
            <AuthForm mode="login" setView={setView} />
          </div>
        );

      case 'signup':
        return (
          <div className="max-w-md mx-auto py-16 px-4">
            <AuthForm mode="signup" setView={setView} />
          </div>
        );
      
      case 'account':
        return <DashboardView setView={setView} />;
      
      case 'admin':
        // Guard check
        if (!user || user.role !== 'admin') {
          return (
            <div className="max-w-md mx-auto my-16 text-center px-4 animate-fade-in text-apple-dark">
              <h2 className="text-xl font-bold">Access Denied</h2>
              <p className="text-xs text-apple-gray mt-1">This console panel is guarded by secure administrator privileges.</p>
              <button onClick={() => setView('login')} className="apple-btn-primary mt-6 text-xs">Sign In as Admin</button>
            </div>
          );
        }
        return <AdminPanel />;
      
      case 'about':
        return <InfoPagesView section="about" setView={setView} />;
      
      case 'compare':
        return <CompareProducts setView={setView} />;
      
      case 'contact':
        return <InfoPagesView section="contact" setView={setView} />;
      
      case 'privacy':
        return <InfoPagesView section="privacy" setView={setView} />;
      
      case 'terms':
        return <InfoPagesView section="terms" setView={setView} />;
      
      default:
        return <HomeViews setView={setView} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-[#8B5CF6] selection:text-white antialiased overflow-x-hidden relative bg-[#F7F3FF] text-[#1D1D1F]">
      
      {/* Cinematic Event Intro Overlay */}
      <AnimatePresence>
        {introActive && (
          <CinematicIntro 
            onComplete={() => {
              sessionStorage.setItem('istore-intro-played', 'true');
              setIntroActive(false);
            }} 
          />
        )}
      </AnimatePresence>

      {/* Cinematic Scroll Progress Indicator Bar */}
      <div 
        className="fixed top-0 left-0 h-[2px] bg-[#8B5CF6] z-55 transition-all duration-75 pointer-events-none animate-pulse shadow-[0_0_8px_#8B5CF6]"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Fixed Apple-style Header */}
      <Header currentView={currentView} setView={setView} />

      {/* Main Core Viewport wrapped in layout animation transitions - padded for fixed top navigation */}
      <main className="flex-1 pt-20 pb-16 z-10 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentView}-${currentViewParams?.id || ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Corporate Legal Footer with disclaimer checks */}
      <Footer setView={setView} />

    </div>
  );
}
