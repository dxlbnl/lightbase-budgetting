# Lightbase assesment

I'm to create a budgetting tool so teams can get insight into their budget. Budget are only valid for a certain period. 

## Tech stack

This project is setup with sveltekit, a nice app framework I'm pretty familiar with. 
For the DB layer I'm using NEON (PG) with Drizzle ORM
Drizzle makes for a nice ORM layer, especially when using Zod for types. 
Neon is a Postgres DB, so thats nice. I'm familiar with PG, and have used Neon a few times.

## Setup neon DB
Setup a neon db, and connect it to the application by creating a .env file:

```
DATABASE_URL=<paste here the neon connection string>
```

## Developing

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
