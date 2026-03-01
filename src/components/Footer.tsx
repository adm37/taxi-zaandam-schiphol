import React from 'react';
import { Plane, Phone, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { locationsData } from '../constants/locations';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 py-20">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-12">
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-emerald-600 p-2 rounded-lg">
              <Plane className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">ZaanTaxi <span className="text-emerald-600">Schiphol</span></span>
          </div>
          <p className="max-w-sm mb-8 leading-relaxed">
            Uw betrouwbare partner voor luchthavenvervoer in de Zaanstreek. Wij rijden 24/7 om u veilig en comfortabel naar Schiphol te brengen.
          </p>
          <div className="flex gap-4">
            <a href="tel:0752340037" className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-emerald-600 transition-colors">
              <Phone size={18} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Snelkoppelingen</h4>
          <ul className="space-y-4 text-sm">
            <li><Link to="/" className="hover:text-emerald-500 transition-colors">Home</Link></li>
            <li><Link to="/tarieven/" className="hover:text-emerald-500 transition-colors">Tarieven</Link></li>
            <li><Link to="/over-ons/" className="hover:text-emerald-500 transition-colors">Over Ons</Link></li>
            <li><Link to="/contact/" className="hover:text-emerald-500 transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Locaties</h4>
          <ul className="grid grid-cols-1 gap-4 text-sm">
            {Object.values(locationsData).map((loc) => (
              <li key={loc.slug}>
                <Link to={`/taxi-${loc.slug}-schiphol/`} className="hover:text-emerald-500 transition-colors">
                  Taxi {loc.name} Schiphol
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-20 pt-8 border-t border-stone-800 text-xs flex flex-col md:flex-row justify-between items-center gap-4">
        <p>&copy; {new Date().getFullYear()} ZaanTaxi Schiphol. Alle rechten voorbehouden.</p>
        <div className="flex gap-6">
          <li className="flex items-center gap-2">
            <Phone size={14} className="text-emerald-500" />
            075 - 234 00 37
          </li>
          <li className="flex items-center gap-2">
            <MapPin size={14} className="text-emerald-500" />
            Zaanstad, NL
          </li>
        </div>
      </div>
    </footer>
  );
}
