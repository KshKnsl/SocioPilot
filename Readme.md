# SocioPilot — Social Media Automator

SocioPilot is a BYOK AI social media automation platform that helps brands generate, schedule, and manage posts across platforms. It also includes an AI Comment Reply Bot for brand-consistent responses.

## Key features

- BYOK: users supply their own LLM API keys (OpenAI, Groq, Gemini)
- AI Content: idea, post, and image generation with brand voice enforcement
- AI Reply Bot: monitors comments, classifies intent, and generates replies
- Scheduling: schedule, edit, and track posts
- Brand management: profile, tone, and style settings
- Dashboard: posts, scheduler, Care page; analytics (placeholder)

## Tech stack

- Frontend: Next.js, Tailwind CSS, TypeScript
- Backend: Node.js (Express), MongoDB, LangChain
- Security: JWT auth, BYOK credential handling

## Roadmap (high level)

- Phase 1: Platform integrations (Twitter/X, LinkedIn), scheduling improvements
- Phase 2: Multi-brand workspaces, analytics dashboard
- Phase 3: Enterprise features and scalability

## Local development

Prerequisites: Node.js 18+, MongoDB, LLM API keys

Quick start:

```bash
git clone https://github.com/KshKnsl/SocioPilot
cd SocioPilot
cd server && npm install
cd ../client && npm install

cd ../server && npm start
npm run worker

# Start client
cd ../client && npm run dev
```
