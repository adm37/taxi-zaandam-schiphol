import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { applySeoForPath } from '../lib/applySeoForPath';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  ChevronRight, 
  CheckCircle2, 
  Wifi, 
  Banknote, 
  CreditCard,
  Star,
  ShieldCheck,
  ThumbsUp,
  HelpCircle,
  Users,
  Briefcase,
  Car
} from 'lucide-react';

const LazyAutocomplete = lazy(
  async () => ({
    default: (await import('react-google-autocomplete')).default as React.ComponentType<any>,
  }),
);

const googleMapsApiKey = (
  import.meta.env.PUBLIC_GOOGLE_MAPS_API_KEY ||
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
  import.meta.env.GOOGLE_MAPS_API_KEY ||
  ''
).trim();
const hasGoogleMapsApiKey = googleMapsApiKey.length > 0;

const ZAANSTAD_LOCATIONS = [
  'Assendelft', 'Koog aan de Zaan', 'Krommenie', 'Westzaan', 'Wormer', 'Wormerveer', 'Zaandam', 'Zaandijk'
];

const FAQS = [
  {
    question: "Wat kost een taxi van Zaanstad naar Schiphol?",
    answer: "Bij ZaanTaxi Schiphol betaalt u een vast tarief van slechts €50 vanuit elke plek in Zaanstad (Zaandam, Krommenie, Assendelft, etc.) naar Schiphol Airport."
  },
  {
    question: "Hoeveel kost een taxi naar Schiphol?",
    answer: "De kosten van een taxi naar Schiphol verschillen per vertrekplaats. Vanuit Zaanstad reist u bij ons met een vaste prijs, zodat u vooraf precies weet wat u betaalt, ongeacht files of vertragingen onderweg."
  },
  {
    question: "Wat is de goedkoopste manier om naar Schiphol te gaan?",
    answer: "De goedkoopste manier hangt af van uw situatie. Reist u alleen met weinig bagage, dan kan het openbaar vervoer voordelig zijn. Reist u met meerdere personen of koffers, dan is een taxi vaak voordeliger én comfortabeler. Met onze vaste lage tarieven kiest u voor een betaalbare, directe rit zonder overstappen."
  },
  {
    question: "Wat is goedkoper, Uber of taxi?",
    answer: "Hoewel Uber soms goedkoper lijkt, kunnen prijzen sterk stijgen door dynamische tarieven. Wij hanteren vaste prijzen zonder onverwachte verhogingen. Daarnaast bent u bij ons verzekerd van beschikbaarheid op de afgesproken tijd, zonder last-minute annuleringen."
  },
  {
    question: "Hoe kan ik een taxi reserveren?",
    answer: "U kunt eenvoudig online reserveren via ons boekingsformulier op de website of direct bellen naar 075 - 234 00 37 voor een directe bevestiging."
  },
  {
    question: "Rijden jullie ook 's nachts?",
    answer: "Ja, wij zijn 24 uur per dag, 7 dagen per week bereikbaar en beschikbaar voor al uw ritten naar de luchthaven."
  },
  {
    question: "Kan ik met pin of creditcard betalen?",
    answer: "Zeker! Al onze taxi's zijn uitgerust met moderne pinautomaten. U kunt betalen met Pin, Creditcard of contant."
  }
];

const METER_TARIFF_2026 = {
  Sedan: {
    start: 4.31,
    perKm: 3.17,
    perMinute: 0.52,
  },
} as const;

const formatEuro = (value: number): string => value.toLocaleString('nl-NL', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default function Home() {
  const [bookingStep, setBookingStep] = useState(1);
  const [enableAutocomplete, setEnableAutocomplete] = useState(false);
  const [formData, setFormData] = useState({
    pickup: '',
    houseNumber: '',
    destination: 'Schiphol Airport',
    date: '',
    time: '',
    returnTrip: false,
    returnPickup: '',
    returnDestination: '',
    returnDate: '',
    returnTime: '',
    passengers: 1,
    suitcases: 0,
    paymentMethod: 'contant',
    name: '',
    phone: ''
  });

  const [vehicleInfo, setVehicleInfo] = useState({
    type: 'Sedan',
    price: 50,
    icon: Car
  });
  const [returnEstimate, setReturnEstimate] = useState({
    price: 0,
    distanceKm: 0,
    durationMin: 0,
    isLoading: false,
    error: '',
  });
  const activeReturnTariff = METER_TARIFF_2026.Sedan;

  useEffect(() => {
    applySeoForPath('/');
  }, []);

  useEffect(() => {
    let price = 0;
    switch (formData.destination) {
      case 'Rotterdam The Hague Airport':
        price = 165;
        break;
      case 'Eindhoven Airport':
        price = 295;
        break;
      case 'Brussels Airport (Zaventem)':
        price = 480;
        break;
      case 'Düsseldorf Airport':
        price = 470;
        break;
      case 'Schiphol Airport':
      default:
        price = 50;
        break;
    }

    setVehicleInfo({
      type: 'Sedan',
      price: price,
      icon: Car
    });
  }, [formData.passengers, formData.suitcases, formData.destination]);

  useEffect(() => {
    if (!formData.returnTrip) {
      setReturnEstimate({ price: 0, distanceKm: 0, durationMin: 0, isLoading: false, error: '' });
      return;
    }

    const origin = formData.returnPickup.trim();
    const destination = formData.returnDestination.trim();

    if (!origin || !destination) {
      setReturnEstimate({ price: 0, distanceKm: 0, durationMin: 0, isLoading: false, error: '' });
      return;
    }

    if (!hasGoogleMapsApiKey) {
      setReturnEstimate({
        price: 0,
        distanceKm: 0,
        durationMin: 0,
        isLoading: false,
        error: 'Google Maps API key ontbreekt, terugreisprijs kan niet berekend worden.',
      });
      return;
    }

    const googleMaps = (window as any).google?.maps;
    if (!googleMaps?.DistanceMatrixService) {
      setReturnEstimate({
        price: 0,
        distanceKm: 0,
        durationMin: 0,
        isLoading: false,
        error: 'Google Maps is nog niet geladen. Vul eerst een adres in bij stap 1.',
      });
      return;
    }

    setReturnEstimate((prev) => ({ ...prev, isLoading: true, error: '' }));

    const service = new googleMaps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: googleMaps.TravelMode.DRIVING,
        unitSystem: googleMaps.UnitSystem.METRIC,
      },
      (response: any, status: string) => {
        if (status !== 'OK' || !response?.rows?.[0]?.elements?.[0]) {
          setReturnEstimate({
            price: 0,
            distanceKm: 0,
            durationMin: 0,
            isLoading: false,
            error: 'Route kon niet berekend worden met Google Maps.',
          });
          return;
        }

        const element = response.rows[0].elements[0];
        if (element.status !== 'OK' || !element.distance?.value || !element.duration?.value) {
          setReturnEstimate({
            price: 0,
            distanceKm: 0,
            durationMin: 0,
            isLoading: false,
            error: 'Ongeldige route voor terugreis. Controleer de adressen.',
          });
          return;
        }

        const distanceKm = element.distance.value / 1000;
        const durationMin = element.duration.value / 60;
        const price = activeReturnTariff.start + distanceKm * activeReturnTariff.perKm + durationMin * activeReturnTariff.perMinute;

        setReturnEstimate({
          price,
          distanceKm,
          durationMin,
          isLoading: false,
          error: '',
        });
      }
    );
  }, [formData.returnTrip, formData.returnPickup, formData.returnDestination, activeReturnTariff.start, activeReturnTariff.perKm, activeReturnTariff.perMinute]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format address: Street [HouseNumber], City, Country
    const addressParts = formData.pickup.split(',');
    const street = addressParts[0].trim();
    const cityAndRest = addressParts.slice(1).join(',').trim();
    const formattedPickup = cityAndRest 
      ? `${street} ${formData.houseNumber}, ${cityAndRest}` 
      : `${street} ${formData.houseNumber}`;

    const whatsappNumber = "31752340037";
    const totalPrice = vehicleInfo.price + (formData.paymentMethod === 'pin' ? 5 : 0);
    const paymentMethodLabel = formData.paymentMethod === 'pin' ? 'Pin / Creditcard' : 'Contant';
    const tripTypeLabel = formData.returnTrip ? 'Heen + terugreis (retour op metertarief)' : 'Enkele reis';
    const hasReturnEstimate = formData.returnTrip && !returnEstimate.error && returnEstimate.price > 0;
    const returnStartCost = activeReturnTariff.start;
    const returnDistanceCost = returnEstimate.distanceKm * activeReturnTariff.perKm;
    const returnTimeCost = returnEstimate.durationMin * activeReturnTariff.perMinute;

    const bookingPayload = {
      name: formData.name,
      phone: formData.phone,
      pickup: formattedPickup,
      destination: formData.destination,
      date: formData.date,
      time: formData.time,
      passengers: formData.passengers,
      suitcases: formData.suitcases,
      vehicleType: vehicleInfo.type,
      paymentMethod: `${paymentMethodLabel}${formData.returnTrip ? ' | Retour op metertarief' : ''}`,
      totalPrice,
      returnPickup: formData.returnTrip ? formData.returnPickup : '',
      returnDestination: formData.returnTrip ? formData.returnDestination : '',
      returnDate: formData.returnTrip ? formData.returnDate : '',
      returnTime: formData.returnTrip ? formData.returnTime : '',
      returnEstimatedPrice: hasReturnEstimate ? Number(returnEstimate.price.toFixed(2)) : 0,
    };

    const message = `*Schiphol Taxi Reservering*%0A%0A` +
      `*Naam:* ${formData.name}%0A` +
      `*Telefoon:* ${formData.phone}%0A` +
      `*Rittype:* ${tripTypeLabel}%0A` +
      `*Ophaaladres:* ${formattedPickup}%0A` +
      `*Bestemming:* ${formData.destination}%0A` +
      `*Datum:* ${formData.date}%0A` +
      `*Tijd:* ${formData.time}%0A` +
      `${formData.returnTrip ? `*Retour ophaaladres:* ${formData.returnPickup}%0A*Retour bestemming:* ${formData.returnDestination}%0A*Retourdatum:* ${formData.returnDate}%0A*Retourtijd:* ${formData.returnTime}%0A*Terugreis berekening:* start €${formatEuro(returnStartCost)} + afstand €${formatEuro(returnDistanceCost)} + tijd €${formatEuro(returnTimeCost)}%0A*Geschatte terugreis prijs:* ${hasReturnEstimate ? `€${formatEuro(returnEstimate.price)} (${returnEstimate.distanceKm.toFixed(1)} km · ${Math.round(returnEstimate.durationMin)} min)` : 'Niet beschikbaar'}%0A` : ''}` +
      `*Passagiers:* ${formData.passengers}%0A` +
      `*Koffers:* ${formData.suitcases}%0A` +
      `*Voertuig:* ${vehicleInfo.type}%0A` +
      `*Betaalmethode:* ${formData.paymentMethod === 'pin' ? 'Pin / Creditcard (+€5)' : 'Contant'}%0A` +
      `*Heenreis Prijs:* €${totalPrice}%0A` +
      `${formData.returnTrip ? `*Terugreis:* Geschat met Google Maps (${hasReturnEstimate ? `€${formatEuro(returnEstimate.price)}` : 'niet beschikbaar'}), definitieve prijs op taxameter` : ''}`;

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

    const whatsappWindow = window.open(whatsappUrl, '_blank');
    if (!whatsappWindow) {
      alert('WhatsApp kon niet worden geopend. De boeking wordt wel opgeslagen in het systeem.');
    }

    try {
      const saveResponse = await fetch('/api/bookings.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingPayload),
      });

      if (!saveResponse.ok) {
        throw new Error('booking-save-failed');
      }
    } catch {
      alert('Boeking kon niet worden opgeslagen in het systeem. Probeer het opnieuw.');
      return;
    }

    if (whatsappWindow) {
      alert(`Bedankt voor uw aanvraag, ${formData.name}! Uw WhatsApp-bericht is geopend en de boeking staat in ons systeem.`);
    } else {
      alert(`Bedankt voor uw aanvraag, ${formData.name}! De boeking staat in ons systeem.`);
    }
    
    setBookingStep(1);
    setFormData({
      pickup: '',
      houseNumber: '',
      destination: 'Schiphol Airport',
      date: '',
      time: '',
      returnTrip: false,
      returnPickup: '',
      returnDestination: '',
      returnDate: '',
      returnTime: '',
      passengers: 1,
      suitcases: 0,
      paymentMethod: 'contant',
      name: '',
      phone: ''
    });
  };

  const today = new Date().toISOString().split('T')[0];

  // JSON-LD Schema for LocalBusiness
  useEffect(() => {
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "ZaanTaxi Schiphol",
      "description": "Betrouwbare taxi service van Zaanstad naar Schiphol voor een vast tarief van €50.",
      "url": window.location.origin,
      "telephone": "+31752340037",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Zaanstad",
        "addressRegion": "Noord-Holland",
        "addressCountry": "NL"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "52.4420",
        "longitude": "4.8292"
      },
      "areaServed": ["Zaandam", "Krommenie", "Assendelft", "Wormer", "Wormerveer", "Zaandijk", "Koog aan de Zaan", "Westzaan"],
      "priceRange": "€50"
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
      <section className="relative pt-16 pb-20 px-4 bg-stone-50 overflow-hidden">
        {/* Background Image with Gradient Fade */}
        <div className="absolute inset-0 z-0">
          <div className="absolute right-0 top-0 bottom-0 w-full lg:w-3/4">
            <div className="absolute inset-0 bg-gradient-to-r from-stone-50 via-stone-50/80 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-50 via-stone-50/40 to-transparent lg:hidden z-10" />
            <img 
              src="https://images.pexels.com/photos/1483146/pexels-photo-1483146.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=1000"
              srcSet="https://images.pexels.com/photos/1483146/pexels-photo-1483146.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=800&h=500 800w, https://images.pexels.com/photos/1483146/pexels-photo-1483146.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=750 1200w, https://images.pexels.com/photos/1483146/pexels-photo-1483146.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=1000 1600w"
              sizes="(max-width: 1024px) 100vw, 75vw"
              alt="Taxi Background" 
              width={1600}
              height={1000}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-cover object-right"
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-bold mb-6">
              <CheckCircle2 size={16} />
              Taxi Zaanstad Schiphol Specialist
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-stone-900 mb-6 leading-[1.1]">
              Taxi van <span className="text-emerald-600">Zaanstad</span> naar Schiphol voor <span className="text-emerald-600">€50</span>
            </h1>
            <p className="text-xl text-stone-600 mb-8 max-w-lg leading-relaxed">
              Zoekt u een betrouwbare taxi van Zaandam, Krommenie, Assendelft of Wormer naar Schiphol? Bij ons profiteert u van een <strong>vast laag tarief</strong> zonder verrassingen.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 text-stone-500 bg-white px-4 py-2 rounded-xl shadow-sm border border-stone-100">
                <Wifi size={18} className="text-emerald-500" />
                <span className="text-sm font-medium">Gratis WiFi</span>
              </div>
              <div className="flex items-center gap-2 text-stone-500 bg-white px-4 py-2 rounded-xl shadow-sm border border-stone-100">
                <Banknote size={18} className="text-emerald-500" />
                <span className="text-sm font-medium">Contant</span>
              </div>
              <div className="flex items-center gap-2 text-stone-500 bg-white px-4 py-2 rounded-xl shadow-sm border border-stone-100">
                <CreditCard size={18} className="text-emerald-500" />
                <span className="text-sm font-medium">Pin/Creditcard</span>
              </div>
            </div>
          </motion.div>

          {/* Booking Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white p-8 rounded-3xl shadow-2xl shadow-stone-200 border border-stone-100 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4">
              <div className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                STAP {bookingStep} VAN 4
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-6">Direct Taxi Reserveren</h2>
            
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              {bookingStep === 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <label className="block text-xs font-bold text-stone-400 uppercase mb-2">Ophaaladres (Straat)</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 z-10" size={18} />
                        {hasGoogleMapsApiKey && enableAutocomplete ? (
                          <Suspense
                            fallback={
                              <input
                                type="text"
                                required
                                className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                                placeholder="Voer uw straat in..."
                                value={formData.pickup}
                                onChange={(e) => setFormData({...formData, pickup: e.target.value})}
                              />
                            }
                          >
                            <LazyAutocomplete
                              apiKey={googleMapsApiKey}
                              onPlaceSelected={(place: any) => {
                                setFormData({...formData, pickup: place.formatted_address || ''});
                              }}
                              options={{
                                types: ["address"],
                                componentRestrictions: { country: "nl" },
                                bounds: {
                                  north: 52.55,
                                  south: 52.40,
                                  east: 4.90,
                                  west: 4.75,
                                },
                                strictBounds: true,
                              }}
                              className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                              placeholder="Voer uw straat in..."
                              defaultValue={formData.pickup}
                              onChange={(e: any) => setFormData({...formData, pickup: e.target.value})}
                            />
                          </Suspense>
                        ) : (
                          <input
                            type="text"
                            required
                            className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                            placeholder="Voer uw straat in..."
                            value={formData.pickup}
                            onChange={(e) => setFormData({...formData, pickup: e.target.value})}
                            onFocus={() => {
                              if (hasGoogleMapsApiKey) {
                                setEnableAutocomplete(true);
                              }
                            }}
                          />
                        )}
                      </div>
                      {!hasGoogleMapsApiKey && (
                        <p className="text-xs text-amber-600 mt-2">
                          Adres-autocomplete is tijdelijk niet beschikbaar.
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-400 uppercase mb-2">Huisnr.</label>
                      <input 
                        type="text" 
                        required
                        placeholder="12A"
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                        value={formData.houseNumber}
                        onChange={(e) => setFormData({...formData, houseNumber: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-400 uppercase mb-2">Bestemming</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                      <select 
                        className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none appearance-none"
                        value={formData.destination}
                        onChange={(e) => setFormData({...formData, destination: e.target.value})}
                      >
                        <option value="Schiphol Airport">Schiphol Airport</option>
                        <option value="Rotterdam The Hague Airport">Rotterdam The Hague Airport</option>
                        <option value="Eindhoven Airport">Eindhoven Airport</option>
                        <option value="Brussels Airport (Zaventem)">Brussels Airport (Zaventem)</option>
                        <option value="Düsseldorf Airport">Düsseldorf Airport</option>
                      </select>
                    </div>
                  </div>
                  <button 
                    type="button"
                    disabled={!formData.pickup || !formData.houseNumber || !formData.destination}
                    onClick={() => setBookingStep(2)}
                    className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 group"
                  >
                    Volgende Stap
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              )}

              {bookingStep === 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-400 uppercase mb-2">Datum</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                        <input 
                          type="date" 
                          required
                          min={today}
                          className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                          value={formData.date}
                          onChange={(e) => setFormData({...formData, date: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-400 uppercase mb-2">Ophaaltijd</label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                        <input 
                          type="time" 
                          required
                          className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                          value={formData.time}
                          onChange={(e) => setFormData({...formData, time: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-3">
                    <div className="flex flex-col gap-3">
                      <div>
                        <p className="text-sm font-bold text-stone-900">Terugreis toevoegen</p>
                        <p className="text-xs text-stone-500">Heenreis blijft vast tarief, terugreis is op meter.</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({
                            ...prev,
                            returnTrip: true,
                            returnPickup: prev.returnPickup || prev.destination,
                            returnDestination: prev.returnDestination || `${prev.pickup} ${prev.houseNumber}`.trim(),
                          }))}
                          className={`px-4 py-2 rounded-xl border font-bold transition-all ${formData.returnTrip ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'}`}
                        >
                          Ja, terugreis
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({
                            ...prev,
                            returnTrip: false,
                            returnPickup: '',
                            returnDestination: '',
                            returnDate: '',
                            returnTime: '',
                          }))}
                          className={`px-4 py-2 rounded-xl border font-bold transition-all ${!formData.returnTrip ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'}`}
                        >
                          Nee, enkele reis
                        </button>
                      </div>
                    </div>

                    {formData.returnTrip && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-stone-400 uppercase mb-2">Retour ophaaladres</label>
                            <input
                              type="text"
                              required={formData.returnTrip}
                              className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                              value={formData.returnPickup}
                              onChange={(e) => setFormData({...formData, returnPickup: e.target.value})}
                              placeholder="Bijv. Schiphol Airport"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-stone-400 uppercase mb-2">Retour bestemming</label>
                            <input
                              type="text"
                              required={formData.returnTrip}
                              className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                              value={formData.returnDestination}
                              onChange={(e) => setFormData({...formData, returnDestination: e.target.value})}
                              placeholder="Bijv. Uw adres"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-stone-400 uppercase mb-2">Retourdatum</label>
                          <input
                            type="date"
                            required={formData.returnTrip}
                            min={formData.date || today}
                            className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                            value={formData.returnDate}
                            onChange={(e) => setFormData({...formData, returnDate: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-stone-400 uppercase mb-2">Retourtijd</label>
                          <input
                            type="time"
                            required={formData.returnTrip}
                            className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                            value={formData.returnTime}
                            onChange={(e) => setFormData({...formData, returnTime: e.target.value})}
                          />
                        </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <button type="button" onClick={() => setBookingStep(1)} className="flex-1 bg-stone-100 text-stone-600 py-4 rounded-xl font-bold hover:bg-stone-200 transition-all">Terug</button>
                    <button 
                      type="button"
                      disabled={!formData.date || !formData.time || (formData.returnTrip && (!formData.returnPickup || !formData.returnDestination || !formData.returnDate || !formData.returnTime))}
                      onClick={() => setBookingStep(3)}
                      className="flex-[2] bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 group"
                    >
                      Volgende Stap
                      <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              )}

              {bookingStep === 3 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-400 uppercase mb-2">Passagiers</label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                        <select 
                          className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none appearance-none"
                          value={formData.passengers}
                          onChange={(e) => setFormData({...formData, passengers: parseInt(e.target.value)})}
                        >
                          {[1,2,3,4].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Persoon' : 'Personen'}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-400 uppercase mb-2">Koffers</label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                        <select 
                          className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none appearance-none"
                          value={formData.suitcases}
                          onChange={(e) => setFormData({...formData, suitcases: parseInt(e.target.value)})}
                        >
                          {[0,1,2,3].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Koffer' : 'Koffers'}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-400 uppercase mb-2">Betaalmethode</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, paymentMethod: 'contant'})}
                        className={`py-3 rounded-xl font-bold border transition-all ${formData.paymentMethod === 'contant' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-stone-50 text-stone-600 border-stone-200'}`}
                      >
                        Contant
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, paymentMethod: 'pin'})}
                        className={`py-3 rounded-xl font-bold border transition-all ${formData.paymentMethod === 'pin' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-stone-50 text-stone-600 border-stone-200'}`}
                      >
                        Pin / Creditcard
                      </button>
                    </div>
                    {formData.paymentMethod === 'pin' && (
                      <p className="text-[10px] text-emerald-600 mt-1 font-bold">* Bij pinnen of creditcard komt er een toeslag van €5 bij.</p>
                    )}
                  </div>

                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center">
                        <vehicleInfo.icon size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Geselecteerd voertuig</p>
                        <p className="font-bold text-stone-900">{vehicleInfo.type}</p>
                        <p className="text-[10px] text-stone-500">Max. 4 pers. & 3 koffers</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Heenreis Prijs</p>
                      <p className="text-2xl font-black text-emerald-600">€{vehicleInfo.price + (formData.paymentMethod === 'pin' ? 5 : 0)}</p>
                    </div>
                  </div>

                  {formData.returnTrip && (
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
                      <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">Geschatte terugreis prijs</p>
                      {returnEstimate.isLoading ? (
                        <p className="text-sm text-stone-700">Prijs wordt berekend via Google Maps...</p>
                      ) : returnEstimate.error ? (
                        <p className="text-sm text-red-600">{returnEstimate.error}</p>
                      ) : returnEstimate.price > 0 ? (
                        <div className="space-y-1">
                          <p className="text-2xl font-black text-amber-700">€{formatEuro(returnEstimate.price)}</p>
                          <p className="text-xs text-stone-600">
                            Inclusief starttarief: €{formatEuro(activeReturnTariff.start)}
                          </p>
                          <p className="text-xs text-stone-600">
                            Berekening: start €{formatEuro(activeReturnTariff.start)} + afstand €{formatEuro(returnEstimate.distanceKm * activeReturnTariff.perKm)} + tijd €{formatEuro(returnEstimate.durationMin * activeReturnTariff.perMinute)}
                          </p>
                          <p className="text-xs text-stone-600">
                            Op basis van Google Maps: {returnEstimate.distanceKm.toFixed(1)} km · {Math.round(returnEstimate.durationMin)} min
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-stone-700">Vul retour-ophaaladres en retour-bestemming in voor een prijsberekening.</p>
                      )}
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button type="button" onClick={() => setBookingStep(2)} className="flex-1 bg-stone-100 text-stone-600 py-4 rounded-xl font-bold hover:bg-stone-200 transition-all">Terug</button>
                    <button 
                      type="button"
                      onClick={() => setBookingStep(4)}
                      className="flex-[2] bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 group"
                    >
                      Laatste Stap
                      <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              )}

              {bookingStep === 4 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-400 uppercase mb-2">Uw Volledige Naam</label>
                    <input 
                      type="text" 
                      placeholder="Bijv. Jan de Vries"
                      required
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-400 uppercase mb-2">Telefoonnummer</label>
                    <input 
                      type="tel" 
                      placeholder="06 12345678"
                      required
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div className="flex gap-4">
                    <button type="button" onClick={() => setBookingStep(3)} className="flex-1 bg-stone-100 text-stone-600 py-4 rounded-xl font-bold hover:bg-stone-200 transition-all">Terug</button>
                    <button 
                      type="submit"
                      disabled={!formData.name || !formData.phone}
                      className="flex-[2] bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-lg shadow-emerald-200"
                    >
                      Verstuur via WhatsApp & Bevestig ({formData.returnTrip ? `heenreis €${vehicleInfo.price + (formData.paymentMethod === 'pin' ? 5 : 0)} + ${returnEstimate.price > 0 ? `retour ±€${formatEuro(returnEstimate.price)}` : 'retour prijs volgt'}` : `€${vehicleInfo.price + (formData.paymentMethod === 'pin' ? 5 : 0)}`})
                    </button>
                  </div>
                </motion.div>
              )}
            </form>
            
            <p className="mt-6 text-center text-stone-400 text-sm">
              <span className="text-[10px] mt-1 block">* Bij pinnen of creditcard komt er een toeslag van €5 bij.</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-stone-900">Waarom kiezen voor onze Taxi Service in Zaanstad?</h2>
              <div className="prose prose-stone max-w-none text-stone-600 leading-relaxed space-y-4">
                <p>
                  Wanneer u op reis gaat, wilt u zich geen zorgen maken over het vervoer naar de luchthaven. ZaanTaxi Schiphol is de specialist in <strong>luchthavenvervoer vanuit de Zaanstreek</strong>. Of u nu in Zaandam, Krommenie, Assendelft, Wormer of Wormerveer woont, wij staan voor u klaar.
                </p>
                <p>
                  Onze dienstverlening kenmerkt zich door stiptheid, comfort en transparantie. Met ons <strong>vaste tarief van €50</strong> weet u precies waar u aan toe bent. Geen tikkende meters in de file op de A8 of A10, maar een eerlijke prijs voor een hoogwaardige rit.
                </p>
                <h3 className="text-xl font-bold text-stone-900 pt-4">Voordelen van ZaanTaxi Schiphol:</h3>
                <ul className="list-none space-y-2">
                  <li className="flex items-center gap-2"><CheckCircle2 size={18} className="text-emerald-500" /> 24/7 Beschikbaar voor vroege en late vluchten.</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={18} className="text-emerald-500" /> Professionele chauffeurs met uitgebreide regiokennis.</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={18} className="text-emerald-500" /> Moderne, schone voertuigen voor optimaal comfort.</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={18} className="text-emerald-500" /> Eenvoudig online of telefonisch reserveren.</li>
                </ul>
              </div>
            </div>
            <div className="space-y-8">
              <div className="bg-stone-50 p-8 rounded-3xl border border-stone-100">
                <ShieldCheck className="text-emerald-600 mb-4" size={40} />
                <h4 className="text-xl font-bold mb-2">Veilig & Gecertificeerd</h4>
                <p className="text-stone-500 text-sm">Al onze chauffeurs zijn in het bezit van de vereiste papieren en onze voertuigen voldoen aan de hoogste veiligheidseisen.</p>
              </div>
              <div className="bg-stone-50 p-8 rounded-3xl border border-stone-100">
                <ThumbsUp className="text-emerald-600 mb-4" size={40} />
                <h4 className="text-xl font-bold mb-2">100% Tevredenheidsgarantie</h4>
                <p className="text-stone-500 text-sm">Wij doen er alles aan om uw reis zo soepel mogelijk te laten verlopen. Uw comfort is onze prioriteit.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-stone-900">Onze Werkgebieden in de Zaanstreek</h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Wij bieden onze taxi service aan in de gehele Zaanstreek. Klik op uw woonplaats voor meer informatie over onze diensten en tarieven naar Schiphol.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ZAANSTAD_LOCATIONS.map((loc) => {
              const slug = loc.toLowerCase().replace(/\s+/g, '-');
              const descriptions: Record<string, string> = {
                'Assendelft': 'Snel en comfortabel vanuit Saendelft of Kreekrijk naar de luchthaven.',
                'Koog aan de Zaan': 'Betrouwbaar vervoer vanuit Westerkoog en Oud-Koog.',
                'Krommenie': 'Uw vaste taxi partner in Krommenie voor een zorgeloze reis.',
                'Westzaan': 'Persoonlijke service vanuit het karakteristieke Westzaan.',
                'Wormer': 'Altijd op tijd voor uw vlucht vanuit het hart van Wormer.',
                'Wormerveer': 'Luxe vervoer tegen een scherp tarief vanuit Wormerveer.',
                'Zaandam': 'De grootste taxi specialist in alle wijken van Zaandam.',
                'Zaandijk': 'Vaste lage prijzen vanuit Rooswijk en Oud-Zaandijk.'
              };
              return (
                <Link 
                  key={loc} 
                  to={`/taxi-${slug}-schiphol/`}
                  className="group p-6 rounded-2xl bg-stone-50 border border-stone-100 hover:bg-emerald-50 hover:border-emerald-200 transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                      <MapPin size={20} />
                    </div>
                    <h3 className="font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">{loc}</h3>
                  </div>
                  <p className="text-stone-500 text-sm leading-relaxed">
                    {descriptions[loc] || `Professioneel taxi vervoer van ${loc} naar Schiphol voor €50.`}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-emerald-600 text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                    Bekijk Tarieven <ChevronRight size={14} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Veelgestelde Vragen (FAQ)</h2>
            <p className="text-stone-600">Alles wat u moet weten over uw taxi van Zaanstad naar Schiphol.</p>
          </div>
          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <details key={index} className="group bg-white rounded-2xl border border-stone-200 overflow-hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <span className="font-bold text-stone-900 flex items-center gap-3">
                    <HelpCircle size={20} className="text-emerald-600" />
                    {faq.question}
                  </span>
                  <span className="transition-transform group-open:rotate-180">
                    <ChevronRight size={20} />
                  </span>
                </summary>
                <div className="px-6 pb-6 text-stone-600 leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Banner */}
      <section className="py-12 bg-emerald-600 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="flex whitespace-nowrap animate-marquee">
            {[...Array(10)].map((_, i) => (
              <span key={i} className="text-9xl font-black text-white mx-8">€50 VASTE PRIJS</span>
            ))}
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-white text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">
            Betrouwbaar Luchthavenvervoer
          </h2>
          <p className="text-emerald-100 text-lg font-medium">
            Vanuit Zaandam, Krommenie, Assendelft, Wormer of Wormerveer: Altijd €50 naar Schiphol.
          </p>
        </div>
      </section>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
