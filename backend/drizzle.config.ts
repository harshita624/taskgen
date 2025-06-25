import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/models/schema.ts', // path to your schema file
  out: './drizzle', // output directory for migrations
  dialect: 'postgresql', // specify the dialect instead
  dbCredentials: {
    url: process.env.DATABASE_URL!, // your database connection string
  },
});