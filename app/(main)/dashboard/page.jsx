"use client"
import React from 'react'
import FeatureAssistants from './_components/FeatureAssistants'
import History from './_components/History'
import Feedback from './_components/Feedback'
import { useUser } from '@stackframe/stack'
import { Button } from '@/components/ui/button'
import Link from 'next/link'


function Dashboard() {
  const user = useUser();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h2 className="text-2xl font-bold">You are not signed in</h2>
        <p className="text-muted-foreground">Please sign in to access your dashboard.</p>
        <Link href="/">
            <Button>Go Home</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
        <FeatureAssistants />

        <div className='grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-10 mt-10 md:mt-20'>
          <History />
          <Feedback />
        </div>
    </div>
  )
}

export default Dashboard