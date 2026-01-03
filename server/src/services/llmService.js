import { ChatOpenAI } from '@langchain/openai';
import { ChatGroq } from '@langchain/groq';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

function initChatModel(modelStr, apiKey, temperature = 0.5) {
  if (modelStr.startsWith('groq:')) {
    const model = modelStr.replace('groq:', '');
    return new ChatGroq({ model, apiKey: apiKey || process.env.GROQ_API_KEY, temperature });
  }

  if (modelStr.startsWith('gemini') || modelStr.startsWith('google_genai:')) {
    return new ChatGoogleGenerativeAI({ modelName: modelStr, apiKey: apiKey || process.env.GOOGLE_API_KEY, temperature });
  }

  return new ChatOpenAI({ modelName: modelStr, openAIApiKey: apiKey || process.env.OPENAI_API_KEY, temperature });
}

export async function generate(messages, options = {}) {
  const { modelName = 'gpt-4o-mini', apiKey = null } = options;
  const temp = 0.5;

  const chat = initChatModel(modelName, apiKey, temp);
  const prompt = messages.map(m => (m.role === 'system' ? `System: ${m.content}` : `${m.role}: ${m.content}`)).join('\n\n');

  const r = await chat.invoke(prompt);
  return r?.content || r;
} 
