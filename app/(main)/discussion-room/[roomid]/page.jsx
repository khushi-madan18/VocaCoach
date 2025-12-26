"use client";
export const dynamic = "force-dynamic";   


import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { CoachingExpert } from "@/services/Options";
import { UserButton, useUser } from "@stackframe/stack";
import { useMutation, useQuery } from "convex/react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AIModel, ConvertTextToSpeech, getToken } from "@/services/GlobalServices";
import {  Loader2Icon, ArrowLeft, Mic, MicOff } from "lucide-react";
import ChatBox from "./_components/ChatBox";
import { toast } from "sonner";
import { UserContext } from "@/app/_context/UserContext";



function DiscussionRoom() {
  const { roomid } = useParams();
  const {userData,setUserData} = useContext(UserContext);
  const user = useUser(); // Get user from stackframe

  // Auth Check
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h2 className="text-2xl font-bold">You are not signed in</h2>
        <p className="text-muted-foreground">Please sign in to access this room.</p>
        <Link href="/">
            <Button>Go Home</Button>
        </Link>
      </div>
    )
  }

  const DiscussionRoomData = useQuery(api.DiscussionRoom.GetDiscussionRoom, { id: roomid });

  const [expert, setExpert] = useState(null);
  const [enableMic, setEnableMic] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);

  const recorder = useRef(null);
  const realtimeTranscriber = useRef(null);
  const silenceTimeout = useRef(null);
  const isBusy = useRef(false);
  const messageQueue = useRef([]);
  const currentAudio = useRef(null);
  const isMicMutedRef = useRef(false);

  const [transcribe, setTranscribe] = useState("");
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [enableSummary, setEnableSummary] = useState(false);
  const UpdateConversation = useMutation(api.DiscussionRoom.UpdateConversation);
  const updateUserToken = useMutation(api.users.UpdateUserToken);

  useEffect(() => {
    if (DiscussionRoomData?.expertName) {
      const Expert = CoachingExpert.find((item) => item.name === DiscussionRoomData.expertName);
      setExpert(Expert);
    }
  }, [DiscussionRoomData]);

  const connectToServer = async () => {
    console.log("Starting connection...");
    setEnableMic(true);
    setLoading(true);

    try {
      console.log("Fetching token...");
      const token = await getToken();
      console.log("Token fetched:", token ? `Yes (Length: ${token.length})` : "No");

      const wsUrl = `wss://streaming.assemblyai.com/v3/ws?token=${token}&sample_rate=16000&end_utterance_silence_threshold=3000`;
      const ws = new WebSocket(wsUrl);
      realtimeTranscriber.current = ws;

      ws.onopen = async () => {
        console.log("WebSocket connected.");
        setLoading(false);
        toast("Connected");

        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
          const source = audioContext.createMediaStreamSource(stream);
          const processor = audioContext.createScriptProcessor(4096, 1, 1);

          source.connect(processor);
          processor.connect(audioContext.destination);

          processor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const buffer = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) {
              buffer[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
            }
            
            if (ws.readyState === WebSocket.OPEN && !isMicMutedRef.current) {
              // console.log("Sending audio chunk:", buffer.byteLength); // Uncomment for verbose logs
              ws.send(buffer.buffer); // Send the underlying ArrayBuffer
            }
          };

          recorder.current = {
            stopRecording: () => {
              processor.disconnect();
              source.disconnect();
              audioContext.close();
              stream.getTracks().forEach((track) => track.stop());
            },
          };
        } catch (err) {
          console.error("Audio setup failed:", err);
          toast.error("Failed to access microphone");
          disconnect();
        }

        // Trigger AI Introduction
        if (conversation.length === 0) {
            await handleIntroduction();
        }
      };

      ws.onmessage = async (event) => {
        // console.log("WebSocket message received:", event.data); // Commented out verbose log
        const message = JSON.parse(event.data);

        if (message.type === "Turn") {
          // Handle Final Transcript
          if (message.end_of_turn) {
            const finalText = message.transcript;
            if (finalText) {
                if (isBusy.current) {
                    console.log("System busy, queuing message:", finalText);
                    messageQueue.current.push(finalText);
                } else {
                    isBusy.current = true;
                    await handleUserMessage(finalText);
                }
            }
          } 
          // Handle Partial Transcript
          else {
            // Use utterance for partials as it seems to contain the full provisional text
            const partialText = message.utterance || message.transcript;
            if (partialText) {
              setTranscribe(partialText);
            }
          }
        } else if (message.type === "Begin") {
          console.log("Session started:", message.id);
        }
      };

      ws.onerror = (event) => {
        console.error("WebSocket error:", event);
        toast.error("Connection error");
        isBusy.current = false;
        processNextInQueue();
        disconnect();
      };

      ws.onclose = (event) => {
        console.log("WebSocket closed:", event.code, event.reason);
        setEnableMic(false);
      };

    } catch (error) {
      console.error("Error connecting:", error);
      setLoading(false);
      setEnableMic(false);
      toast.error("Failed to connect");
    }
  };

  const handleIntroduction = async () => {
    isBusy.current = true;
    try {
        const aiResp = await AIModel(DiscussionRoomData.topic, DiscussionRoomData.coachingOption, [{
            role: 'user',
            content: `Please briefly introduce yourself to the user as their ${DiscussionRoomData.coachingOption} coach for the topic ${DiscussionRoomData.topic}. Keep it short and welcoming.`
        }]);
        
        const url = await ConvertTextToSpeech(aiResp.content, DiscussionRoomData.expertName);
        setAudioUrl(url);
        setConversation([aiResp]);
        await updateUserTokenMethod(aiResp.content);
    } catch (error) {
        console.error("Error in AI introduction:", error);
        isBusy.current = false;
    }
  };

  // Process a user message: update UI, get AI response, play audio
  const handleUserMessage = async (text) => {
      setConversation((prev) => [
          ...prev,
          { role: "user", content: text },
      ]);
      await updateUserTokenMethod(text);
      setTranscribe("");
      // The useEffect below will trigger due to conversation change,
      // but we need to ensure it knows to fetch data. 
      // Actually, relying on useEffect for conversation changes to trigger fetch 
      // works, but we also need to be careful about the queue.
      // The useEffect will handle the AI Call.
  };

  const processNextInQueue = async () => {
      if (messageQueue.current.length > 0) {
          console.log("Processing next from queue");
          const nextText = messageQueue.current.shift();
          isBusy.current = true;
          await handleUserMessage(nextText);
      } else {
          console.log("Queue empty, system ready");
          isBusy.current = false;
      }
  };

  useEffect(()=>{
    
    async function fetchData(){
      if(!DiscussionRoomData) return;
      
      if(conversation[conversation.length -1].role==="user"){
        // Calling AI model to get response
        try {
            const lastTwoResp = conversation.slice(-2)
            const aiResp = await AIModel(DiscussionRoomData.topic, DiscussionRoomData.coachingOption,lastTwoResp); 
            
            const url = await ConvertTextToSpeech(aiResp.content,DiscussionRoomData.expertName);
            console.log(url)
            setAudioUrl(url);
            setConversation((prev)=>[...prev,aiResp]);
            await updateUserTokenMethod(aiResp.content); //Update Ai generated token
        } catch (error) {
            console.error("Error fetching AI response:", error);
            // In case of error, release the lock so user can try again
            isBusy.current = false; 
            processNextInQueue();
        }
      }
    }

    fetchData()

    console.log(conversation)
 
  },[conversation])



  useEffect(() => {
    if (audioUrl) {
      if (currentAudio.current) {
          currentAudio.current.pause();
          currentAudio.current = null;
      }
      const audio = new Audio(audioUrl);
      currentAudio.current = audio;
      
      audio.onended = () => {
          console.log("Audio finished playing");
          // Delay slightly to ensure natural flow or immediate? Immediate is fine.
          processNextInQueue();
      };

      audio.play().catch(error => {
        console.error("Audio playback failed (Autoplay policy?):", error);
        // If play completely fails, we should releasing the lock
        processNextInQueue();
      });
    }
  }, [audioUrl]);

  const disconnect = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    if (realtimeTranscriber.current) {
      // Send terminate message if open
      if (realtimeTranscriber.current.readyState === WebSocket.OPEN) {
        realtimeTranscriber.current.send(JSON.stringify({ terminate_session: true }));
        realtimeTranscriber.current.close();
      }
      realtimeTranscriber.current = null;
    }

    if (recorder.current) {
      recorder.current.stopRecording();
      recorder.current = null;
    }

    setEnableMic(false);
    setIsMicMuted(false);
    isMicMutedRef.current = false;
    toast("Disconnected");

    await UpdateConversation({
      id: DiscussionRoomData._id,
      conversation: conversation,
    });
    if (currentAudio.current) {
        currentAudio.current.pause();
        currentAudio.current = null;
    }
    isBusy.current = false;
    messageQueue.current = [];

    setLoading(false);
    setEnableSummary(true);
  };

  const updateUserTokenMethod = async (text)=>{
    try {
      const tokenCount = text.trim()?text.trim().split(/\s+/).length:0;
      const result = await updateUserToken({
        id:userData._id,
        credits: Number(userData.credits) - Number(tokenCount)
      })

      if (result) {
        setUserData(prev=>({
          ...prev,
          credits: result.credits
        }));
      }
    } catch (error) {
      console.error("Failed to update user token:", error);
    }
  }
  if (!DiscussionRoomData) return <div>Loading...</div>;

  return (
    <div className="-mt-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">{DiscussionRoomData.coachingOption}</h2>
        <Link href="/dashboard">
          <Button variant="outline" size="icon"><ArrowLeft/></Button>
        </Link>
      </div>

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left section */}
        <div className="lg:col-span-2">
          <div className="h-[60vh] bg-secondary border rounded-4xl flex flex-col items-center justify-center relative">
            <Image
              src={expert?.avatar || "/default-avatar.png"}
              alt="Avatar"
              width={150}
              height={150}
              className="h-[80px] w-[80px] rounded-full object-cover animate-pulse"
            />
            <h2 className="text-gray-500">{expert?.name}</h2>
            {/* Audio player removed, handled via new Audio() */}
            <div className="p-5 bg-gray-200 px-10 rounded-lg absolute bottom-10 right-10">
              <UserButton />
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center gap-4">
            {!enableMic ? (
              <Button onClick={connectToServer} disabled={loading}>{loading && <Loader2Icon className="animate-spin"/>} Connect</Button>
            ) : (
             <>
              <Button variant="outline" size="icon" onClick={() => {
                  const newState = !isMicMuted;
                  setIsMicMuted(newState);
                  isMicMutedRef.current = newState;
              }}>
                {isMicMuted ? <MicOff /> : <Mic />}
              </Button>

              <Button variant="destructive" onClick={disconnect}>
                {loading && <Loader2Icon className="animate-spin"/>}
                Disconnect
              </Button>
             </>
            )}
          </div>
        </div>

        {/* Right section */}
        <div>
         <ChatBox conversation={conversation} 
         enableSummary={enableSummary} 
         coachingOption = {DiscussionRoomData?.coachingOption}
         transcribe={transcribe}
         />
        </div>
      </div>
    </div>
  );
}

export default DiscussionRoom;


