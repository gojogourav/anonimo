import Onboardingform from '@/components/forms/Onboarding.form'
import React from 'react'
import { useUser } from '@clerk/nextjs'
import dbConnect from '@/lib/dbConnect'
function page() {
  dbConnect();
  return (
    <div className='h-screen w-full justify-center items-center flex bg-black text-white text-2xl'>
        <Onboardingform/>
    </div>
  )
}

export default page