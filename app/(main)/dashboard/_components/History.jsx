"use client"

import { UserContext } from '@/app/_context/UserContext';
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { coachingOptions } from '@/services/Options';
import { useConvex, useMutation } from 'convex/react'
import { Trash, Search, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import moment from 'moment/moment';
import { toast } from 'sonner';
import  Image  from 'next/image';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import React, { useContext, useEffect, useState } from 'react'

function History() {
  const convex = useConvex();
  const {userData} = useContext(UserContext);
  const [discussionRoomList,setDiscussionRoomList] = useState([])
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

  // Filter and Sort Logic
  const filteredList = discussionRoomList.filter(item => {
    const isRelevant = item.coachingOption === 'Topic Based Lectures' || 
                       item.coachingOption === 'Learn Language' || 
                       item.coachingOption === 'Meditation';
    const matchesSearch = item.topic?.toLowerCase().includes(searchQuery.toLowerCase());
    return isRelevant && matchesSearch;
  }).sort((a, b) => {
    if (sortOption === 'newest') {
      return b._creationTime - a._creationTime;
    } else {
      return a._creationTime - b._creationTime;
    }
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const paginatedList = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Card className="h-full flex flex-col">
        <CardHeader>
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                <CardTitle className='font-bold text-xl whitespace-nowrap'>Your Previous Lectures</CardTitle>
                <div className="flex gap-2 w-full xl:w-auto">
                    <div className="relative flex-1 xl:w-48">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                            placeholder="Search topics..."
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <ArrowUpDown className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSortOption('newest')}>
                                Newest First
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSortOption('oldest')}>
                                Oldest First
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </CardHeader>
        
        <CardContent className="flex-1">
            {filteredList.length === 0 && <h2 className='text-gray-400'>No lectures found</h2>}
            
            <div className='space-y-4'>
                {paginatedList.map((item, index) => (
                    <div key={index} className='border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-secondary/50 transition-colors group min-h-[100px]'>
                        <div className='flex gap-4 items-center w-full sm:flex-1 sm:min-w-0'>
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
                        <div className='flex gap-2 items-center w-full sm:w-auto sm:shrink-0 justify-end'>
                            <Link href={"/view-summary/" + item._id}>
                            <Button variant='outline' size="sm" className='opacity-0 group-hover:opacity-100 transition-opacity w-32'>View Notes</Button>
                            </Link>
                            <Button variant='ghost' size='icon' className='text-red-500 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity'
                            onClick={(e)=>deleteHistory(e, item._id)}
                            >
                                <Trash className='w-4 h-4'/>
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </CardContent>
    </Card>
  )
}

export default History