"use client"
import React, { ChangeEvent, useState } from 'react'
import { useForm } from 'react-hook-form'
import {zodResolver} from "@hookform/resolvers/zod"
import { userValidation } from '@/lib/validations/user.validation'

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { z } from 'zod'
import Image from 'next/image'
import { isBase64Image } from '@/lib/utils'
import { useUploadThing } from '@/lib/uploadthing'
import { updateUser } from '@/lib/actions/user.actions'
import { usePathname,useRouter } from 'next/navigation'

interface Props{
  user:{
    userid:string
    objectId:object
    username:string,
    bio:string,
    pfp:string,
    name:string
  }
}

function OnboardingForm({user}:Props) {
  const [files,setFiles] = useState<File[]>([])
  const { startUpload} = useUploadThing("media");
  const pathname = usePathname();
  const router = useRouter();

  const form = useForm({
    resolver:zodResolver(userValidation),
    defaultValues:{
      username:user.username||"",
      bio:user.bio||"",
      pfp:user.pfp||"",
      name:user.name||""
    }
  })

  const handleImage = (e:ChangeEvent<HTMLInputElement>,fieldChange:(value:string)=>void)=>{
    e.preventDefault();
    const fileReader = new FileReader();

    if(e.target.files&&e.target.files.length>0){
      const file = e.target.files[0];

      setFiles(Array.from(e.target.files));

      if(!file.type.includes('image')) return; 

      fileReader.onload = async (event) =>{
        const imageDataUrl = event.target?.result?.toString()||"";

        fieldChange(imageDataUrl)
      }
      fileReader.readAsDataURL(file);
    }
  }

  async function onSubmit(values:z.infer<typeof userValidation>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const blob = values.pfp;
    const hasImageChanged = isBase64Image(blob);

    if(hasImageChanged){
      const ImgRes = await startUpload(files)

      if(ImgRes && ImgRes[0].url){
        values.pfp = ImgRes[0].url
      }
    }
    console.log("At update user");
    
    await updateUser(
      {username:values.username,
      name:values.name,
      bio:values.bio,
      userid:user.userid,
      pfp:values.pfp,
      path:pathname}
    )
    console.log("User updated successfully");
    
    // if(pathname ==='/profile/edit'||pathname==='/onboarding'){
    //   router.push('/');
    // }else{
    //   router.push('/')
    // }
  }



  return (
    <div>
  <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="pfp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PfP</FormLabel>
              {field.value&&(
                <Image
                  src={field.value}
                  height={30}
                  width={30}
                  alt='profile pic'
                  priority
                />
              )}
              <FormControl>
                <Input 
                  type='file'
                  accept='image/*'
                  placeholder='upload image'
                  onChange={(e)=>handleImage(e,field.onChange)}
                />
              </FormControl>
            </FormItem>
          )}
        />
          <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
          <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
          <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>

    </div>
  )
}

export default OnboardingForm