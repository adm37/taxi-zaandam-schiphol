import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Users, Heart, Award } from 'lucide-react';
import { applySeoForPath } from '../lib/applySeoForPath';

export default function OverOns() {
  useEffect(() => {
    applySeoForPath('/over-ons');
  }, []);

  return (
    <div className="pt-16">
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">Uw Lokale Specialist in Luchthavenvervoer</h2>
              <p className="text-stone-600 text-lg leading-relaxed mb-6">
                ZaanTaxi Schiphol is ontstaan uit de behoefte aan betrouwbaar en betaalbaar vervoer vanuit de Zaanstreek naar onze nationale luchthaven. Wij begrijpen dat een vakantie of zakenreis begint bij de voordeur.
              </p>
              <p className="text-stone-600 text-lg leading-relaxed">
                Met jarenlange ervaring in de regio Zaanstad kennen wij elke straat en elke sluiproute. Onze chauffeurs zijn niet alleen professioneel, maar ook echte gastheren die er alles aan doen om uw reis zo aangenaam mogelijk te maken.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img 
                src="https://i.ibb.co/YFwc4rhk/Schermafbeelding-2026-02-25-214412.png" 
                alt="Onze Taxi" 
                width={1200}
                height={900}
                loading="lazy"
                decoding="async"
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-emerald-600 text-white p-8 rounded-3xl shadow-xl">
                <p className="text-4xl font-black mb-1">10+</p>
                <p className="text-sm font-bold uppercase tracking-wider">Jaar Ervaring</p>
              </div>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: ShieldCheck, title: 'Veiligheid', desc: 'Al onze voertuigen worden wekelijks gecontroleerd.' },
              { icon: Users, title: 'Klantgericht', desc: 'Uw wensen staan bij ons altijd centraal.' },
              { icon: Heart, title: 'Passie', desc: 'Wij houden van ons vak en dat merkt u.' },
              { icon: Award, title: 'Kwaliteit', desc: 'Alleen de beste chauffeurs rijden voor ons.' }
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <item.icon size={32} />
                </div>
                <h4 className="font-bold text-xl mb-2">{item.title}</h4>
                <p className="text-stone-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
