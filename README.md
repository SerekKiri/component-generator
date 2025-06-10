# Reacta

A modern Remix app for generating, previewing, and sharing React components, powered by Supabase, Claude AI, and Tailwind CSS.

---

## Short Description

Hey! I tried to use remix instead of Next, it didn't go so well but it is what it is.
Many mistakes were made in this short period of time but I did my best with what I had. When it comes to design I used a kind of weird color palette but hopefully it all doesn't fully blend in. Starter here was a `create-remix` template so nothing special, basically everything was written from zero

## Features

- **Authentication**: Secure signup/login with Supabase (username, email, password)
- **Component Generation**: Chat with Claude AI to generate and refine React components
- **Component Library**: Browse generated components from all users
- **Protected Routes**: `/app` and `/library` require authentication
- **Edge-Ready**: Designed for serverless/edge deployment (e.g., Cloudflare)
- **Clean, Modular Code**: Components and utilities are well-structured and reusable

---

## Project Structure

- `/app/components`: Reusable UI components (Avatar, Sidebar, Chat, etc.)
- `/app/routes`: Route files for Remix (main, login, signup, app, library, API)
- `/app/lib`: Implementation of core functionalities
- `/app/utils`: Utility modules
- `/app/styles`: Tailwind CSS
- `/public`: Static assets

---

## Environment Variables

Create a `.env` file with the following:

```
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
CLAUDE_API_KEY=
SESSION_SECRET=
```

---

## Supabase Setup

1. Create a new Supabase project.
2. Run the provided SQL schema to set up tables and RLS.
3. Copy your Supabase project URL and keys into `.env`.

---

## Running Locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the dev server:

   ```bash
   npm run dev
   ```

3. Visit [http://localhost:5173/](http://localhost:5173/)

## The approach

I decided to try remix, again, it didn't go according to plan and some parts need improvement especially when it comes to client - server relations. Altough the app works! For the component generation I decided to choose claude (claude-3-haiku-20240307) due to it's somewhat good code generation capabilities. Haiku version specifically since it promises speed and in this case I wanted to put a little "performance" as the cherry on top.

When it comes to prompt I focused on making sure the model understands it's goal and delivers a clear result, not sure if I can say much more here.

## Component rendering

In this case I decided to make it quick and simply use iframe with a code transpiled by babel. Not much to say here. When it comes rendering the code there is not much to say, I simply used a syntax highlighter library to make it look better.

## Main issues

- time haha
- confusing at first remix relation with react router
- parts of "documentation" hidden in issues on github (what I mean here is that parts of explentation or "tricks" that should be mentioned in documentation are not there)
- few small remix bugs that slowed me down a bit, ex. tailwind integration errors
- a tiny bit confusing appraoch of remix to structing routes, I know I can manually set them up but overall I was kind of confused when I tried some approaches from the documentation and it just didn't work.

## Possible Future goals

- Add an ability to configure parts of prompt
- Add an ability to choose between models
- Add an ability to configure themes so that the model will know what branding color and fonts to use etc.
- Add an ability to import libraries & users code
- Handle email verification for spam prevention (I turned it off so that the signup would be simpler for this "poc")
- Component preview on different screen sizes
- Add a preview for components in library ("screenshot" like preview instead of just titles)
- Add an ability to make components public (available in library) or private (only visible to the user)
- More responsive code preview with ability to edit/wrap the code
- Component history (user should be able to revert a change or simply go back in the history of the messages to check how it looked at a certain point)
- Make usernames unique and add an ability to modify a user profile
- Investigate and improve handling of actions/loaders to ensure everything is handled accordingly
- Implement proper error handling to prevent actions from failing and blocking other actions
- Improve page switching implementation for a smoother user experience
