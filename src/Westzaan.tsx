import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  MapPin, CheckCircle2, HelpCircle, ShieldCheck, ThumbsUp, Clock, Banknote, CreditCard, Wifi, Star, Car, Users, Calendar, ChevronRight
} from 'lucide-react';
import OtherAirportsLinks from './components/OtherAirportsLinks';

export default function Westzaan() {
  React.useEffect(() => {
    document.title = "Taxi Westzaan Schiphol €75 | Uw Lokale Taxi Specialist | ZaanTaxi Schiphol";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', "Taxi Westzaan Schiphol nodig? Reis voor een vast tarief van €75. 24/7 service in heel Westzaan. Veilig, snel en comfortabel luchthavenvervoer.");
    
    // JSON-LD for Local Business / Taxi Service
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "TaxiService",
      "name": "ZaanTaxi Schiphol - Westzaan",
      "description": "De beste taxi service van Westzaan naar Schiphol voor een vast tarief van €75.",
      "provider": {
        "@type": "LocalBusiness",
        "name": "ZaanTaxi Schiphol",
        "telephone": "+31752340037",
        "priceRange": "€75",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Westzaan",
          "addressRegion": "Noord-Holland",
          "addressCountry": "NL"
        }
      },
      "areaServed": {
        "@type": "City",
        "name": "Westzaan"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Taxi Westzaan Schiphol",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Taxi Sedan Westzaan naar Schiphol"
            },
            "price": "75.00",
            "priceCurrency": "EUR"
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Taxibus Westzaan naar Schiphol"
            },
            "price": "75.00",
            "priceCurrency": "EUR"
          }
        ]
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(schemaData);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 bg-emerald-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-100/50 -skew-x-12 translate-x-1/2" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="text-center lg:text-left grid lg:grid-cols-2 gap-12 items-center"
          >
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-bold mb-6">
                <MapPin size={16} /> Taxi Westzaan Schiphol Specialist
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-stone-900 mb-6 leading-[1.1]">
                Betrouwbare Taxi van <span className="text-emerald-600">Westzaan</span> naar Schiphol
              </h1>
              <p className="text-xl text-stone-600 mb-8 max-w-2xl">
                Reis zorgeloos en comfortabel van Westzaan naar Schiphol voor het vaste lage tarief van <span className="font-bold text-emerald-600">€75</span>. Geen verborgen kosten, 24/7 beschikbaar.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-12">
                <Link to="/" className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all flex items-center gap-2">
                  Nu Reserveren <ChevronRight size={20} />
                </Link>
                <a href="tel:0752340037" className="bg-white text-stone-900 border border-stone-200 px-8 py-4 rounded-xl font-bold hover:bg-stone-50 transition-all">Bel Direct</a>
              </div>
              <div className="flex items-center gap-6 justify-center lg:justify-start">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <img key={i} src={`https://picsum.photos/seed/${i+50}/40/40`} className="w-10 h-10 rounded-full border-2 border-white" alt="Klant" referrerPolicy="no-referrer" />
                  ))}
                </div>
                <div className="text-sm">
                  <div className="flex text-yellow-400 mb-1">
                    {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                  <p className="text-stone-500 font-medium">4.9/5 door 200+ klanten in Westzaan</p>
                </div>
              </div>
            </div>
            <div className="hidden lg:block relative">
              <img 
                src="https://i.ibb.co/YFwc4rhk/Schermafbeelding-2026-02-25-214412.png" 
                alt="Taxi Westzaan Schiphol" 
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-stone-100">
                <p className="text-emerald-600 font-black text-3xl">€75</p>
                <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">Vast Tarief</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-12">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-stone-900">De Beste Taxi Service in Westzaan naar Schiphol</h2>
                <div className="prose prose-stone text-stone-600 max-w-none space-y-6 leading-relaxed">
                  <p>
                    Bent u op zoek naar een <strong>taxi in Westzaan</strong> die u veilig, snel en tegen een scherp tarief naar Schiphol brengt? ZaanTaxi Schiphol is uw lokale partner voor hoogwaardig luchthavenvervoer. Wij begrijpen dat uw reis begint bij de voordeur, en daarom zorgen wij voor een zorgeloze start.
                  </p>
                  <p>
                    Vanuit het karakteristieke Westzaan naar Schiphol reizen was nog nooit zo makkelijk. Wij halen u op bij uw woning in Westzaan en brengen u voor €75 veilig naar de luchthaven. Onze chauffeurs zijn hoffelijk en helpen u graag met uw bagage.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-6 rounded-2xl bg-stone-50 border border-stone-100">
                  <Clock className="text-emerald-600 mb-4" size={32} />
                  <h3 className="text-xl font-bold mb-2 text-stone-900">24/7 Beschikbaarheid</h3>
                  <p className="text-stone-500 text-sm">Of u nu een vroege vlucht heeft om 04:00 's ochtends of laat in de nacht terugkomt, wij staan altijd voor u klaar in Westzaan.</p>
                </div>
                <div className="p-6 rounded-2xl bg-stone-50 border border-stone-100">
                  <ShieldCheck className="text-emerald-600 mb-4" size={32} />
                  <h3 className="text-xl font-bold mb-2 text-stone-900">Veilig & Comfortabel</h3>
                  <p className="text-stone-500 text-sm">Onze voertuigen zijn modern, schoon en voorzien van alle gemakken zoals airconditioning en gratis WiFi.</p>
                </div>
                <div className="p-6 rounded-2xl bg-stone-50 border border-stone-100">
                  <Banknote className="text-emerald-600 mb-4" size={32} />
                  <h3 className="text-xl font-bold mb-2 text-stone-900">Vaste Lage Prijs</h3>
                  <p className="text-stone-500 text-sm">Geen tikkende meter of verrassingen achteraf. U betaalt altijd €75 voor een sedan van Westzaan naar Schiphol.</p>
                </div>
                <div className="p-6 rounded-2xl bg-stone-50 border border-stone-100">
                  <ThumbsUp className="text-emerald-600 mb-4" size={32} />
                  <h3 className="text-xl font-bold mb-2 text-stone-900">Professionele Chauffeurs</h3>
                  <p className="text-stone-500 text-sm">Onze chauffeurs zijn hoffelijk, spreken meerdere talen en helpen u graag met uw bagage.</p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-6 text-stone-900">Waarom ZaanTaxi Schiphol in Westzaan?</h2>
                <ul className="list-none space-y-3">
                  <li className="flex items-start gap-3"><ThumbsUp size={20} className="text-emerald-500 mt-1" /><span><strong>Lokaal & Bekend:</strong> Wij kennen elke weg in Westzaan.</span></li>
                  <li className="flex items-start gap-3"><Banknote size={20} className="text-emerald-500 mt-1" /><span><strong>Geen Meter:</strong> Vaste prijs van €75.</span></li>
                </ul>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-stone-900 text-white p-8 rounded-3xl sticky top-24">
                <h4 className="text-2xl font-bold mb-6">Tarieven Westzaan</h4>
                <div className="space-y-6 mb-8">
                  <div className="flex justify-between items-center pb-4 border-b border-stone-800">
                    <div>
                      <p className="font-bold text-lg">Standaard Sedan</p>
                      <p className="text-stone-400 text-xs">1-4 Personen</p>
                    </div>
                    <span className="text-2xl font-black text-emerald-400">€75</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-stone-800">
                    <div>
                      <p className="font-bold text-lg">Taxibus</p>
                      <p className="text-stone-400 text-xs">5-7 Personen</p>
                    </div>
                    <span className="text-2xl font-black text-emerald-400">€75</span>
                  </div>
                </div>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-sm text-stone-300">
                    <CheckCircle2 size={18} className="text-emerald-500" />
                    Gratis annuleren
                  </div>
                  <div className="flex items-center gap-3 text-sm text-stone-300">
                    <CheckCircle2 size={18} className="text-emerald-500" />
                    Pin, Creditcard of Contant
                  </div>
                  <div className="flex items-center gap-3 text-sm text-stone-300">
                    <CheckCircle2 size={18} className="text-emerald-500" />
                    Directe bevestiging
                  </div>
                </div>
                <Link to="/" className="block w-full bg-emerald-600 text-white text-center py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/20">
                  Reserveer Nu Online
                </Link>
                <a href="tel:0752340037" className="block w-full mt-4 text-center text-stone-400 hover:text-white transition-colors text-sm font-medium">
                  Of bel: 075 - 234 00 37
                </a>
              </div>

              <div className="bg-emerald-50 p-8 rounded-3xl border border-emerald-100">
                <h4 className="text-xl font-bold mb-4 text-emerald-900">Veelgestelde Vragen</h4>
                <div className="space-y-4">
                  <details className="group">
                    <summary className="font-bold text-sm text-emerald-800 cursor-pointer list-none flex justify-between items-center">
                      Hoe lang duurt de rit?
                      <ChevronRight size={16} className="group-open:rotate-90 transition-transform" />
                    </summary>
                    <p className="text-emerald-700 text-xs mt-2 leading-relaxed">Gemiddeld duurt de rit van Westzaan naar Schiphol 20 minuten.</p>
                  </details>
                  <details className="group">
                    <summary className="font-bold text-sm text-emerald-800 cursor-pointer list-none flex justify-between items-center">
                      Kan ik pinnen?
                      <ChevronRight size={16} className="group-open:rotate-90 transition-transform" />
                    </summary>
                    <p className="text-emerald-700 text-xs mt-2 leading-relaxed">Ja, al onze taxi's zijn voorzien van een pinautomaat. U kunt ook met creditcard of contant betalen.</p>
                  </details>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Wat onze klanten in Westzaan zeggen</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Henk T.', text: 'Betrouwbaar en punctueel. De chauffeur was keurig op tijd bij mijn woning in Westzaan.' },
              { name: 'Maria L.', text: 'Vaste prijs van €75 is erg fijn. Geen verrassingen achteraf.' },
              { name: 'Jan de V.', text: 'Wij gebruiken ZaanTaxi Schiphol altijd voor onze vakanties vanuit Westzaan.' }
            ].map((review, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-stone-200">
                <div className="flex text-yellow-400 mb-4 justify-center">
                  {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="text-stone-600 italic mb-6">"{review.text}"</p>
                <p className="font-bold text-stone-900">{review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <OtherAirportsLinks locationName="Westzaan" locationSlug="westzaan" currentAirportSlug="" />
    </div>
  );
}
