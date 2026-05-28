export const PROVIDERS: { id: string; label: string; placeholder: string }[] = [
  { id: 'openai', label: 'OpenAI API Key', placeholder: 'sk-...' },
  { id: 'groq', label: 'Groq API Key', placeholder: 'gsk_...' },
  { id: 'gemini', label: 'Gemini API Key', placeholder: 'AIza...' },
];

export const TONES: string[] = [
  'professional',
  'witty',
  'promotional',
  'casual',
  'formal',
  'humorous',
  'inspirational',
  'educational'
];

export const writingStyles: string[] = [
  "Include emojis",
  "Include relevant hashtags",
  "Include links when appropriate",
  "Use engaging questions",
  "Include calls to action",
  "Keep content concise",
  "Use storytelling techniques",
  "Include data and statistics",
  "Use humor and wit",
  "Be promotional",
  "Reference current events",
  "Use metaphors and analogies",
  "Include inspirational quotes",
  "Mention other users",
  "Use alliteration",
  "Include cultural references",
  "Express personal opinions",
  "Include wordplay or puns",
  "Quote famous people",
  "Use popular culture references",
  "Include announcements",
  "Discuss products or services",
  "Share personal anecdotes",
  "Promote events",
  "Use conversational tone",
  "Use numbered or bulleted lists",
  "Include polls or surveys",
  "Reference trending topics",
  "Be educational and informative",
  "Use seasonal or holiday themes",
  "Include user testimonials",
  "Use motivational language",
  "Include customer success stories",
  "Use interactive elements",
  "Include behind-the-scenes content",
  "Use inclusive language",
  "Express gratitude",
  "Include fun facts",
  "Include thought leadership",
  "Use tutorial or guide format"
];

export const MODELS = [
  { id: 'gpt-4o-mini', provider: 'openai' },
  { id: 'gpt-4', provider: 'openai' },
  { id: 'groq:meta-llama/llama-guard-4-12b', provider: 'groq' },
  { id: 'groq:openai/gpt-oss-120b', provider: 'groq' },
  { id: 'groq:openai/gpt-oss-20b', provider: 'groq' },
  { id: 'gemini-2.5-flash', provider: 'gemini' },
  { id: 'gemini-2.5-pro', provider: 'gemini' },
];
