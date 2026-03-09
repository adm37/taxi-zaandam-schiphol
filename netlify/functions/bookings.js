const mysql = require('mysql2/promise');

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'Kastamonuadem37!';

const DB_HOST = process.env.HOSTINGER_DB_HOST;
const DB_PORT = Number(process.env.HOSTINGER_DB_PORT || 3306);
const DB_USER = process.env.HOSTINGER_DB_USER;
const DB_PASSWORD = process.env.HOSTINGER_DB_PASSWORD;
const DB_NAME = process.env.HOSTINGER_DB_NAME;
const DB_TABLE = process.env.HOSTINGER_DB_TABLE || 'bookings';
const SAFE_TABLE_NAME = /^[a-zA-Z0-9_]+$/.test(DB_TABLE) ? DB_TABLE : null;

let pool;
let ensureTablePromise;

function isLocalHost(hostname) {
  const normalized = String(hostname || '').trim().toLowerCase();
  return normalized === 'localhost' || normalized === '127.0.0.1' || normalized === '::1';
}

function isInvalidNetlifyHost() {
  return Boolean(process.env.NETLIFY && isLocalHost(DB_HOST));
}

function hasDatabaseConfig() {
  return Boolean(DB_HOST && DB_USER && DB_PASSWORD && DB_NAME && SAFE_TABLE_NAME && !isInvalidNetlifyHost());
}

function getPool() {
  if (!hasDatabaseConfig()) {
    throw new Error('missing-db-config');
  }

  if (!pool) {
    pool = mysql.createPool({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      connectionLimit: 5,
      waitForConnections: true,
      queueLimit: 0,
      timezone: 'Z',
    });
  }

  return pool;
}

async function ensureTableExists() {
  if (!ensureTablePromise) {
    const createTableSql = `CREATE TABLE IF NOT EXISTS ${SAFE_TABLE_NAME} (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      name VARCHAR(120) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      pickup VARCHAR(255) NOT NULL,
      destination VARCHAR(255) NOT NULL,
      date VARCHAR(30) NOT NULL,
      time VARCHAR(30) NOT NULL,
      passengers INT NOT NULL DEFAULT 1,
      suitcases INT NOT NULL DEFAULT 0,
      vehicle_type VARCHAR(80) NOT NULL,
      payment_method VARCHAR(80) NOT NULL,
      total_price DECIMAL(10,2) NOT NULL DEFAULT 0,
      return_pickup VARCHAR(255) NULL,
      return_destination VARCHAR(255) NULL,
      return_date VARCHAR(30) NULL,
      return_time VARCHAR(30) NULL,
      PRIMARY KEY (id),
      KEY idx_created_at (created_at)
    )`;

    ensureTablePromise = (async () => {
      await getPool().query(createTableSql);

      const requiredColumns = [
        ['return_pickup', `ALTER TABLE ${SAFE_TABLE_NAME} ADD COLUMN return_pickup VARCHAR(255) NULL AFTER total_price`],
        ['return_destination', `ALTER TABLE ${SAFE_TABLE_NAME} ADD COLUMN return_destination VARCHAR(255) NULL AFTER return_pickup`],
        ['return_date', `ALTER TABLE ${SAFE_TABLE_NAME} ADD COLUMN return_date VARCHAR(30) NULL AFTER return_destination`],
        ['return_time', `ALTER TABLE ${SAFE_TABLE_NAME} ADD COLUMN return_time VARCHAR(30) NULL AFTER return_date`],
      ];

      for (const [columnName, alterSql] of requiredColumns) {
        const [rows] = await getPool().query(`SHOW COLUMNS FROM ${SAFE_TABLE_NAME} LIKE ?`, [columnName]);
        if (!Array.isArray(rows) || rows.length === 0) {
          await getPool().query(alterSql);
        }
      }
    })();
  }

  await ensureTablePromise;
}

function toSafeInt(value, fallback) {
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toSafeNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
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
  if (isInvalidNetlifyHost()) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
      body: JSON.stringify({
        error:
          'HOSTINGER_DB_HOST is set to localhost, which is not reachable from Netlify. Use your Hostinger remote MySQL host from hPanel.',
      }),
    };
  }

  if (event.httpMethod === 'GET') {
    if (!isAuthorized(event.headers)) {
      return unauthorizedResponse();
    }

    if (!hasDatabaseConfig()) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
        body: JSON.stringify({ error: 'Missing Hostinger database configuration' }),
      };
    }

    try {
      await ensureTableExists();

      const [rows] = await getPool().query(
        `SELECT
          id,
          created_at AS createdAt,
          name,
          phone,
          pickup,
          destination,
          date,
          time,
          passengers,
          suitcases,
          vehicle_type AS vehicleType,
          payment_method AS paymentMethod,
          total_price AS totalPrice,
          return_pickup AS returnPickup,
          return_destination AS returnDestination,
          return_date AS returnDate,
          return_time AS returnTime
        FROM ${SAFE_TABLE_NAME}
        ORDER BY created_at DESC
        LIMIT 2000`
      );

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
        body: JSON.stringify({ bookings: rows }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
        body: JSON.stringify({ error: 'Could not read bookings from database' }),
      };
    }
  }

  if (event.httpMethod === 'POST') {
    if (!hasDatabaseConfig()) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
        body: JSON.stringify({ error: 'Missing Hostinger database configuration' }),
      };
    }

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

      const booking = {
        name: String(payload.name || '').trim(),
        phone: String(payload.phone || '').trim(),
        pickup: String(payload.pickup || '').trim(),
        destination: String(payload.destination || '').trim(),
        date: String(payload.date || '').trim(),
        time: String(payload.time || '').trim(),
        passengers: toSafeInt(payload.passengers, 1),
        suitcases: toSafeInt(payload.suitcases, 0),
        vehicleType: String(payload.vehicleType || '').trim(),
        paymentMethod: String(payload.paymentMethod || '').trim(),
        totalPrice: toSafeNumber(payload.totalPrice, 0),
        returnPickup: String(payload.returnPickup || '').trim(),
        returnDestination: String(payload.returnDestination || '').trim(),
        returnDate: String(payload.returnDate || '').trim(),
        returnTime: String(payload.returnTime || '').trim(),
      };

      await ensureTableExists();

      const insertSql = `INSERT INTO ${SAFE_TABLE_NAME}
        (
          name,
          phone,
          pickup,
          destination,
          date,
          time,
          passengers,
          suitcases,
          vehicle_type,
          payment_method,
          total_price,
          return_pickup,
          return_destination,
          return_date,
          return_time
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const [result] = await getPool().execute(insertSql, [
        booking.name,
        booking.phone,
        booking.pickup,
        booking.destination,
        booking.date,
        booking.time,
        booking.passengers,
        booking.suitcases,
        booking.vehicleType,
        booking.paymentMethod,
        booking.totalPrice,
        booking.returnPickup || null,
        booking.returnDestination || null,
        booking.returnDate || null,
        booking.returnTime || null,
      ]);

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
        body: JSON.stringify({ ok: true, bookingId: result.insertId }),
      };
    } catch {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
        body: JSON.stringify({ error: 'Could not save booking to database' }),
      };
    }
  }

  if (event.httpMethod === 'DELETE') {
    if (!isAuthorized(event.headers)) {
      return unauthorizedResponse();
    }

    if (!hasDatabaseConfig()) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
        body: JSON.stringify({ error: 'Missing Hostinger database configuration' }),
      };
    }

    try {
      await ensureTableExists();

      const payload = JSON.parse(event.body || '{}');
      const bookingId = Number.parseInt(String(payload.id ?? ''), 10);

      if (!Number.isInteger(bookingId) || bookingId <= 0) {
        return {
          statusCode: 400,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
          body: JSON.stringify({ error: 'Missing or invalid booking id' }),
        };
      }

      const [result] = await getPool().execute(`DELETE FROM ${SAFE_TABLE_NAME} WHERE id = ? LIMIT 1`, [bookingId]);

      if (!result || result.affectedRows === 0) {
        return {
          statusCode: 404,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
          body: JSON.stringify({ error: 'Booking not found' }),
        };
      }

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
        body: JSON.stringify({ ok: true, deletedId: bookingId }),
      };
    } catch {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
        body: JSON.stringify({ error: 'Could not delete booking' }),
      };
    }
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ error: 'Method not allowed' }),
  };
};
