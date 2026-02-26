const fs = require('node:fs');
const path = require('node:path');

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'Kastamonuadem37!';

const dataDir = process.env.BOOKINGS_DATA_DIR || path.join(process.cwd(), '.data');
const dataFilePath = path.join(dataDir, 'bookings.json');

function ensureDataFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, '[]', 'utf8');
  }
}

function readBookings() {
  ensureDataFile();
  const raw = fs.readFileSync(dataFilePath, 'utf8');
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : [];
}

function writeBookings(bookings) {
  ensureDataFile();
  fs.writeFileSync(dataFilePath, JSON.stringify(bookings, null, 2), 'utf8');
}

function unauthorizedResponse() {
  return {
    statusCode: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Admin dashboard"',
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
    body: JSON.stringify({ error: 'Unauthorized' }),
  };
}

function isAuthorized(headers = {}) {
  const authHeader = headers.authorization || headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false;
  }

  const encoded = authHeader.slice(6).trim();
  let decoded = '';

  try {
    decoded = Buffer.from(encoded, 'base64').toString('utf8');
  } catch {
    return false;
  }

  const separatorIndex = decoded.indexOf(':');
  if (separatorIndex === -1) {
    return false;
  }

  const username = decoded.slice(0, separatorIndex);
  const password = decoded.slice(separatorIndex + 1);

  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

exports.handler = async (event) => {
  if (event.httpMethod === 'GET') {
    if (!isAuthorized(event.headers)) {
      return unauthorizedResponse();
    }

    try {
      const bookings = readBookings();
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
        body: JSON.stringify({ bookings }),
      };
    } catch {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Could not read bookings' }),
      };
    }
  }

  if (event.httpMethod === 'POST') {
    try {
      const payload = JSON.parse(event.body || '{}');

      const requiredFields = ['name', 'phone', 'pickup', 'destination', 'date', 'time'];
      const missingField = requiredFields.find((field) => !String(payload[field] || '').trim());

      if (missingField) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: `Missing field: ${missingField}` }),
        };
      }

      const bookings = readBookings();
      const booking = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        createdAt: new Date().toISOString(),
        name: String(payload.name || '').trim(),
        phone: String(payload.phone || '').trim(),
        pickup: String(payload.pickup || '').trim(),
        destination: String(payload.destination || '').trim(),
        date: String(payload.date || '').trim(),
        time: String(payload.time || '').trim(),
        passengers: Number(payload.passengers || 1),
        suitcases: Number(payload.suitcases || 0),
        vehicleType: String(payload.vehicleType || '').trim(),
        paymentMethod: String(payload.paymentMethod || '').trim(),
        totalPrice: Number(payload.totalPrice || 0),
      };

      bookings.unshift(booking);
      writeBookings(bookings.slice(0, 2000));

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
        body: JSON.stringify({ ok: true, bookingId: booking.id }),
      };
    } catch {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Could not save booking' }),
      };
    }
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ error: 'Method not allowed' }),
  };
};
