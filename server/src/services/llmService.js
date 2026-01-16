import { ChatOpenAI } from '@langchain/openai';
import { ChatGroq } from '@langchain/groq';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

function initChatModel(modelStr, apiKey) {
  if (modelStr.startsWith('groq:')) {
    const model = modelStr.replace('groq:', '');
    return new ChatGroq({ model, apiKey: apiKey });
  }

  if (modelStr.startsWith('gemini')) {
    const model = modelStr.replace('gemini-', '');
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
  const langChainMessages = [];
  for (const m of messages) {
    langChainMessages.push(m.role === 'system' ? new SystemMessage(m.content) : new HumanMessage(m.content));
  }
  const r = await chat.invoke(langChainMessages);
  return r.content;
} 
