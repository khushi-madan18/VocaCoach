import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { coachingOptions } from "./Options";
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";

export const getToken = async () => {
  try {
    const response = await axios.get("/api/getToken");
    return response.data.token;
  } catch (error) {
    console.error("Error fetching token:", error.response?.data || error.message);
    throw error;
  }
};

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export const AIModel = async (topic, coachingOption, lastTwoResp) => {
  try {
    const option = coachingOptions.find((item) => item.name === coachingOption);
    
    // Fallback if option isn't found
    if (!option) {
      return { role: 'assistant', content: "Error: Coaching option not found." };
    }

    const PROMPT = (option.prompt).replace("{user_topic}", topic);
    
    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash",
        systemInstruction: PROMPT
      });

      let chatHistory = lastTwoResp.slice(0, -1).map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      // Gemini history must start with a user message
      if (chatHistory.length > 0 && chatHistory[0].role === 'model') {
        chatHistory = chatHistory.slice(1);
      }

      const chat = model.startChat({
        history: chatHistory
      });

      const lastMsg = lastTwoResp[lastTwoResp.length - 1];
      const result = await chat.sendMessage(lastMsg.content);
      const response = await result.response;
      const text = response.text();

      console.log("AI Response:", text);
      return { role: 'assistant', content: text };

    } catch (error) {
      console.error("AI Model Error:", error);
      // Check for safety block or other generation errors
      if (error.message?.includes("SAFETY") || error.message?.includes("blocked")) {
         return { role: 'assistant', content: "Could you rephrase that? I want to make sure I understand correctly." };
      }
      throw error;
    }

  } catch (error) {
    console.error("AI Model Error:", error);
    // Return a safe fallback message instead of crashing
    return {
        role: "assistant", 
        content: "I am having trouble connecting to the AI service. Please try again later."
    };
  }
};
export const AIModelForSummary = async (topic, coachingOption, conversation) => {
  try {
    const option = coachingOptions.find((item) => item.name === coachingOption);
    
    // Fallback if option isn't found
    if (!option) {
      return { role: 'assistant', content: "Error: Coaching option not found." };
    }

    const PROMPT = (option.summaryprompt).replace("{user_topic}", topic);
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const conversationText = conversation.map(m => `${m.role}: ${m.content}`).join('\n');
    const finalPrompt = `${PROMPT}\n\nConversation:\n${conversationText}\n\nPlease provide the summary now.`;

    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    const text = response.text();

    console.log("AI Response:", text);
    return { role: 'assistant', content: text };

  } catch (error) {
    console.error("AI Model Error:", error);
   
    return {
        role: "assistant", 
        content: "I am having trouble connecting to the AI service. Please try again later."
    };
  }
};


export const ConvertTextToSpeech = async (text,expertName)=>{
    const pollyClient = new PollyClient({
      region: 'us-east-1',
      credentials: {
        accessKeyId:process.env.NEXT_PUBLIC_AWS_ACCESS_KEY,
        secretAccessKey:process.env.NEXT_PUBLIC_AWS_SECRET_KEY
      }
    })

    const command = new SynthesizeSpeechCommand({
        Text:text,
        OutputFormat:'mp3',
        VoiceId: expertName
    })

    try{
      const {AudioStream} = await pollyClient.send(command);

      const audioArrayBuffer = await AudioStream.transformToByteArray();
      const audioBlob = new Blob([audioArrayBuffer], { type: 'audio/mp3' });

      const audioUrl = URL.createObjectURL(audioBlob);
      return audioUrl;
    }catch(err){
      console.log(err)
    }
}