# Holiday Party 2024

A festive web app built with Next.js to add some flare to a holiday party.

Fork and customize this repo for your own party. And feel free to contribute improvements via pull requests.

My party, deployed with guest access, lives at [swankycocktailparty.xyz](https://swankycocktailparty.xyz). 

### Author
[Lana Z](https://www.linkedin.com/in/lanazumbrunn/)

## Tech Stack / Resources

- [v0](https://v0.dev) - AI tool for app planning and design
- [shadcn/ui](https://ui.shadcn.com) - UI component library
- [Windsurf](https://codeium.com/windsurf) - AI enabled code editor
- [Next.js](https://nextjs.org) - React framework
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Namecheap](https://www.namecheap.com) - Custom domain
- [Vercel](https://vercel.com) - Hosting platform
- [Redis](https://redis.io/cloud/) - Database

### My AI Development Workflow*
**greyed out resources were not used in this project*
![AI Workflow](/public/images/ai-dev-workflow.png)

## Features & Security

- RSVP system with plus-one option and dietary restrictions
- Guest chat/message board with real-time updates
- Responsive party invitation for mobile browsers
- Add to Google Calendar functionality
- Custom domain
- Guest-only access system with authentication via 4-digit code
- Real-time Redis database integration
- Admin panel for managing RSVPs
- CORS protection via Vercel/Next.js API routes
- Basic rate limiting and DDoS protection via Vercel
- Built-in CSRF protection for Next.js form submissions
- Environment variable configuration
- No sensitive data exposed in client-side code

### Security considerations:
This application is designed for casual event RSVP management and is not intended for handling highly sensitive data.
- Guest codes are stored in localStorage for convenience without HTTP-only cookies
- Add application-level rate limiting for the endpoint `/api/verify-guest` for increased security


## Admin Access
After setting up your admin token, access the admin panel at `/admin` and use your token to:
- View all RSVPs
- Reset guest or delete test RSVPs

## Get Started

1. Fork the repository

2. Clone your forked repository
```bash
git clone https://github.com/YOUR-USERNAME/holiday-party-2024.git
```

3. Navigate to the project directory
```bash
cd holiday-party-2024
```

4. Install dependencies
```bash
cd holiday-party-2024
npm install
```

5. Run the development server
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser ✨

7. Copy the .env.template file, rename it to `.env.local`, and add your guest list to the `.env.local` file
```bash
GUEST_LIST={"0000":"Guest1", "1111":"Guest2"}
```

8. Add your party address to the `.env.local` file
```bash
PARTY_ADDRESS="Your party address"
```

9. Deploy to Vercel adding your environment variables
    
    Vercel // Settings // Environment Variables

10. Configure your data storage within Vercel using Redis

    Vercel // Storage // Create Database // Redis Cloud

11. Configure your custom domain (optional)

    Vercel // Domains // Add Domain
    
    Follow the DNS configuration instructions from Vercel    

12. Add your Redis URL to the `.env.local` file
```bash
REDIS_URL="your-redis-url"

REDIS_TOKEN="your-redis-token"
```

13. Generate a secure random token for the admin panel 
```bash
openssl rand -hex 32
```

14. Add your token to the `.env.local` file and when prompted in the browser admin panel
```bash
ADMIN_TOKEN="your-admin-token"
```

### Happy holidays and happy event planning! 🎄
