import Onboardingform from '@/components/forms/Onboarding.form'
import React from 'react'
import dbConnect from '@/lib/dbConnect'
import { currentUser } from '@clerk/nextjs/server';
import { fetchUser } from '@/lib/actions/user.actions';

export const metadata = {
  title: 'Onboarding Page',
};


export default async function Page() {
  const user = await currentUser();
  if(!user) return
  const userInfo = await fetchUser(user?.id)

  
  const userData = {
    userid:user?.id,
    objectId:userInfo?._id,
    username:userInfo?.username,
    bio:userInfo?.bio,
    pfp:userInfo?.pfp|| user?.imageUrl,
    name:userInfo?.name
  }
  return (
    <div className='h-screen w-full justify-center items-center flex bg-black text-white text-2xl'>
        <Onboardingform 
        user = {userData}/>
    </div>
  )
}
