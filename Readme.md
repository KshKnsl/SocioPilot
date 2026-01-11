# 🚀 SocioPilot – Social Media Automator

SocioPilot is a **BYOK-based AI social media automation platform** that enables brands to generate, schedule, and manage engaging social media posts across multiple platforms using Large Language Models. The platform's standout feature is its **AI Comment Reply Bot**, which provides intelligent, brand-consistent responses to social media interactions.

The platform focuses on **brand-consistent content creation**, leveraging AI to generate posts, ideas, and images while maintaining security and user control through Bring Your Own Key (BYOK) architecture.

---

## ✨ Key Features

### 🔐 Bring Your Own Key (BYOK)
- Users provide **their own LLM API keys** (OpenAI, Groq, Gemini)
- No shared API keys or vendor lock-in
- Credentials are securely managed and isolated per user

---

### 🧠 AI Content Generation
- **Idea Generation**: Create social media post ideas based on brand voice and tone
- **Post Generation**: Generate platform-specific posts (Twitter, LinkedIn, etc.) from ideas
- **Image Generation**: AI-powered image prompts and generation for visual content
- **Brand Consistency**: Maintains brand voice, tone, and style guidelines across all content

---

### 🤖 AI Comment Reply Bot
- **Automated Comment Monitoring**: Real-time monitoring of social media comments
- **Intent Classification**: AI-powered analysis of comment intent (questions, complaints, praise, spam)
- **Brand-Safe Replies**: Generate contextually appropriate, brand-consistent responses
- **Smart Filtering**: Automatically filter and prioritize comments requiring attention
- **Bulk Reply Management**: Handle multiple comments efficiently with AI assistance

---

### 🎨 Brand Management
- Single brand per user with customizable:
  - Brand title and description
  - Tone (professional, witty, promotional)
  - Voice fine-tuning
  - Writing styles and guidelines

---

### ⏰ Content Scheduling
- Schedule posts for future publishing
- Edit and manage post content and scheduling
- Status tracking (draft, scheduled, posted)

---

### 📊 Dashboard & Management
- Comprehensive dashboard for content overview
- Posts management with editing capabilities
- Scheduler for planned content
- **Care Page**: Dedicated interface for AI Comment Reply Bot management
- Analytics placeholder (planned)

---

## 🧰 Tech Stack

### Frontend
- **Next.js 15** (App Router)
- **Tailwind CSS 4**
- **shadcn/ui** components
- **TypeScript** for type safety

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose ODM
- **LangChain JS** for AI orchestration
- **JWT** for authentication

### Security
- **JWT authentication**
- **BYOK architecture** - users provide their own API keys

---

## 🛣️ Roadmap & Future Plans

### Phase 1 (Short-term)
- **Real Social Platform Integration**
  - Twitter/X API integration for posting
  - LinkedIn API integration
  - Instagram/Facebook support
- **Advanced Scheduling**
  - Optimal posting time recommendations
  - Bulk scheduling workflows
  - Automated posting queues

### Phase 2 (Medium-term)
- **Multi-brand Workspaces**
  - Support multiple brands per user
  - Brand switching and management
  - Team collaboration features
- **Analytics Dashboard**
  - Post performance metrics
  - Engagement tracking
  - Content effectiveness analysis
- **AI Comment Reply Bot**
  - Automated comment monitoring
  - Intent classification (questions, complaints, praise)
  - Brand-safe AI-generated replies

### Phase 3 (Long-term)
- **Advanced AI Features**
  - Custom brand voice fine-tuning with examples
  - Content series and campaigns
  - A/B testing for posts
- **Enterprise Features**
  - Role-based access control (RBAC)
  - Audit logs and compliance
  - API access for integrations
- **Scalability & Performance**
  - Redis-backed job queues (BullMQ)
  - Rate limiting and optimization
  - Multi-region deployment support

---

## 📦 Local Development Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or cloud)
- API keys for your preferred LLM providers

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/KshKnsl/SocioPilot
cd SocioPilot
```

2. **Install dependencies**
```bash
cd server
npm install

cd ../client
npm install
```

3. **Environment Setup**

Create `.env` file in `server/` directory:

4. **Start the application**
```bash
# Start the server (from server/ directory)
npm start

# Start the client (from client/ directory)
npm run dev
```
----------------------
