# Qr Attendns

A modern QR-based attendance web app built with Next.js. Qr Attendns lets users generate and scan QR codes for attendance tracking, and instantly notifies users when their QR code is scanned—whether for sign-in or sign-out. Includes a built-in QR generator and scanner, with a clean, responsive UI.

🔗**Live Site**: [https://koys-photos.vercel.app](https://koys-photos.vercel.app)

## Screenshots

<details>
<summary>Click to view screenshots</summary>

![Screenshot 1](public/ReadMe/pic01.png)
![Screenshot 2](public/ReadMe/pic02.png)

</details>

## Overview

**Qr Attendns** streamlines attendance management using QR codes. Users can generate personalized QR codes, scan codes for sign-in/out, and receive real-time notifications when their code is scanned. The app is designed for ease of use, security, and mobile responsiveness.

## Key Features

- **QR Code Generator:** Instantly create QR codes for names or identifiers.
- **QR Scanner:** Scan QR codes to record attendance (sign-in or sign-out).
- **Notifications:** Receive push notifications when your QR code is scanned.
- **Sign In/Out Toggle:** Easily switch between sign-in and sign-out modes.
- **Protected Pages:** Secure access to attendance features.
- **Modern UI:** Built with Tailwind CSS, Framer Motion, and shadcn/ui for a sleek experience.

## Tech Stack

- Next.js  
- React 
- Typescript
- Tailwind CSS  
- shadcn/ui  
- Prisma
- Vercel  

## Result

A fast, secure, and user-friendly attendance system that leverages QR codes and push notifications for real-time updates. Easily customizable for schools, events, or workplaces.

## Getting Started

```bash
# Clone the repository
git clone https://github.com/urUsername/qr-attendns.git
cd qr-attendns
```

```bash
# Install dependencies
npm install
```

```bash
# Copy the example environment file and update it with your values
cp .env.example .env
```

Edit the `.env` file and set the following variables:

- `DATABASE_URL` – Your database connection string (used by Prisma)
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY` – Your VAPID public key for push notifications
- `VAPID_PRIVATE_KEY` – Your VAPID private key for push notifications
- `NEXT_PUBLIC_PASSWORD` – Password for accessing protected pages

```bash
# Push Prisma schema to your database
npx prisma db push
```

```bash
# Start the development server
npm run dev
```

Then open `http://localhost:3000` in your browser.
