# Holiday Party 2024 

A festive web application built with Next.js for our holiday celebration. Visit [swankyholidayparty.xyz](https://swankyholidayparty.xyz) to view the invitation (guest access required).

## Features

- Beautiful, responsive party invitation
- Secure guest authentication
- Add to Google Calendar functionality
- Mobile-friendly design
- Custom domain with SSL encryption

## Security

- Guest-only access system
- Environment variable configuration
- Secure API endpoints
- No sensitive data exposed in client-side code

## Tech Stack

- [Next.js](https://nextjs.org) - React framework
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Vercel](https://vercel.com) - Hosting platform

## Development

To run the development server locally:

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.template .env.local
# Edit .env.local with required values

# Start development server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser 

## Environment Variables

Required environment variables (see `.env.template`):
- `GUEST_LIST` - JSON string of guest information
- `PARTY_ADDRESS` - Party location details

## Deployment

The site is deployed on Vercel with custom domain configuration:
- Automatic HTTPS/SSL
- Edge network for fast global access
- Continuous deployment from main branch

## Author
Lana Zumbrunn

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)

Happy Holidays! 