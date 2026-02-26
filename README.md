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

## Contactformulier via Mail API (Netlify)

Het contactformulier gebruikt `/.netlify/functions/send-contact-email` en verstuurt e-mail via Resend.

Zet in Netlify bij **Site configuration → Environment variables**:

- `RESEND_API_KEY` = je Resend API key
- `CONTACT_FORM_TO_EMAIL` = `ademsade@gmail.com`
- `CONTACT_FORM_FROM_EMAIL` = geverifieerd afzenderadres in Resend (of laat fallback op `onboarding@resend.dev` voor testen)

## Build

Use:
`npm run build`

Preview production build:
`npm run preview`
