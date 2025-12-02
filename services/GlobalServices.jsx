import axios from "axios";
import OpenAI from "openai";
import { coachingOptions } from "./Options";
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";

export const getToken = async () => {
  try {
    const response = await axios.get("/api/getToken");
    console.log(response);
    return response.data.token;
  } catch (error) {
    console.error("Error fetching token:", error.response?.data || error.message);
    throw error;
  }
};

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.NEXT_PUBLIC_AI_OPENROUTER,
  dangerouslyAllowBrowser: true
});

export const AIModel = async (topic, coachingOption, lastTwoResp) => {
  try {
    const option = coachingOptions.find((item) => item.name === coachingOption);
    
    // Fallback if option isn't found
    if (!option) {
      return { role: 'assistant', content: "Error: Coaching option not found." };
    }

    const PROMPT = (option.prompt).replace("{user_topic}", topic);
    
    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-exp:free",
      messages: [
        { role: 'assistant', content: PROMPT },
        ...lastTwoResp
      ],
    });

    console.log("AI Response:", completion.choices[0].message);
    return completion.choices[0].message;

  } catch (error) {
    console.error("AI Model Error:", error);
    // Return a safe fallback message instead of crashing
    return {
        role: "assistant", 
        content: "I am having trouble connecting to the AI service (Rate Limit Exceeded). Please try again later."
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
    
    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-exp:free",
      messages: [
        
        ...conversation,
        { role: 'assistant', content: PROMPT },
      ],
    });

    console.log("AI Response:", completion.choices[0].message);
    return completion.choices[0].message;

  } catch (error) {
    console.error("AI Model Error:", error);
   
    return {
        role: "assistant", 
        content: "I am having trouble connecting to the AI service (Rate Limit Exceeded). Please try again later."
    };
  }
};


export const ConvertTextToSpeech = async (text,expertName)=>{
    const pollyClient = new PollyClient({
      regin: 'us-east-1',
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