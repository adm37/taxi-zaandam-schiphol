import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Star, CreditCard } from 'lucide-react';
import { applySeoForPath } from '../lib/applySeoForPath';

export default function Tarieven() {
  useEffect(() => {
    applySeoForPath('/tarieven');
  }, []);

  return (
    <div className="pt-16">
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Onze Tarieven</h2>
            <p className="text-stone-600 max-w-2xl mx-auto text-lg">
              Eerlijke en transparante prijzen. Geen verrassingen, geen verborgen kosten. 
              Vanuit heel Zaanstad hanteren wij een vast tarief naar Schiphol.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
            {/* Standard Sedan */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-stone-50 rounded-3xl p-8 border border-stone-100 flex flex-col"
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">Standaard Sedan</h3>
                <p className="text-stone-500 text-sm">Ideaal voor 1-4 personen</p>
              </div>
              <div className="mb-8">
                <span className="text-4xl font-black text-emerald-600">€50</span>
                <span className="text-stone-400 ml-2">vast tarief</span>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center gap-3 text-sm text-stone-600">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                  Max. 4 passagiers
                </li>
                <li className="flex items-center gap-3 text-sm text-stone-600">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                  3 koffers + handbagage
                </li>
                <li className="flex items-center gap-3 text-sm text-stone-600">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                  Nette, moderne auto
                </li>
              </ul>
            </motion.div>

            {/* Minibus */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-stone-50 rounded-3xl p-8 border border-stone-100 flex flex-col"
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">Taxibus</h3>
                <p className="text-stone-500 text-sm">Voor groepen tot 7 personen</p>
              </div>
              <div className="mb-8">
                <span className="text-4xl font-black text-emerald-600">€75</span>
                <span className="text-stone-400 ml-2">vast tarief</span>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center gap-3 text-sm text-stone-600">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                  5-7 passagiers
                </li>
                <li className="flex items-center gap-3 text-sm text-stone-600">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                  Max. 8 koffers
                </li>
                <li className="flex items-center gap-3 text-sm text-stone-600">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                  Ideaal voor families
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Additional Info Table */}
          <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 bg-stone-50 border-b border-stone-200">
              <h4 className="font-bold text-lg">Andere Bestemmingen (vanaf Zaanstad)</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                    <th className="px-6 py-4">Bestemming</th>
                    <th className="px-6 py-4">Reistijd (ca.)</th>
                    <th className="px-6 py-4">Tarief Sedan</th>
                    <th className="px-6 py-4">Tarief Bus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {[
                    { dest: 'Rotterdam The Hague Airport', time: '60 min', sedan: '€165', bus: '€200' },
                    { dest: 'Eindhoven Airport', time: '90 min', sedan: '€295', bus: '€365' },
                    { dest: 'Brussels Airport (Zaventem)', time: '150 min', sedan: '€480', bus: '€590' },
                    { dest: 'Düsseldorf Airport', time: '150 min', sedan: '€470', bus: '€580' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4 font-medium">{row.dest}</td>
                      <td className="px-6 py-4 text-stone-500 text-sm">{row.time}</td>
                      <td className="px-6 py-4 font-bold text-emerald-600">{row.sedan}</td>
                      <td className="px-6 py-4 font-bold text-emerald-600">{row.bus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-8">
            <div className="flex gap-4 p-6 rounded-2xl bg-emerald-50 border border-emerald-100">
              <div className="shrink-0 w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center">
                <CreditCard size={20} />
              </div>
              <div>
                <h5 className="font-bold mb-1">Betaalmethode</h5>
                <p className="text-sm text-stone-600">Bij pinnen of creditcard komt er een toeslag van €5 bij.</p>
              </div>
            </div>
            <div className="flex gap-4 p-6 rounded-2xl bg-emerald-50 border border-emerald-100">
              <div className="shrink-0 w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center">
                <Star size={20} />
              </div>
              <div>
                <h5 className="font-bold mb-1">Luchthaven Ophaalservice</h5>
                <p className="text-sm text-stone-600">Wij hebben ook de mogelijkheid om klanten op te halen van de luchthavens. Houd er rekening mee dat hiervoor andere tarieven gelden.</p>
              </div>
            </div>
            <div className="flex gap-4 p-6 rounded-2xl bg-emerald-50 border border-emerald-100">
              <div className="shrink-0 w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <h5 className="font-bold mb-1">Kinderzitjes</h5>
                <p className="text-sm text-stone-600">Taxis zijn wettelijk niet verplicht om kinderzitjes te hebben. Houd er rekening mee dat wij geen kinderzitjes aanbieden.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
