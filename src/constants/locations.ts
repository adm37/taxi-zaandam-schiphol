export interface LocationData {
  slug: string;
  name: string;
  title: string;
  description: string;
  content: string;
  faq: { question: string; answer: string }[];
}

export const locationsData: Record<string, LocationData> = {
  assendelft: {
    slug: 'assendelft',
    name: 'Assendelft',
    title: 'Taxi Assendelft Schiphol €75 - Vaste Prijs | ZaanTaxi',
    description: 'Taxi van Assendelft naar Schiphol voor slechts €75. Betrouwbaar, snel en 24/7 beschikbaar. Reserveer uw taxi in Assendelft direct online!',
    content: 'Zoekt u een betrouwbare taxi in Assendelft voor uw rit naar Schiphol? ZaanTaxi Schiphol biedt u een comfortabele reis voor een vast tarief van €75. Of u nu in Assendelft-Zuid of bij de Kreekrijk woont, onze chauffeurs staan binnen no-time voor uw deur. Wij begrijpen dat stiptheid essentieel is voor uw vliegreis.',
    faq: [
      { question: "Wat kost een taxi van Assendelft naar Schiphol?", answer: "Een taxi van Assendelft naar Schiphol kost bij ons altijd €75, ongeacht het tijdstip." },
      { question: "Hoe lang is de reistijd van Assendelft naar Schiphol?", answer: "Gemiddeld duurt de rit ongeveer 20 tot 25 minuten, afhankelijk van de verkeersdrukte." }
    ]
  },
  'koog-aan-de-zaan': {
    slug: 'koog-aan-de-zaan',
    name: 'Koog aan de Zaan',
    title: 'Taxi Koog aan de Zaan Schiphol €75 | 24/7 Service',
    description: 'Voordelige taxi van Koog aan de Zaan naar Schiphol. Vast tarief van €75. Veilig en comfortabel luchthavenvervoer. Boek nu!',
    content: 'Woont u in Koog aan de Zaan en heeft u een taxi naar Schiphol nodig? Wij halen u op bij station Koog aan de Zaan, Westerkoog of Oud-Koog. Voor slechts €75 brengen wij u direct naar de vertrekhal. Onze chauffeurs zijn bekend met de regio en zorgen voor een zorgeloze start van uw reis.',
    faq: [
      { question: "Rijdt de taxi ook vanuit Westerkoog naar Schiphol?", answer: "Ja, wij halen klanten op in heel Koog aan de Zaan, inclusief Westerkoog, voor het vaste tarief van €75." },
      { question: "Kan ik pinnen in de taxi vanuit Koog aan de Zaan?", answer: "Zeker, al onze voertuigen zijn uitgerust met een pinautomaat." }
    ]
  },
  krommenie: {
    slug: 'krommenie',
    name: 'Krommenie',
    title: 'Taxi Krommenie Schiphol €75 - Altijd op Tijd | ZaanTaxi',
    description: 'Taxi Krommenie Schiphol nodig? Profiteer van ons vaste tarief van €75. Betrouwbare chauffeurs en luxe auto\'s. Reserveer online.',
    content: 'Voor een taxi in Krommenie naar Schiphol bent u bij ons aan het juiste adres. Wij bedienen heel Krommenie, van de Noorderham tot aan het centrum. Onze service is 24/7 beschikbaar, dus ook voor vroege vluchten kunt u op ons rekenen. Geniet van een ontspannen rit voor een vaste prijs.',
    faq: [
      { question: "Wat is het tarief van Krommenie naar Schiphol?", answer: "Het tarief is vastgesteld op €75 voor een standaard sedan." },
      { question: "Hoe ver van tevoren moet ik mijn taxi in Krommenie boeken?", answer: "Wij raden aan om minimaal 2 uur van tevoren te boeken, maar u kunt ons altijd bellen voor last-minute beschikbaarheid." }
    ]
  },
  westzaan: {
    slug: 'westzaan',
    name: 'Westzaan',
    title: 'Taxi Westzaan Schiphol €75 | Uw Lokale Taxi Specialist',
    description: 'Taxi van Westzaan naar Schiphol voor een vast bedrag van €75. Geen verborgen kosten. 24 uur per dag bereikbaar. Boek uw rit!',
    content: 'Vanuit het karakteristieke Westzaan naar Schiphol reizen was nog nooit zo makkelijk. Wij halen u op bij uw woning in Westzaan en brengen u voor €75 veilig naar de luchthaven. Onze chauffeurs zijn hoffelijk en helpen u graag met uw bagage.',
    faq: [
      { question: "Is de prijs van €75 ook geldig in het weekend?", answer: "Ja, ons vaste tarief van €75 geldt 7 dagen per week, ook in het weekend en op feestdagen." },
      { question: "Hoeveel koffers kunnen er mee in de taxi vanuit Westzaan?", answer: "In onze standaard sedan passen doorgaans 3 grote koffers en handbagage." }
    ]
  },
  wormer: {
    slug: 'wormer',
    name: 'Wormer',
    title: 'Taxi Wormer Schiphol €75 - Vaste Prijs Garantie',
    description: 'Taxi Wormer Schiphol nodig? Reis comfortabel voor slechts €75. Betrouwbaar luchthavenvervoer vanuit Wormer. Reserveer nu!',
    content: 'Zoekt u een taxi in Wormer voor vervoer naar Schiphol? Wij staan voor u klaar in heel Wormer. Voor een vast bedrag van €75 rijden wij u rechtstreeks naar de luchthaven. Geen gedoe met parkeren of openbaar vervoer, maar de luxe van een privé taxi.',
    faq: [
      { question: "Wat kost een taxi van Wormer naar Schiphol?", answer: "Het vaste tarief van Wormer naar Schiphol is €75." },
      { question: "Zijn er extra kosten voor nachtritten vanuit Wormer?", answer: "Nee, bij ZaanTaxi Schiphol hanteren we dag en nacht hetzelfde vaste tarief." }
    ]
  },
  wormerveer: {
    slug: 'wormerveer',
    name: 'Wormerveer',
    title: 'Taxi Wormerveer Schiphol €75 | Snel & Betrouwbaar',
    description: 'Taxi van Wormerveer naar Schiphol voor een vast tarief van €75. De beste service in de Zaanstreek. Boek uw taxi online.',
    content: 'Wormerveerders opgelet! Voor uw rit naar Schiphol betaalt u bij ons slechts €75. Wij halen u op in heel Wormerveer, of u nu aan de Zaan woont of in de buurt van het Guisveld. Onze taxi\'s zijn modern en onze chauffeurs uiterst punctueel.',
    faq: [
      { question: "Hoe lang duurt een taxi rit van Wormerveer naar Schiphol?", answer: "De reistijd bedraagt gemiddeld 25 minuten." },
      { question: "Kan ik een factuur krijgen voor mijn zakelijke rit uit Wormerveer?", answer: "Ja, wij kunnen op verzoek een factuur sturen voor uw administratie." }
    ]
  },
  zaandam: {
    slug: 'zaandam',
    name: 'Zaandam',
    title: 'Taxi Zaandam Schiphol €75 - De Goedkoopste & Beste',
    description: 'Taxi Zaandam Schiphol nodig? Reis voor een vast tarief van €75. 24/7 service in heel Zaandam. Veilig, snel en comfortabel. Boek nu!',
    content: 'Als grootste stad in de Zaanstreek heeft Zaandam een grote behoefte aan goed luchthavenvervoer. Wij bedienen alle wijken: van Poelenburg tot Westerwatering en van het Centrum tot Zaandam-Zuid. Voor €75 bent u verzekerd van een top-service naar Schiphol.',
    faq: [
      { question: "Wat is de prijs voor een taxi van Zaandam naar Schiphol?", answer: "Wij rekenen een vast tarief van €75 vanuit heel Zaandam." },
      { question: "Waar staat de taxi op Schiphol als ik terugkom naar Zaandam?", answer: "Wij spreken vaak af bij de STA balie of bij de vertrekhal boven, afhankelijk van uw voorkeur." }
    ]
  },
  zaandijk: {
    slug: 'zaandijk',
    name: 'Zaandijk',
    title: 'Taxi Zaandijk Schiphol €75 | Vast Tarief | ZaanTaxi',
    description: 'Taxi van Zaandijk naar Schiphol voor slechts €75. Betrouwbaar vervoer vanuit Oud-Zaandijk en Rooswijk. Reserveer direct online.',
    content: 'Woont u in Zaandijk of Rooswijk en zoekt u een taxi naar Schiphol? Wij brengen u voor €75 comfortabel naar de luchthaven. Onze chauffeurs zijn bekend met de toeristische drukte rond de Zaanse Schans en weten altijd de snelste weg te vinden.',
    faq: [
      { question: "Geldt de prijs van €75 ook voor Rooswijk?", answer: "Ja, Rooswijk valt onder Zaandijk en daarvoor geldt ook het vaste tarief van €75." },
      { question: "Is de taxi in Zaandijk 24 uur per dag beschikbaar?", answer: "Zeker, wij zijn dag en nacht operationeel voor al uw ritten naar Schiphol." }
    ]
  }
};
