/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Phone } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SchipholFaq from './components/SchipholFaq';

const Home = lazy(() => import('./pages/Home'));
const Tarieven = lazy(() => import('./pages/Tarieven'));
const OverOns = lazy(() => import('./pages/OverOns'));
const Contact = lazy(() => import('./pages/Contact'));
const Admin = lazy(() => import('./pages/Admin'));
const Assendelft = lazy(() => import('./Assendelft'));
const KoogAanDeZaan = lazy(() => import('./KoogAanDeZaan'));
const Krommenie = lazy(() => import('./Krommenie'));
const Westzaan = lazy(() => import('./Westzaan'));
const Wormer = lazy(() => import('./Wormer'));
const Wormerveer = lazy(() => import('./Wormerveer'));
const Zaandam = lazy(() => import('./Zaandam'));
const Zaandijk = lazy(() => import('./Zaandijk'));
const AssendelftRotterdamAirport = lazy(() => import('./pages/airports/AssendelftRotterdamAirport'));
const AssendelftRotterdamTheHagueAirport = lazy(() => import('./pages/airports/AssendelftRotterdamTheHagueAirport'));
const AssendelftEindhovenAirport = lazy(() => import('./pages/airports/AssendelftEindhovenAirport'));
const AssendelftBrusselAirport = lazy(() => import('./pages/airports/AssendelftBrusselAirport'));
const AssendelftBrusselsAirport = lazy(() => import('./pages/airports/AssendelftBrusselsAirport'));
const AssendelftZaventemAirport = lazy(() => import('./pages/airports/AssendelftZaventemAirport'));
const AssendelftDusseldorfAirport = lazy(() => import('./pages/airports/AssendelftDusseldorfAirport'));
const KoogAanDeZaanRotterdamAirport = lazy(() => import('./pages/airports/KoogAanDeZaanRotterdamAirport'));
const KoogAanDeZaanRotterdamTheHagueAirport = lazy(() => import('./pages/airports/KoogAanDeZaanRotterdamTheHagueAirport'));
const KoogAanDeZaanEindhovenAirport = lazy(() => import('./pages/airports/KoogAanDeZaanEindhovenAirport'));
const KoogAanDeZaanBrusselAirport = lazy(() => import('./pages/airports/KoogAanDeZaanBrusselAirport'));
const KoogAanDeZaanBrusselsAirport = lazy(() => import('./pages/airports/KoogAanDeZaanBrusselsAirport'));
const KoogAanDeZaanZaventemAirport = lazy(() => import('./pages/airports/KoogAanDeZaanZaventemAirport'));
const KoogAanDeZaanDusseldorfAirport = lazy(() => import('./pages/airports/KoogAanDeZaanDusseldorfAirport'));
const KrommenieRotterdamAirport = lazy(() => import('./pages/airports/KrommenieRotterdamAirport'));
const KrommenieRotterdamTheHagueAirport = lazy(() => import('./pages/airports/KrommenieRotterdamTheHagueAirport'));
const KrommenieEindhovenAirport = lazy(() => import('./pages/airports/KrommenieEindhovenAirport'));
const KrommenieBrusselAirport = lazy(() => import('./pages/airports/KrommenieBrusselAirport'));
const KrommenieBrusselsAirport = lazy(() => import('./pages/airports/KrommenieBrusselsAirport'));
const KrommenieZaventemAirport = lazy(() => import('./pages/airports/KrommenieZaventemAirport'));
const KrommenieDusseldorfAirport = lazy(() => import('./pages/airports/KrommenieDusseldorfAirport'));
const WestzaanRotterdamAirport = lazy(() => import('./pages/airports/WestzaanRotterdamAirport'));
const WestzaanRotterdamTheHagueAirport = lazy(() => import('./pages/airports/WestzaanRotterdamTheHagueAirport'));
const WestzaanEindhovenAirport = lazy(() => import('./pages/airports/WestzaanEindhovenAirport'));
const WestzaanBrusselAirport = lazy(() => import('./pages/airports/WestzaanBrusselAirport'));
const WestzaanBrusselsAirport = lazy(() => import('./pages/airports/WestzaanBrusselsAirport'));
const WestzaanZaventemAirport = lazy(() => import('./pages/airports/WestzaanZaventemAirport'));
const WestzaanDusseldorfAirport = lazy(() => import('./pages/airports/WestzaanDusseldorfAirport'));
const WormerRotterdamAirport = lazy(() => import('./pages/airports/WormerRotterdamAirport'));
const WormerRotterdamTheHagueAirport = lazy(() => import('./pages/airports/WormerRotterdamTheHagueAirport'));
const WormerEindhovenAirport = lazy(() => import('./pages/airports/WormerEindhovenAirport'));
const WormerBrusselAirport = lazy(() => import('./pages/airports/WormerBrusselAirport'));
const WormerBrusselsAirport = lazy(() => import('./pages/airports/WormerBrusselsAirport'));
const WormerZaventemAirport = lazy(() => import('./pages/airports/WormerZaventemAirport'));
const WormerDusseldorfAirport = lazy(() => import('./pages/airports/WormerDusseldorfAirport'));
const WormerveerRotterdamAirport = lazy(() => import('./pages/airports/WormerveerRotterdamAirport'));
const WormerveerRotterdamTheHagueAirport = lazy(() => import('./pages/airports/WormerveerRotterdamTheHagueAirport'));
const WormerveerEindhovenAirport = lazy(() => import('./pages/airports/WormerveerEindhovenAirport'));
const WormerveerBrusselAirport = lazy(() => import('./pages/airports/WormerveerBrusselAirport'));
const WormerveerBrusselsAirport = lazy(() => import('./pages/airports/WormerveerBrusselsAirport'));
const WormerveerZaventemAirport = lazy(() => import('./pages/airports/WormerveerZaventemAirport'));
const WormerveerDusseldorfAirport = lazy(() => import('./pages/airports/WormerveerDusseldorfAirport'));
const ZaandamRotterdamAirport = lazy(() => import('./pages/airports/ZaandamRotterdamAirport'));
const ZaandamRotterdamTheHagueAirport = lazy(() => import('./pages/airports/ZaandamRotterdamTheHagueAirport'));
const ZaandamEindhovenAirport = lazy(() => import('./pages/airports/ZaandamEindhovenAirport'));
const ZaandamBrusselAirport = lazy(() => import('./pages/airports/ZaandamBrusselAirport'));
const ZaandamBrusselsAirport = lazy(() => import('./pages/airports/ZaandamBrusselsAirport'));
const ZaandamZaventemAirport = lazy(() => import('./pages/airports/ZaandamZaventemAirport'));
const ZaandamDusseldorfAirport = lazy(() => import('./pages/airports/ZaandamDusseldorfAirport'));
const ZaandijkRotterdamAirport = lazy(() => import('./pages/airports/ZaandijkRotterdamAirport'));
const ZaandijkRotterdamTheHagueAirport = lazy(() => import('./pages/airports/ZaandijkRotterdamTheHagueAirport'));
const ZaandijkEindhovenAirport = lazy(() => import('./pages/airports/ZaandijkEindhovenAirport'));
const ZaandijkBrusselAirport = lazy(() => import('./pages/airports/ZaandijkBrusselAirport'));
const ZaandijkBrusselsAirport = lazy(() => import('./pages/airports/ZaandijkBrusselsAirport'));
const ZaandijkZaventemAirport = lazy(() => import('./pages/airports/ZaandijkZaventemAirport'));
const ZaandijkDusseldorfAirport = lazy(() => import('./pages/airports/ZaandijkDusseldorfAirport'));

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        <Suspense fallback={<div className="min-h-[40vh]" />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/tarieven" element={<Tarieven />} />
            <Route path="/over-ons" element={<OverOns />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/" element={<Admin />} />
            <Route path="/taxi-assendelft-schiphol" element={<Assendelft />} />
            <Route path="/taxi-koog-aan-de-zaan-schiphol" element={<KoogAanDeZaan />} />
            <Route path="/taxi-krommenie-schiphol" element={<Krommenie />} />
            <Route path="/taxi-westzaan-schiphol" element={<Westzaan />} />
            <Route path="/taxi-wormer-schiphol" element={<Wormer />} />
            <Route path="/taxi-wormerveer-schiphol" element={<Wormerveer />} />
            <Route path="/taxi-zaandam-schiphol" element={<Zaandam />} />
            <Route path="/taxi-zaandijk-schiphol" element={<Zaandijk />} />
            <Route path="/taxi-assendelft-rotterdam-airport" element={<AssendelftRotterdamAirport />} />
            <Route path="/taxi-assendelft-rotterdam-the-hague-airport" element={<AssendelftRotterdamTheHagueAirport />} />
            <Route path="/taxi-assendelft-eindhoven-airport" element={<AssendelftEindhovenAirport />} />
            <Route path="/taxi-assendelft-brussel-airport" element={<AssendelftBrusselAirport />} />
            <Route path="/taxi-assendelft-brussels-airport" element={<AssendelftBrusselsAirport />} />
            <Route path="/taxi-assendelft-zaventem-airport" element={<AssendelftZaventemAirport />} />
            <Route path="/taxi-assendelft-dusseldorf-airport" element={<AssendelftDusseldorfAirport />} />
            <Route path="/taxi-koog-aan-de-zaan-rotterdam-airport" element={<KoogAanDeZaanRotterdamAirport />} />
            <Route path="/taxi-koog-aan-de-zaan-rotterdam-the-hague-airport" element={<KoogAanDeZaanRotterdamTheHagueAirport />} />
            <Route path="/taxi-koog-aan-de-zaan-eindhoven-airport" element={<KoogAanDeZaanEindhovenAirport />} />
            <Route path="/taxi-koog-aan-de-zaan-brussel-airport" element={<KoogAanDeZaanBrusselAirport />} />
            <Route path="/taxi-koog-aan-de-zaan-brussels-airport" element={<KoogAanDeZaanBrusselsAirport />} />
            <Route path="/taxi-koog-aan-de-zaan-zaventem-airport" element={<KoogAanDeZaanZaventemAirport />} />
            <Route path="/taxi-koog-aan-de-zaan-dusseldorf-airport" element={<KoogAanDeZaanDusseldorfAirport />} />
            <Route path="/taxi-krommenie-rotterdam-airport" element={<KrommenieRotterdamAirport />} />
            <Route path="/taxi-krommenie-rotterdam-the-hague-airport" element={<KrommenieRotterdamTheHagueAirport />} />
            <Route path="/taxi-krommenie-eindhoven-airport" element={<KrommenieEindhovenAirport />} />
            <Route path="/taxi-krommenie-brussel-airport" element={<KrommenieBrusselAirport />} />
            <Route path="/taxi-krommenie-brussels-airport" element={<KrommenieBrusselsAirport />} />
            <Route path="/taxi-krommenie-zaventem-airport" element={<KrommenieZaventemAirport />} />
            <Route path="/taxi-krommenie-dusseldorf-airport" element={<KrommenieDusseldorfAirport />} />
            <Route path="/taxi-westzaan-rotterdam-airport" element={<WestzaanRotterdamAirport />} />
            <Route path="/taxi-westzaan-rotterdam-the-hague-airport" element={<WestzaanRotterdamTheHagueAirport />} />
            <Route path="/taxi-westzaan-eindhoven-airport" element={<WestzaanEindhovenAirport />} />
            <Route path="/taxi-westzaan-brussel-airport" element={<WestzaanBrusselAirport />} />
            <Route path="/taxi-westzaan-brussels-airport" element={<WestzaanBrusselsAirport />} />
            <Route path="/taxi-westzaan-zaventem-airport" element={<WestzaanZaventemAirport />} />
            <Route path="/taxi-westzaan-dusseldorf-airport" element={<WestzaanDusseldorfAirport />} />
            <Route path="/taxi-wormer-rotterdam-airport" element={<WormerRotterdamAirport />} />
            <Route path="/taxi-wormer-rotterdam-the-hague-airport" element={<WormerRotterdamTheHagueAirport />} />
            <Route path="/taxi-wormer-eindhoven-airport" element={<WormerEindhovenAirport />} />
            <Route path="/taxi-wormer-brussel-airport" element={<WormerBrusselAirport />} />
            <Route path="/taxi-wormer-brussels-airport" element={<WormerBrusselsAirport />} />
            <Route path="/taxi-wormer-zaventem-airport" element={<WormerZaventemAirport />} />
            <Route path="/taxi-wormer-dusseldorf-airport" element={<WormerDusseldorfAirport />} />
            <Route path="/taxi-wormerveer-rotterdam-airport" element={<WormerveerRotterdamAirport />} />
            <Route path="/taxi-wormerveer-rotterdam-the-hague-airport" element={<WormerveerRotterdamTheHagueAirport />} />
            <Route path="/taxi-wormerveer-eindhoven-airport" element={<WormerveerEindhovenAirport />} />
            <Route path="/taxi-wormerveer-brussel-airport" element={<WormerveerBrusselAirport />} />
            <Route path="/taxi-wormerveer-brussels-airport" element={<WormerveerBrusselsAirport />} />
            <Route path="/taxi-wormerveer-zaventem-airport" element={<WormerveerZaventemAirport />} />
            <Route path="/taxi-wormerveer-dusseldorf-airport" element={<WormerveerDusseldorfAirport />} />
            <Route path="/taxi-zaandam-rotterdam-airport" element={<ZaandamRotterdamAirport />} />
            <Route path="/taxi-zaandam-rotterdam-the-hague-airport" element={<ZaandamRotterdamTheHagueAirport />} />
            <Route path="/taxi-zaandam-eindhoven-airport" element={<ZaandamEindhovenAirport />} />
            <Route path="/taxi-zaandam-brussel-airport" element={<ZaandamBrusselAirport />} />
            <Route path="/taxi-zaandam-brussels-airport" element={<ZaandamBrusselsAirport />} />
            <Route path="/taxi-zaandam-zaventem-airport" element={<ZaandamZaventemAirport />} />
            <Route path="/taxi-zaandam-dusseldorf-airport" element={<ZaandamDusseldorfAirport />} />
            <Route path="/taxi-zaandijk-rotterdam-airport" element={<ZaandijkRotterdamAirport />} />
            <Route path="/taxi-zaandijk-rotterdam-the-hague-airport" element={<ZaandijkRotterdamTheHagueAirport />} />
            <Route path="/taxi-zaandijk-eindhoven-airport" element={<ZaandijkEindhovenAirport />} />
            <Route path="/taxi-zaandijk-brussel-airport" element={<ZaandijkBrusselAirport />} />
            <Route path="/taxi-zaandijk-brussels-airport" element={<ZaandijkBrusselsAirport />} />
            <Route path="/taxi-zaandijk-zaventem-airport" element={<ZaandijkZaventemAirport />} />
            <Route path="/taxi-zaandijk-dusseldorf-airport" element={<ZaandijkDusseldorfAirport />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

function AppShell() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isFaqExcludedRoute = ['/', '/contact', '/contact/', '/over-ons', '/over-ons/', '/tarieven', '/tarieven/'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 flex flex-col">
      {!isAdminRoute && <Navbar />}
      <main className="flex-grow">
        <AnimatedRoutes />
      </main>
      {!isAdminRoute && !isFaqExcludedRoute && <SchipholFaq pathname={location.pathname} />}
      {!isAdminRoute && <Footer />}

      {!isAdminRoute && (
        <div className="fixed bottom-6 right-6 md:hidden z-50">
          <a
            href="tel:0752340037"
            className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-emerald-900/40 animate-bounce"
          >
            <Phone size={28} />
          </a>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}
