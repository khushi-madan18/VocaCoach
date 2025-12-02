

"use client";
import { BlurFade } from '@/components/ui/blur-fade'
import { Button } from '@/components/ui/button'
import { coachingOptions } from '@/services/Options'
import { useUser } from '@stackframe/stack'
import Image from 'next/image'
import React from 'react'
import UserInputDialog from './UserInputDialog'
import ProfileDialog from './ProfileDialog';

function FeatureAssistants() {
  const user = useUser();

  if (!user) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div>
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='font-medium text-gray-500'>My Workspace</h2>
          <h2 className='text-3xl font-bold'>
            Welcome back, {user.displayName || user.primaryEmail || "User"}
          </h2>
        </div>
        <ProfileDialog>
          <Button>Profile</Button>
        </ProfileDialog>
      </div>

      <div className='grid grid-cols-2 lg:grid-cols-5 xl:grid-cols-5 gap-10 mt-10'>
        {coachingOptions.map((option, index) => (
          <BlurFade key={option.icon} delay={0.25 + index * 0.05} inView>
            <div className='p-3 bg-secondary rounded-3xl flex flex-col justify-center items-center'>
              <UserInputDialog coachingOption={option}>
                <div className='flex flex-col justify-center items-center'>
                  <Image 
                    src={option.icon}
                    alt={option.name}
                    width={90}
                    height={150}
                    className='h-[70px] w-[70px] hover:rotate-12 cursor-pointer transition-all'
                  />
                  <h2 className='mt-2'>{option.name}</h2>
                </div>
              </UserInputDialog>
            </div>
          </BlurFade>
        ))}
      </div>
    </div>
  );
}

export default FeatureAssistants;
