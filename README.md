# 🧮 إحسب بذكاء | Ihsb Bthka'a - AI Educational Platform

## Overview

**إحسب بذكاء** (Calculate Smartly) is a modern educational platform for learning mathematics with AI-powered assistance and subscription-based premium features.

## Architecture

```
/workspace
├── frontend/          # Static HTML/CSS/JS (existing site)
├── backend/           # NestJS API server
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── subscriptions/
│   │   │   ├── payments/
│   │   │   └── ai/
│   │   ├── common/
│   │   └── config/
│   ├── prisma/
│   └── .env
└── README.md
```

## Tech Stack

### Frontend
- HTML5, CSS3, JavaScript
- Tailwind CSS (via CDN)
- Tabler Icons
- Google Fonts (Tajawal, Inter)

### Backend
- **Runtime**: Node.js 20+
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **AI**: Anthropic Claude API
- **Auth**: JWT + Passport
- **Payments**: Stripe/PayPal abstraction

## Features

### Math Tools (Free)
- Calculator
- Perimeter calculations
- Area calculations
- Volume calculations
- Pythagorean theorem
- Negative numbers
- Fractions
- Percentages

### AI Educational System (Subscription Required)

#### Free Plan ($0/month)
- Limited AI usage (10 requests/day)
- Basic math solver
- Access to free tools

#### Pro Plan ($10/month)
- Claude Haiku 4.5
- Higher usage limits (500 requests/month)
- Math solver with steps
- Quiz generator
- Study assistant
- Flashcards

#### Premium Plan ($25/month)
- Claude Opus 4.8
- Very high usage limits (2000 requests/month)
- Advanced reasoning
- Complex problem solving
- Detailed explanations
- Priority support

## Installation

### Prerequisites
- Node.js 20+
- PostgreSQL 14+
- npm or pnpm

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env with your credentials

# Run database migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Start development server
npm run start:dev
```

### Environment Variables

Create `.env` file based on `.env.example`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ihsb_db?schema=public"

# Authentication
AUTH_SECRET="your-super-secret-key-min-32-chars"
JWT_EXPIRATION="7d"

# Anthropic AI
ANTHROPIC_API_KEY="sk-ant-..."

# Payments (Stripe example)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
PAYMENT_PROVIDER="stripe"

# Server
PORT=3001
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
```

### Frontend Setup

The frontend is already built and ready to use. Simply serve the static files:

```bash
# Using Python
python3 -m http.server 3000

# Using Node.js
npx serve .

# Or deploy to any static hosting (Vercel, Netlify, etc.)
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/profile` - Get user profile
- `PATCH /api/users/profile` - Update profile
- `GET /api/users/usage` - Get AI usage stats

### Subscriptions
- `GET /api/subscriptions/plans` - Get available plans
- `GET /api/subscriptions/current` - Get current subscription
- `POST /api/subscriptions/upgrade` - Upgrade plan
- `POST /api/subscriptions/cancel` - Cancel subscription
- `POST /api/subscriptions/webhook` - Payment webhook

### AI
- `POST /api/ai/chat` - Send AI message
- `POST /api/ai/solve` - Solve math problem
- `POST /api/ai/quiz` - Generate quiz
- `POST /api/ai/study` - Study assistant
- `POST /api/ai/flashcards` - Generate flashcards

## Database Schema

### Tables
- `users` - User accounts
- `subscriptions` - Subscription status
- `plans` - Available plans
- `ai_usage` - AI usage tracking
- `ai_requests` - Individual AI requests
- `payments` - Payment records

## AI Model Routing

```
User Request → AI Router → Model Selection
                    ↓
        Free → Limited AI (basic responses)
        Pro → Claude Haiku 4.5
        Premium → Claude Opus 4.8
```

## Usage Tracking

The system tracks:
- Input tokens
- Output tokens
- Total tokens
- Model used
- Request type
- Estimated cost
- Timestamp

## Security

- JWT authentication
- Password hashing (bcrypt)
- Rate limiting
- Input validation
- CORS protection
- Helmet security headers
- SQL injection prevention (Prisma ORM)
- XSS protection

## Testing

```bash
cd backend
npm run test
npm run test:e2e
```

## Deployment

### Backend
```bash
# Build
npm run build

# Start production
npm run start:prod
```

### Frontend
Deploy static files to any CDN or hosting service.

## Monitoring

Track these metrics:
- Total users
- Active subscriptions
- AI requests (daily/monthly)
- Token usage
- API costs
- Revenue
- Profit margins

## License

MIT

## Support

For issues or questions, contact the development team.
