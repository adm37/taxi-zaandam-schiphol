import React from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Clock, MessageSquare } from 'lucide-react';

export default function Contact() {
  return (
    <div className="pt-16">
      <section className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Neem Contact Op</h2>
            <p className="text-stone-600 max-w-2xl mx-auto text-lg">
              Heeft u vragen of wilt u een speciale rit boeken? Wij staan 24/7 voor u klaar.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm text-center">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Phone size={24} />
              </div>
              <h4 className="font-bold text-lg mb-2">Telefoon</h4>
              <p className="text-stone-500 mb-4">Bel ons direct voor een boeking.</p>
              <a href="tel:0752340037" className="text-emerald-600 font-bold text-xl">075 - 234 00 37</a>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm text-center">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Mail size={24} />
              </div>
              <h4 className="font-bold text-lg mb-2">E-mail</h4>
              <p className="text-stone-500 mb-4">Voor offertes en vragen.</p>
              <a href="mailto:info@zaantaxischiphol.nl" className="text-emerald-600 font-bold">info@zaantaxischiphol.nl</a>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm text-center">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                <MessageSquare size={24} />
              </div>
              <h4 className="font-bold text-lg mb-2">WhatsApp</h4>
              <p className="text-stone-500 mb-4">Snel een berichtje sturen.</p>
              <a href="#" className="text-emerald-600 font-bold">Stuur een bericht</a>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden grid lg:grid-cols-2">
            <div className="p-8 md:p-12">
              <h3 className="text-2xl font-bold mb-6">Stuur ons een bericht</h3>
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-400 uppercase mb-2">Naam</label>
                    <input type="text" className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-400 uppercase mb-2">E-mail</label>
                    <input type="email" className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase mb-2">Onderwerp</label>
                  <input type="text" className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase mb-2">Bericht</label>
                  <textarea rows={4} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none"></textarea>
                </div>
                <button className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all">
                  Verstuur Bericht
                </button>
              </form>
            </div>
            <div className="bg-stone-900 p-8 md:p-12 text-white flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-8">Bedrijfsgegevens</h3>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <MapPin className="text-emerald-500 shrink-0" />
                  <div>
                    <p className="font-bold">Adres</p>
                    <p className="text-stone-400 text-sm">Zaanstad, Noord-Holland</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <Clock className="text-emerald-500 shrink-0" />
                  <div>
                    <p className="font-bold">Openingstijden</p>
                    <p className="text-stone-400 text-sm">24/7 Bereikbaar</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <Phone className="text-emerald-500 shrink-0" />
                  <div>
                    <p className="font-bold">Klantenservice</p>
                    <p className="text-stone-400 text-sm">Ma - Zo: 08:00 - 22:00</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
