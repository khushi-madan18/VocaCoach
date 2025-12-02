"use client"
import { api } from '@/convex/_generated/api';
import { coachingOptions } from '@/services/Options';
import { useQuery } from 'convex/react';

import moment from 'moment';
import Image from 'next/image';
import { useParams } from 'next/navigation'
import React from 'react'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

import SummaryBox from './_components/SummaryBox';
import ChatBox from '../../discussion-room/[roomid]/_components/ChatBox';

function ViewSummary() {
  const { roomid } = useParams();

  const DiscussionRoomData = useQuery(api.DiscussionRoom.GetDiscussionRoom, { id: roomid });
  console.log(DiscussionRoomData);

  const GetAbstractImages = (option) => {
    const coachingOption = coachingOptions.find((item) => item.name === option);
    return coachingOption?.abstract ?? '/ab1.png';
  };


  if (!DiscussionRoomData) {
    return <div>Loading...</div>;
  }

  return (
    <div className='-mt-10'>
      <div className="mb-5">
        <Link href="/dashboard">
          <Button variant="outline" size="icon"><ArrowLeft/></Button>
        </Link>
      </div>
    <div className='flex justify-between items-end'>
      <div className='flex gap-7 items-center'>
        <Image 
          src={GetAbstractImages(DiscussionRoomData.coachingOption)} 
          alt="abstract"
          width={100}
          height={200}
          className='w-[70px] h-[70px] rounded-full'
        />
        <div>
                <h2 className='font-bold text-lg'>{DiscussionRoomData.topic}</h2>
                <h2 className='text-gray-400'>{DiscussionRoomData.coachingOption}</h2>
                
            </div>
      </div>
      <h2 className='text-gray-400 '>{moment(DiscussionRoomData?._creationTime).fromNow()}</h2>
      </div>

        <div className='grid grid-cols-1 lg:grid-cols-5 gap-5 mt-5'>
            <div className='col-span-3'>
              <h2 className='text-lg font-bold mb-6'>Summary of your conversation.</h2>
              <SummaryBox summary={DiscussionRoomData?.summary}/>
            </div>
            <div className='col-span-2'>
            <h2 className='text-lg font-bold mb-6'>Your conversation.</h2>
                {DiscussionRoomData?.conversation && <ChatBox conversation={DiscussionRoomData?.conversation}
                coachingOption={DiscussionRoomData?.coachingOption}
                enableSummary={false}
                />}
            </div>
        </div>
    </div>
  );
}

export default ViewSummary;
