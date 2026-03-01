import React from 'react';
import { Link } from 'react-router-dom';
import { Plane } from 'lucide-react';

const AIRPORTS = [
  { name: 'Schiphol Airport', slug: '' },
  { name: 'Rotterdam Airport', slug: 'rotterdam-airport' },
  { name: 'Rotterdam The Hague Airport', slug: 'rotterdam-the-hague-airport' },
  { name: 'Eindhoven Airport', slug: 'eindhoven-airport' },
  { name: 'Brussel Airport', slug: 'brussel-airport' },
  { name: 'Brussels Airport', slug: 'brussels-airport' },
  { name: 'Zaventem Airport', slug: 'zaventem-airport' },
  { name: 'Düsseldorf Airport', slug: 'dusseldorf-airport' }
];

export default function OtherAirportsLinks({ locationName, locationSlug, currentAirportSlug }: { locationName: string, locationSlug: string, currentAirportSlug?: string }) {
  return (
    <section className="py-16 bg-stone-50 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8 text-stone-900 text-center">
          Taxi {locationName} naar andere luchthavens
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {AIRPORTS.filter(a => a.slug !== currentAirportSlug).map((airport) => (
            <Link 
              key={airport.slug || 'schiphol'}
              to={airport.slug ? `/taxi-${locationSlug}-${airport.slug}/` : `/taxi-${locationSlug}-schiphol/`}
              className="flex items-center gap-3 bg-white p-4 rounded-xl border border-stone-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group"
            >
              <div className="bg-emerald-50 p-2 rounded-lg group-hover:bg-emerald-100 transition-colors">
                <Plane size={18} className="text-emerald-600" />
              </div>
              <span className="text-sm font-medium text-stone-700 group-hover:text-emerald-700 transition-colors">
                Taxi {locationName} {airport.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
