"use client";

import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { CoachingExpert } from '@/services/Options';
import { UserButton } from '@stackframe/stack';
import { useQuery } from 'convex/react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import RecordRTC from "recordrtc";

function DiscussionRoom() {
  const { roomid } = useParams();
  const DiscussionRoomData = useQuery(api.DiscussionRoom.GetDiscussionRoom, { id: roomid });
  const [expert, setExpert] = useState(null);
  const [enableMic, setEnableMic] = useState(false);
  const recorder = useRef(null);
  let silenceTimeout;

  useEffect(() => {
    if (DiscussionRoomData && DiscussionRoomData.expertName) {
      const Expert = CoachingExpert.find(
        (item) => item.name === DiscussionRoomData.expertName
      );
      setExpert(Expert);
    }
  }, [DiscussionRoomData]);

  const connectToServer = () => {
    setEnableMic(true);
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          // ✅ Assign to recorder.current, not a new variable
          recorder.current = new RecordRTC(stream, {
            type: "audio",
            mimeType: "audio/webm;codecs=pcm",
            recorderType: RecordRTC.StereoAudioRecorder,
            timeSlice: 250,
            desiredSampRate: 16000,
            numberOfAudioChannels: 1,
            bufferSize: 4096,
            audioBitsPerSecond: 128000,
            ondataavailable: async (blob) => {
              // Skip if no live transcriber
              if (!window.realtimeTranscriber) return;

              // Convert blob to ArrayBuffer for AssemblyAI streaming
              const buffer = await blob.arrayBuffer();
              window.realtimeTranscriber.sendAudio(buffer);

              // Optional: silence detection or timeout logic
              clearTimeout(window.silenceTimeout);
              window.silenceTimeout = setTimeout(() => {
                console.log("User stopped talking");
                // Example: stop or finalize transcript here
              }, 2000);
            },
          });

          recorder.current.startRecording();
          console.log("🎙️ Microphone access granted and recording started");
        })
        .catch((err) => {
          console.error("Microphone access denied:", err);
        });
    }
  };

  const disconnect = (e) => {
    e.preventDefault();

    // ✅ Only call pauseRecording if recorder exists
    if (recorder.current) {
      recorder.current.pauseRecording(() => {
        console.log("⏸ Recording paused");
      });
      recorder.current = null;
    }

    setEnableMic(false);
  };

  if (!DiscussionRoomData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="-mt-12">
      <h2 className="text-lg font-bold">{DiscussionRoomData.coachingOption}</h2>
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="lg:col-span-2 h-[60vh] bg-secondary border rounded-4xl flex flex-col items-center justify-center relative">
            {expert?.avatar ? (
              <Image
                src={expert.avatar}
                alt="Avatar"
                width={200}
                height={200}
                className="h-[80px] w-[80px] rounded-full object-cover animate-pulse"
              />
            ) : (
              <Image
                src="/default-avatar.png"
                alt="Default Avatar"
                width={200}
                height={200}
              />
            )}
            <h2 className="text-gray-500">{expert?.name}</h2>
            <div className="p-5 bg-gray-200 px-10 rounded-lg absolute bottom-10 right-10">
              <UserButton />
            </div>
          </div>
          <div className="mt-5 flex items-center justify-center">
            {!enableMic ? (
              <Button onClick={connectToServer}>Connect</Button>
            ) : (
              <Button variant="destructive" onClick={disconnect}>
                Disconnect
              </Button>
            )}
          </div>
        </div>
        <div>
          <div className="h-[60vh] bg-secondary border rounded-4xl flex flex-col items-center justify-center relative">
            <h2>Chat section</h2>
          </div>
          <h2 className="mt-5 text-gray-400 text-sm">
            At the end of your conversation we will automatically generate
            feedback/notes from your conversation
          </h2>
        </div>
      </div>
    </div>
  );
}

export default DiscussionRoom;
