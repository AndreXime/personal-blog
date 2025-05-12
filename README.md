# Personal Blog

A modern blog application built with Next.js, Prisma, and Tailwind CSS.

## Features

- Modern, responsive design
- Dark mode support
- Content organization with categories and tags
- Search functionality
- Comment system
- Social sharing

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database

### Installation

1. Clone the repository:

\`\`\`bash
git clone https://github.com/yourusername/personal-blog.git
cd personal-blog
\`\`\`

2. Install dependencies:

\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:

Create a `.env` file in the root directory with the following variables:

\`\`\`
POSTGRES_PRISMA_URL=postgresql://username:password@localhost:5432/personal_blog
NEXT_PUBLIC_BASE_URL=http://localhost:3000
\`\`\`

4. Set up the database:

\`\`\`bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed the database
npm run prisma:seed
\`\`\`

5. Start the development server:

\`\`\`bash
npm run dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Management

This project uses Prisma ORM to interact with the database. Here are some useful commands:

- Generate Prisma client: `npm run prisma:generate`
- Run migrations: `npm run prisma:migrate`
- Open Prisma Studio: `npm run prisma:studio`
- Seed the database: `npm run prisma:seed`

## Deployment

The easiest way to deploy this application is using Vercel:

1. Push your code to a GitHub repository.
2. Import the project in Vercel.
3. Set up the required environment variables.
4. Deploy!

## License

This project is licensed under the MIT License.
