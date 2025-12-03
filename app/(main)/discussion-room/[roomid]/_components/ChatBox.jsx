import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api';
import { useMutation } from 'convex/react';
import {  LoaderCircle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { toast } from 'sonner';
import { AIModelForSummary } from '@/services/GlobalServices';

function ChatBox({conversation, enableSummary, coachingOption, topic,}) {
    const [loading, setLoading] = useState(false);
    const UpdateSummary = useMutation(api.DiscussionRoom.UpdateSummary);
    const {roomid} = useParams();
    const router = useRouter();

    const GenerateFeedbackNotes = async ()=>{
        setLoading(true);
        try{
            const result = await AIModelForSummary(topic, coachingOption, conversation);
            console.log(result.content);
            
            await UpdateSummary({
                id: roomid,
                summary: result
            })
            setLoading(false);
            toast('Feedback/Notes generated successfully');
            router.push(`/view-summary/${roomid}`);
        }catch(err){
            setLoading(false);
            toast('Internal server error, please try again later')
        }
        
    }
  return (
    <div>
        <div className="h-[60vh] bg-secondary border rounded-xl flex flex-col  relative p-4 overflow-auto">
        {/* <div > */}
            {conversation.map((item, index)=>(
                <div key={index} className={`flex ${item.role === 'user' && 'justify-end'}`}>
                    {item.role==='assistant' ? <h2 className=" p-1 px-2 bg-primary text-primary-foreground inline-block rounded-md mt-2">{item?.content}</h2> :
                    <h2 className='p-1 px-2 bg-secondary text-secondary-foreground inline-block rounded-md mt-2  justify-end'>{item?.content}</h2>}
                </div>
            ))}
        {/* </div> */}
        </div>
       {!enableSummary ?  <h2 className="mt-5 text-gray-400 text-sm">
            At the end of your conversation we will generate feedback automatically.
        </h2> : <Button onClick = {GenerateFeedbackNotes} disabled={loading} className='mt-7 w-full'>
            {loading&&<LoaderCircle className='animate-spin'/>} Generate Feedback/Notes</Button>}
  </div>
  )
}

export default ChatBox