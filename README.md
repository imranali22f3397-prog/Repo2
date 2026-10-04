# Bloomday — Birthday Wish Studio

A Next.js birthday-surprise builder. The creator configures a date, four notes, a letter, 2/4/6 wishes, and 2/3/4/6 photos. It creates a shareable recipient link with an interactive birthday reveal.

## Deploy to Netlify
1. Push this folder to a GitHub repository.
2. Import the repository in Netlify. The included `netlify.toml` configures the Next.js adapter.
3. Deploy. Netlify Blobs stores each birthday experience, so the generated link works for other people and across devices.
4. For local development, run `npm install` and `npm run dev`. To test Blobs locally, link the project with the Netlify CLI (`npx netlify link`) and run `npx netlify dev`.

## Notes
- No database credentials or third-party API keys are required.
- Uploaded photos are stored with the experience in Netlify Blobs. Use images of a reasonable size; large images increase upload time and stored data.
- Anyone with a generated link can view that birthday experience. Avoid including sensitive information.
- Generated IDs are unguessable-style random identifiers, not account-level access control.
