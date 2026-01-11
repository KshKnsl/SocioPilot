import { ChatOpenAI } from '@langchain/openai';
import { ChatGroq } from '@langchain/groq';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

function initChatModel(modelStr, apiKey) {
  if (modelStr.startsWith('groq:')) {
    const model = modelStr.replace('groq:', '');
    return new ChatGroq({ model, apiKey: apiKey });
  }

  if (modelStr.startsWith('gemini') || modelStr.startsWith('google_genai:')) {
    const model = modelStr.replace('google_genai:', '');
    return new ChatGoogleGenerativeAI({ 
      model: model,
      apiKey: apiKey,
    });
  }
  return new ChatOpenAI({ modelName: modelStr, apiKey: apiKey  });
}

export async function generate(messages, options = {}) {
  const modelName = options.modelName ;
  const apiKey = options.apiKey;

  const chat = initChatModel(modelName, apiKey);
  const langChainMessages = messages.map(m => {
    if (m.role === 'system') return new SystemMessage(m.content);
    return new HumanMessage(m.content);
  });
  const r = await chat.invoke(langChainMessages);
  const result = r?.content;
  return typeof result === 'string' ? result : '';
} 
