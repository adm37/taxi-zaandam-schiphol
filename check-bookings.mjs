import mysql from 'mysql2/promise';

(async () => {
  try {
    const connection = await mysql.createConnection({
      host: 'srv2072.hstgr.io',
      user: 'u640661539_zaantaxischiph',
      password: 'Sadeceadem37!',
      database: 'u640661539_zaantaxischiph'
    });

    const [rows] = await connection.query('SELECT * FROM bookings ORDER BY created_at DESC LIMIT 20');
    
    console.log('=== BOEKINGEN UIT HOSTINGER DATABASE ===\n');
    console.log(`Totaal opgehaald: ${rows.length} boekingen\n`);
    
    rows.forEach((booking, idx) => {
      console.log(`[${idx + 1}] ${booking.name}`);
      console.log(`    Telefoon: ${booking.phone}`);
      console.log(`    Datum: ${booking.date} | Tijd: ${booking.time}`);
      console.log(`    Van: ${booking.pickup}`);
      console.log(`    Naar: ${booking.destination}`);
      console.log(`    Passagiers: ${booking.passengers} | Koffers: ${booking.suitcases}`);
      console.log(`    Voertuig: ${booking.vehicle_type}`);
      console.log(`    Prijs: €${booking.total_price} | Betaling: ${booking.payment_method}`);
      console.log(`    Geregistreerd: ${booking.created_at}\n`);
    });
    
    await connection.end();
  } catch (error) {
    console.error('Database error:', error.message);
    console.error('Code:', error.code);
    process.exit(1);
  }
})();
