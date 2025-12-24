import axios from "axios";

import { coachingOptions } from "./Options";


export const getToken = async () => {
  try {
    const response = await axios.get("/api/getToken");
    return response.data.token;
  } catch (error) {
    console.error("Error fetching token:", error.response?.data || error.message);
    throw error;
  }
};



export const AIModel = async (topic, coachingOption, lastTwoResp) => {
  try {
    const response = await axios.post("/api/chat", {
        topic,
        coachingOption,
        messages: lastTwoResp
    });
    return response.data;

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
    const response = await axios.post("/api/summary", {
        topic,
        coachingOption,
        conversation
    });
    return response.data;

  } catch (error) {
    console.error("AI Model Error:", error);
   
    return {
        role: "assistant", 
        content: "I am having trouble connecting to the AI service. Please try again later."
    };
  }
};


export const ConvertTextToSpeech = async (text, expertName) => {
    console.log("ConvertTextToSpeech called with:", { text, expertName });
    
    try {
        const response = await axios.post('/api/tts', {
            text: text,
            voiceId: expertName
        }, {
            responseType: 'blob' // Important: Expect a blob response
        });

        const audioUrl = URL.createObjectURL(response.data);
        console.log("Audio URL generated:", audioUrl);
        return audioUrl;

    } catch (err) {
        console.error("TTS API Error:", err);
        return null;
    }
}