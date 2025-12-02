"use client";
export const dynamic = "force-dynamic";   

import nextDynamic from "next/dynamic";   
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { CoachingExpert } from "@/services/Options";
import { UserButton } from "@stackframe/stack";
import { useMutation, useQuery } from "convex/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AIModel, ConvertTextToSpeech, getToken } from "@/services/GlobalServices";
import { RealtimeTranscriber } from "assemblyai";
import {  Loader2Icon } from "lucide-react";
import ChatBox from "./_components/ChatBox";
import { toast } from "sonner";
import { UserContext } from "@/app/_context/UserContext";

const RecordRTC = nextDynamic(() => import("recordrtc"), { ssr: false });   
let texts = {}

function DiscussionRoom() {
  const { roomid } = useParams();
  const {userData,setUserData} = useContext(UserContext);
  const DiscussionRoomData = useQuery(api.DiscussionRoom.GetDiscussionRoom, { id: roomid });

  const [expert, setExpert] = useState(null);
  const [enableMic, setEnableMic] = useState(false);

  const recorder = useRef(null);
  const realtimeTranscriber = useRef(null);
  const silenceTimeout = useRef(null);

  const [transcribe, setTranscribe] = useState("");
  const [conversation, setConversation] = useState([{
    role:'assistant',
    content: 'Hi'
  },{
    role: 'user',
    content: 'Hello'
  }]);
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
    setEnableMic(true);
    setLoading(true);
    realtimeTranscriber.current = new RealtimeTranscriber({
      token: await getToken(),
      sample_rate: 16000,
    });

    realtimeTranscriber.current.on("transcript", async (transcript) => {
      
      let msg = ''

      if(transcript.message_type==="FinalTranscript"){
        setConversation((prev)=>[...prev,{
          role:"user",
          content:transcript.text
        }]);
        await updateUserTokenMethod(transcript.text);
      }
      
      texts[transcript.audio_start] = transcript?.text;
      const keys = Object.keys(texts)
      keys.sort((a,b)=>Number(a)-Number(b)) ;

      for (const key of keys){
        if(texts[key]){
          msg+=` ${texts[key]}`
        }
      }
      setTranscribe(msg);
    });

    await realtimeTranscriber.current.connect();
    setLoading(false);
    
    toast("Connected")

    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(async (stream) => {
          recorder.current = new RecordRTC(stream, {
            type: "audio",
            mimeType: "audio/webm; codecs=pcm",
            recorderType: RecordRTC.StereoAudioRecorder,
            desiredSampRate: 16000,
            numberOfAudioChannels: 1,
            timeSlice: 250,
            bufferSize: 4096,
            audioBitsPerSecond: 128000,
            ondataavailable: async (blob) => {
              if (!realtimeTranscriber.current) return;

              clearTimeout(silenceTimeout.current);

              const buffer = await blob.arrayBuffer();
              await realtimeTranscriber.current.sendAudioData(buffer);

              silenceTimeout.current = setTimeout(() => {
                console.log("User stopped talking");
              }, 2000);
            },
          });

          recorder.current.startRecording();
        })
        .catch(console.error);
    }
  };

  useEffect(()=>{
    
    async function fetchData(){
      if(conversation[conversation.length -1].role==="user"){
        // Calling AI model to get response
        const lastTwoResp = conversation.slice(-2)
        const aiResp =  AIModel(DiscussionRoomData.topic, DiscussionRoomData.coachingOption,lastTwoResp); 
        
        const url = await ConvertTextToSpeech(aiResp.content,DiscussionRoomData.expertName);
        console.log(url)
        setAudioUrl(url);
        setConversation((prev)=>[...prev,aiResp]);
        await updateUserTokenMethod(aiResp.content); //Update Ai generated token
      }
    }

    fetchData()

    console.log(conversation)
 
  },[conversation])

  const disconnect = async (e) => {
    e.preventDefault();
    setLoading(true)
    if (realtimeTranscriber.current) {
      await realtimeTranscriber.current.close();
    }

    if (recorder.current) {
      recorder.current.pauseRecording();
      recorder.current = null;
    }

    setEnableMic(false);
    toast("Disconnected")

    await UpdateConversation({
      id: DiscussionRoomData._id,
      conversation: conversation,
    })
    setLoading(false);
    setEnableSummary(true);

  };

  const updateUserTokenMethod = async (text)=>{
    const tokenCount = text.trim()?text.trim().split(/\s+/).length:0;
      const result = await updateUserToken({
        id:userData._id,
        credits: Number(userData.credits) - Number(tokenCount)
      })

      setUserData(prev=>({
        ...prev,
        credits: result.credits
      }));
  }
  if (!DiscussionRoomData) return <div>Loading...</div>;

  return (
    <div className="-mt-12">
      <h2 className="text-lg font-bold">{DiscussionRoomData.coachingOption}</h2>

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
            <audio src={audioUrl} autoPlay type="audio/mp3"/>
            <div className="p-5 bg-gray-200 px-10 rounded-lg absolute bottom-10 right-10">
              <UserButton />
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center">
            {!enableMic ? (
              <Button onClick={connectToServer} disabled={loading}>{loading && <Loader2Icon className="animate-spin"/>} Connect</Button>
            ) : (
              <Button variant="destructive" onClick={disconnect}>
                {loading && <Loader2Icon className="animate-spin"/>}
                Disconnect
              </Button>
            )}
          </div>
        </div>

        {/* Right section */}
        <div>
         <ChatBox conversation={conversation} 
         enableSummary={enableSummary} 
         coachingOption = {DiscussionRoomData?.coachingOption}
         />
        </div>
      </div>

      <div>
        <h2>{transcribe}</h2>
      </div>
    </div>
  );
}

export default DiscussionRoom;

