"use client"

import { UserContext } from '@/app/_context/UserContext';
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { coachingOptions } from '@/services/Options';
import { useConvex, useMutation } from 'convex/react'
import { Trash } from 'lucide-react';
import moment from 'moment/moment';
import { toast } from 'sonner';
import  Image  from 'next/image';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react'

function History() {
  const convex = useConvex();
  const {userData} = useContext(UserContext);
  const [discussionRoomList,setDiscussionRoomList] = useState([])
  const GetDiscussionRooms = async ()=>{
    const result = await convex.query(api.DiscussionRoom.GetAllDiscussionRoom,{
      userId: userData?._id
    });
    console.log(result);
    setDiscussionRoomList(result)
  }

  const DeleteDiscussionRoom = useMutation(api.DiscussionRoom.DeleteDiscussionRoom);

  const deleteHistory = async (e, id)=>{
      e.stopPropagation();
      await DeleteDiscussionRoom({
          id: id
      })
      toast('Deleted successfully');
      GetDiscussionRooms();
  }

  const GetAbstractImages = (option)=>{
    const coachingOption = coachingOptions.find((item)=>item.name===option);
    return coachingOption?.abstract ?? '/ab1.png';
  }
  useEffect(()=>{
    userData&&GetDiscussionRooms();
    
  },[userData])
  return (
    <div>
        <h2 className='font-bold text-xl'>Your Previous Lectures</h2>
        {discussionRoomList.length === 0 && <h2 className='text-gray-400'>You don't have any previous lectures</h2>}
          <div className='mt-5 space-y-4'>
            {discussionRoomList.map((item, index) => 
              (item.coachingOption === 'Topic Based Lectures' || 
              item.coachingOption === 'Learn Language' || item.coachingOption === 'Meditation') && (
                <div key={index} className='border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-secondary/50 transition-colors group'>
                    <div className='flex gap-4 items-center w-full sm:w-auto'>
                      <Image 
                        src={GetAbstractImages(item.coachingOption)} 
                        alt='abstract' 
                        width={50} 
                        height={50} 
                        className='rounded-full h-[50px] w-[50px] object-cover shrink-0'  
                      />
                      <div className='min-w-0'>
                        <h2 className='font-bold truncate'>{item.topic}</h2>
                        <h2 className='text-muted-foreground text-sm'>{item.coachingOption}</h2>
                        <h2 className='text-muted-foreground text-xs'>{moment(item._creationTime).fromNow()}</h2>
                      </div>
                    </div>
                    <div className='flex gap-2 items-center w-full sm:w-auto justify-end'>
                        <Link href={"/view-summary/" + item._id}>
                          <Button variant='outline' size="sm" className='opacity-0 group-hover:opacity-100 transition-opacity'>View Notes</Button>
                        </Link>
                        <Button variant='ghost' size='icon' className='text-red-500 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity'
                        onClick={(e)=>deleteHistory(e, item._id)}
                        >
                            <Trash className='w-4 h-4'/>
                        </Button>
                    </div>
                </div>
              )
            )}
          </div>

    </div>
  )
}

export default History