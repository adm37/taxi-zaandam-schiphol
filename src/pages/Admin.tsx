import React, { useEffect, useMemo, useState } from 'react';
import { Trash2 } from 'lucide-react';

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
  returnPickup?: string;
  returnDestination?: string;
  returnDate?: string;
  returnTime?: string;
};

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'Kastamonuadem37!';
const SESSION_KEY = 'admin-auth-token';

export default function Admin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [dateSortOrder, setDateSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(false);
  const [deletingBookingId, setDeletingBookingId] = useState<string | null>(null);
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

  const handleDeleteBooking = async (bookingId: string) => {
    if (!token) {
      return;
    }

    const confirmed = window.confirm('Weet je zeker dat je deze boeking wilt verwijderen?');
    if (!confirmed) {
      return;
    }

    setDeletingBookingId(bookingId);
    setErrorMessage('');

    try {
      const response = await fetch('/api/bookings.php', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${token}`,
        },
        body: JSON.stringify({ id: bookingId }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('unauthorized');
        }

        throw new Error('delete-failed');
      }

      setBookings((previous) => previous.filter((booking) => booking.id !== bookingId));
    } catch (error) {
      if (error instanceof Error && error.message === 'unauthorized') {
        setErrorMessage('Sessie verlopen. Log opnieuw in om boekingen te verwijderen.');
      } else {
        setErrorMessage('Boeking kon niet verwijderd worden. Probeer het opnieuw.');
      }
    } finally {
      setDeletingBookingId(null);
    }
  };

  const parseBookingDate = (value: string): number => {
    const trimmed = value.trim();
    if (!trimmed) {
      return 0;
    }

    const dutchStyleMatch = trimmed.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
    if (dutchStyleMatch) {
      const day = Number(dutchStyleMatch[1]);
      const month = Number(dutchStyleMatch[2]);
      const year = Number(dutchStyleMatch[3]);

      const parsed = new Date(year, month - 1, day);
      if (
        parsed.getFullYear() === year &&
        parsed.getMonth() === month - 1 &&
        parsed.getDate() === day
      ) {
        return parsed.getTime();
      }
    }

    const isoStyleMatch = trimmed.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
    if (isoStyleMatch) {
      const year = Number(isoStyleMatch[1]);
      const month = Number(isoStyleMatch[2]);
      const day = Number(isoStyleMatch[3]);

      const parsed = new Date(year, month - 1, day);
      if (
        parsed.getFullYear() === year &&
        parsed.getMonth() === month - 1 &&
        parsed.getDate() === day
      ) {
        return parsed.getTime();
      }
    }

    const directDate = new Date(trimmed);
    if (!Number.isNaN(directDate.getTime())) {
      return directDate.getTime();
    }

    return 0;
  };

  const formatDateAsDayMonthYear = (value: Date): string => {
    const day = String(value.getDate()).padStart(2, '0');
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const year = value.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const buildNightRideLabel = (bookingDate: string, bookingTime: string): string | null => {
    const bookingDateTimestamp = parseBookingDate(bookingDate);
    if (!bookingDateTimestamp) {
      return null;
    }

    const timeMatch = bookingTime.trim().match(/^(\d{1,2}):(\d{2})$/);
    if (!timeMatch) {
      return null;
    }

    const hour = Number(timeMatch[1]);
    const minute = Number(timeMatch[2]);
    if (!Number.isInteger(hour) || !Number.isInteger(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      return null;
    }

    if (hour >= 7) {
      return null;
    }

    const rideDate = new Date(bookingDateTimestamp);
    const previousDate = new Date(rideDate);
    previousDate.setDate(previousDate.getDate() - 1);

    return `${formatDateAsDayMonthYear(previousDate)} → nacht van ${formatDateAsDayMonthYear(rideDate)} om ${bookingTime}`;
  };

  const getTripTypeLabel = (paymentMethod: string): string => {
    return paymentMethod.includes('Retour op metertarief') ? 'Retour op meter' : 'Enkele reis';
  };

  const sortedBookings = useMemo(() => {
    const direction = dateSortOrder === 'asc' ? 1 : -1;

    return [...bookings].sort((left, right) => {
      const leftDate = parseBookingDate(left.date);
      const rightDate = parseBookingDate(right.date);

      if (leftDate !== rightDate) {
        return (leftDate - rightDate) * direction;
      }

      const leftCreatedAt = new Date(left.createdAt).getTime() || 0;
      const rightCreatedAt = new Date(right.createdAt).getTime() || 0;
      return (leftCreatedAt - rightCreatedAt) * direction;
    });
  }, [bookings, dateSortOrder]);

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
              onClick={() => setDateSortOrder((current) => (current === 'desc' ? 'asc' : 'desc'))}
              className="px-4 py-2 rounded-xl border border-stone-300 bg-white text-stone-700 hover:bg-stone-50"
            >
              Sorteer ritdatum: {dateSortOrder === 'asc' ? 'vroegste eerst' : 'laatste eerst'}
            </button>
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
          <div>
            <table className="w-full text-left table-fixed">
              <thead className="bg-stone-50 text-stone-600 text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-3 py-3 w-[13%]">Binnengekomen</th>
                  <th className="px-3 py-3 w-[16%]">Klant</th>
                  <th className="px-3 py-3 w-[13%]">Rittype</th>
                  <th className="px-3 py-3 w-[25%]">Rit</th>
                  <th className="px-3 py-3 w-[18%]">Details</th>
                  <th className="px-3 py-3 w-[8%]">Prijs</th>
                  <th className="px-3 py-3 w-[7%]">Actie</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-stone-500">
                      Laden...
                    </td>
                  </tr>
                ) : sortedBookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-stone-500">
                      Nog geen ritten gevonden.
                    </td>
                  </tr>
                ) : (
                  sortedBookings.map((booking) => {
                    const nightRideLabel = buildNightRideLabel(booking.date, booking.time);

                    return (
                    <tr key={booking.id} className="border-t border-stone-100 text-sm text-stone-700 align-top">
                      <td className="px-3 py-3 break-words">{new Date(booking.createdAt).toLocaleString('nl-NL')}</td>
                      <td className="px-3 py-3 break-words">
                        <div className="font-semibold text-stone-900">{booking.name}</div>
                        <div className="text-xs text-stone-500 mt-1">{booking.phone}</div>
                      </td>
                      <td className="px-3 py-3 break-words">{getTripTypeLabel(booking.paymentMethod)}</td>
                      <td className="px-3 py-3 break-words">
                        <div className="font-medium text-stone-800">{booking.pickup}</div>
                        <div className="text-xs text-stone-500 mt-1">→ {booking.destination}</div>
                        <div className="text-xs text-stone-500 mt-1">{booking.date} om {booking.time}</div>
                        {booking.returnDate && booking.returnTime && (
                          <div className="text-xs text-emerald-700 mt-2">
                            Retour: {booking.returnPickup || '-'} → {booking.returnDestination || '-'} ({booking.returnDate} om {booking.returnTime})
                          </div>
                        )}
                        {nightRideLabel && (
                          <div className="text-xs text-stone-500 mt-1">
                            {nightRideLabel}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-3 break-words">
                        <div className="text-xs text-stone-600">Passagiers: {booking.passengers}</div>
                        <div className="text-xs text-stone-600">Koffers: {booking.suitcases}</div>
                        <div className="text-xs text-stone-600 mt-1">Voertuig: {booking.vehicleType}</div>
                        <div className="text-xs text-stone-600 mt-1">Betaling: {booking.paymentMethod}</div>
                      </td>
                      <td className="px-3 py-3 font-semibold text-stone-900">€{booking.totalPrice}</td>
                      <td className="px-3 py-3">
                        <button
                          type="button"
                          onClick={() => handleDeleteBooking(booking.id)}
                          disabled={deletingBookingId === booking.id}
                          className="w-8 h-8 rounded-lg border border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-50 inline-flex items-center justify-center"
                          aria-label="Verwijder boeking"
                          title="Verwijder boeking"
                        >
                          {deletingBookingId === booking.id ? (
                            <span className="text-[10px]">...</span>
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      </td>
                    </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
