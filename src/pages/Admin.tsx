import React, { useEffect, useMemo, useState } from 'react';

type Booking = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  pickup: string;
  destination: string;
  date: string;
  time: string;
  passengers: number;
  suitcases: number;
  vehicleType: string;
  paymentMethod: string;
  totalPrice: number;
};

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'Kastamonuadem37!';
const SESSION_KEY = 'admin-auth-token';

export default function Admin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isLoggedIn = useMemo(() => token.length > 0, [token]);

  const loadBookings = async (activeToken: string) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/bookings.php', {
        method: 'GET',
        headers: {
          Authorization: `Basic ${activeToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('unauthorized');
        }

        throw new Error('endpoint-error');
      }

      const data = (await response.json()) as { bookings?: Booking[] };
      setBookings(Array.isArray(data.bookings) ? data.bookings : []);
    } catch (error) {
      if (error instanceof Error && error.message === 'unauthorized') {
        setErrorMessage('Inloggen mislukt of ritten konden niet geladen worden.');
      } else {
        setErrorMessage('Ritten konden niet geladen worden uit de database.');
      }

      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const savedToken = sessionStorage.getItem(SESSION_KEY) || '';
    if (!savedToken) {
      return;
    }

    setToken(savedToken);
    loadBookings(savedToken);
  }, []);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      setErrorMessage('Onjuiste gebruikersnaam of wachtwoord.');
      return;
    }

    const encodedToken = btoa(`${username}:${password}`);
    setToken(encodedToken);
    sessionStorage.setItem(SESSION_KEY, encodedToken);
    await loadBookings(encodedToken);
  };

  const handleLogout = () => {
    setToken('');
    setBookings([]);
    setUsername('');
    setPassword('');
    setErrorMessage('');
    sessionStorage.removeItem(SESSION_KEY);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white rounded-2xl border border-stone-200 shadow-sm p-8">
          <h1 className="text-2xl font-bold text-stone-900 mb-2">Admin dashboard</h1>
          <p className="text-sm text-stone-500 mb-6">Log in om alle ritten te bekijken.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-400 uppercase mb-2">Gebruikersnaam</label>
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-400 uppercase mb-2">Wachtwoord</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors"
            >
              Inloggen
            </button>
          </form>

          {errorMessage && <p className="text-sm text-red-600 mt-4">{errorMessage}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-stone-900">Admin dashboard</h1>
            <p className="text-stone-500">Alle binnengekomen ritten</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => loadBookings(token)}
              className="px-4 py-2 rounded-xl border border-stone-300 bg-white text-stone-700 hover:bg-stone-50"
            >
              Vernieuwen
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-stone-900 text-white hover:bg-stone-800"
            >
              Uitloggen
            </button>
          </div>
        </div>

        {errorMessage && <p className="text-sm text-red-600 mb-4">{errorMessage}</p>}

        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[1100px]">
              <thead className="bg-stone-50 text-stone-600 text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3">Binnengekomen</th>
                  <th className="px-4 py-3">Naam</th>
                  <th className="px-4 py-3">Telefoon</th>
                  <th className="px-4 py-3">Ophaaladres</th>
                  <th className="px-4 py-3">Bestemming</th>
                  <th className="px-4 py-3">Datum</th>
                  <th className="px-4 py-3">Tijd</th>
                  <th className="px-4 py-3">Passagiers</th>
                  <th className="px-4 py-3">Koffers</th>
                  <th className="px-4 py-3">Voertuig</th>
                  <th className="px-4 py-3">Betaling</th>
                  <th className="px-4 py-3">Prijs</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={12} className="px-4 py-8 text-center text-stone-500">
                      Laden...
                    </td>
                  </tr>
                ) : bookings.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="px-4 py-8 text-center text-stone-500">
                      Nog geen ritten gevonden.
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <tr key={booking.id} className="border-t border-stone-100 text-sm text-stone-700">
                      <td className="px-4 py-3 whitespace-nowrap">{new Date(booking.createdAt).toLocaleString('nl-NL')}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{booking.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{booking.phone}</td>
                      <td className="px-4 py-3">{booking.pickup}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{booking.destination}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{booking.date}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{booking.time}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{booking.passengers}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{booking.suitcases}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{booking.vehicleType}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{booking.paymentMethod}</td>
                      <td className="px-4 py-3 whitespace-nowrap">€{booking.totalPrice}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
