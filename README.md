# Produktsannons-plattform




## Innehållsförteckning
- [Introduktion](#introduktion)
- [Teknisk Stack](#teknisk-stack)
- [Installation](#installation)
- [Funktionalitet](#funktionalitet)
- [Deployment](#deployment)
- [Miljövariabler](#miljövariabler)


## Introduktion

Antiq är en modern fullstack-applikation som låter användare skapa, hantera och interagera med Antikvitetssannonser. Plattformen riktar sig till både privatpersoner och experter inom branschen, med särskilda funktioner för varje användargrupp.

### Huvudfunktioner
- Användarhantering med säker autentisering
- Publicering och hantering av annonser
- Möjlighet att följa intressanta annonser
- Specialfunktioner för expertanvändare (offerthantering)
- Administrativt gränssnitt för innehåll och användarmoderering

## Teknisk Stack

### Frontend
- React med TypeScript för typsäker utveckling
- Tailwind CSS för responsiv design och styling

### Backend
- Express.js som server-ramverk
- MongoDB Atlas för databashantering
- JWT (JSON Web Tokens) för säker autentisering

### Tredjepartstjänster
- Cloudinary för bildhantering och -lagring
- Netlify för frontend-hosting
- Render för backend-hosting
- Bcrypt för hashade lösenord
- [React-hot-toast](https://react-hot-toast.com/docs) för snygga notifikationer.
- [React-confirm-alert](https://www.npmjs.com/package/react-confirm-alert) för snyggare windows:alert().

## Installation

### Förutsättningar
- Node.js (version 14 eller senare)
- npm (Node Package Manager)
- Git
- Konton på MongoDB Atlas och Cloudinary

### Steg-för-steg Guide

1. **Klona Repositoryt**
   ```bash
   git clone https://github.com/chas-academy/u09-fullstack-js-HarveyBong.git
   cd u09-Fullstack
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

   Skapa en `.env`-fil i backend-mappen med följande innehåll:
   ```env
   MONGO_URL=din-mongodb-url
   JWT_SECRET=din-jwt-secret
   CLOUDINARY_URL=din-cloudinary-url
   CLOUDINARY_API_KEY=din-cloudinary-api-nyckel
   CLOUDINARY_API_SECRET=din-cloudinary-api-secret
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Starta Utvecklingsservrarna**
   
   Backend:
   ```bash
   cd backend
   npm start
   ```

   Frontend:
   ```bash
   cd frontend
   npm run dev
   ```

## Funktionalitet

### Användarfunktioner

1. **Autentisering**
   - Registrering av nytt konto
   - Inloggning med e-post och lösenord
   - Säker sessionshantering med JWT

2. **Annonshantering**
   - Skapa nya annonser
   - Laddar upp bild kopplat till annonsen
   - Visa lista över Skapade annonser
   - Ta bort egna annonser

3. **Interaktiva Funktioner**
   - Följ intressanta annonser
   - Visa lista över följda annonser
   - Skicka offerter (endast tillgängligt för expertanvändare)

### Administratörsfunktioner

1. **Användarhantering**
   - Visa lista över alla användare
   - Skapa användare
   - Ta bort eller ändra användarkonton vid behov

2. **Annonsmoderering**
   - Granska alla publicerade annonser
   - Ta bort olämpligt innehåll

## Deployment

### Frontend Deployment (Netlify)

1. **Förbered Frontend-bygget**
   ```bash
   cd frontend
   npm run build
   ```

2. **Konfigurera Netlify**
   - Skapa ett nytt projekt på Netlify
   - Välj "Deploy manually"
   - Dra och släpp `build`-mappen till Netlify's deploymentyta
   
   Alternativt, för kontinuerlig deployment:
   - Koppla ditt GitHub-repo till Netlify
   - Sätt byggkommandot till `npm run build`
   - Ange `build` som publiceringskatalog

### Backend Deployment (Render)

1. **Förbered Backend**
   - Skapa ett konto på Render
   - Välj "New Web Service"
   - Koppla till ditt GitHub-repo

2. **Konfigurera Render**
   - Välj huvudbranch för deployment
   - Sätt byggkommandot till `npm install`
   - Sätt startkommandot till `npm start`
   
3. **Konfigurera Miljövariabler**
   - Gå till "Environment" i Render dashboard
   - Lägg till alla variabler från din `.env`-fil

## Miljövariabler

Backend kräver följande miljövariabler i `.env`-filen:

```env
# Databas
MONGO_URL=din-mongodb-url

# Autentisering
JWT_SECRET=din-jwt-secret

# Cloudinary Konfiguration
CLOUDINARY_URL=din-cloudinary-url
CLOUDINARY_API_KEY=din-cloudinary-api-nyckel
CLOUDINARY_API_SECRET=din-cloudinary-api-hemlighet

VITE_RENDER_URL=din-backend-url
```

Alla dessa variabler måste vara korrekt konfigurerade för att applikationen ska fungera.



