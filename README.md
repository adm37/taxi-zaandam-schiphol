<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your Astro app

This contains everything you need to run your app locally with Astro.

View your app in AI Studio: https://ai.studio/apps/d1616609-bfe3-4731-ae95-a275365e633f

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Google Maps autocomplete (booking form)

Voor adres-autocomplete in het boekingsformulier moet tijdens build/deploy een Google Maps key beschikbaar zijn via één van deze variabelen:

- `PUBLIC_GOOGLE_MAPS_API_KEY` (aanbevolen)
- `VITE_GOOGLE_MAPS_API_KEY`
- `GOOGLE_MAPS_API_KEY` (fallback)

Zorg ook dat in Google Cloud de **Places API** en **Maps JavaScript API** aan staan, en dat de HTTP referrer van je live domein is toegestaan.

## Hosting op Hostinger (zonder Netlify)

Deze website draait op Hostinger en gebruikt PHP-endpoints in `public/api`.

Belangrijk:

- Gebruik voor boekingen en admin alleen ` /api/bookings.php`.
- Vul databasegegevens in via `public/api/config.php`.
- Netlify functions zijn niet nodig in productie op Hostinger.

## Boekingen opslaan in Hostinger database

Het admin-gedeelte en nieuwe boekingen gebruiken `/api/bookings.php` en slaan data op in je Hostinger MySQL database.

Stappen:

1. Open [public/api/config.php](public/api/config.php)
2. Vul je databasegegevens in:
   - `'db_host'` (op Hostinger vaak `localhost` als DB op hetzelfde hostingaccount staat)
   - `'db_port'` (meestal `3306`)
   - `'db_name'`
   - `'db_user'`
   - `'db_password'`
   - `'db_table'` (bijv. `bookings`)
3. Upload/deploy je site inclusief de map `api` in de webroot.

De tabel wordt automatisch aangemaakt bij de eerste request. Als je liever handmatig maakt:

```sql
CREATE TABLE IF NOT EXISTS bookings (
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
   PRIMARY KEY (id),
   KEY idx_created_at (created_at)
);
```

Zonder correcte waarden in [public/api/config.php](public/api/config.php) retourneert de endpoint een fout en worden boekingen niet opgeslagen.

## Build

Use:
`npm run build`

Preview production build:
`npm run preview`
