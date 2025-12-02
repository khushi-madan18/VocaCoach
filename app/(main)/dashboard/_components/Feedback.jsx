"use client"
import { UserContext } from '@/app/_context/UserContext';
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { coachingOptions } from '@/services/Options';
import { useConvex, useMutation } from 'convex/react'
import { Trash } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import moment from 'moment/moment';
import  Image  from 'next/image';
import React, { useContext, useEffect, useState } from 'react'
function Feedback() {
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

  const deleteFeedback = async (e, id)=>{
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
        <h2 className='font-bold text-xl'>Feedback</h2>
        {discussionRoomList.length === 0 && <h2 className='text-gray-400'>You don't have any previous Feedbacks</h2>}
          <div className='mt-5'>
            {discussionRoomList.map((item, index) => 
              (item.coachingOption === 'Mock Interview' || 
              item.coachingOption === 'Ques Ans Prep') && (
                <div key={index} className='border-b-[1px] pb-3 mb-4 group flex justify-between items-center cursor-pointer'>
                    <div className='flex gap-7 items-center'>
                      <Image src = {GetAbstractImages(item.coachingOption)} alt='abstract' width = {50} height = {50} className='rounded-full h-[50px] w-[50px]'  />
                    <div>
                      <h2 className='font-bold'>{item.topic}</h2>
                      <h2 className='text-gray-400'>{item.coachingOption}</h2>
                      <h2 className='text-gray-400 text-sm'>{moment(item._creationTime).fromNow()}</h2>
                  </div>
            </div>
            <div className='flex gap-2 items-center'>
              <Link href={"/view-summary/" + item._id}>
              <Button variant='outline' className='invisible group-hover:visible'>View Feedback</Button>
              </Link>
              <Button variant='ghost' size='icon' className='text-red-500 hover:text-red-600 hover:bg-red-50 invisible group-hover:visible'
                  onClick={(e)=>deleteFeedback(e, item._id)}
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

export default Feedback