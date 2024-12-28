"use client"
import React, { ChangeEvent, useState } from 'react'
import { useForm } from 'react-hook-form'
import {zodResolver} from "@hookform/resolvers/zod"
import { userValidation } from '@/lib/validations/user.validation'
import { Card } from '../ui/card'
import { CardContent } from '../ui/card'
import { Textarea } from '../ui/textarea'
import { Button } from "@/components/ui/button"
import { Avatar,AvatarImage,AvatarFallback } from '../ui/avatar'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { z } from 'zod'
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
  const [previewImage, setPreviewImage] = useState(user.pfp);


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
        setPreviewImage(imageDataUrl);
      }
      fileReader.readAsDataURL(file);
    }
  }

  async function onSubmit(values:z.infer<typeof userValidation>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(" ONSUBMIT BUTTON CLICKED");
    
    let imageUrl = values.pfp;
    const hasImageChanged = isBase64Image(values.pfp||"");

    if(hasImageChanged){
      console.log("Uploading new image...");
      const ImgRes = await startUpload(files)
      
      if(ImgRes && ImgRes[0].url){
        imageUrl = ImgRes[0].url;
        console.log("Image Uploaded successfully ");
      }
    
    
    console.log("updating the user");
    
    await updateUser(
      {username:values.username,
      name:values.name,
      bio:values.bio,
      userid:user.userid,
      pfp:imageUrl||"",
      path:pathname}
    )
  }else{
    console.log("User update");
    
    const result = await updateUser(
      {username:values.username,
      name:values.name,
      bio:values.bio,
      userid:user.userid,
      pfp:values.pfp||"",
      path:pathname}
    )
    if(!result){
      throw new Error("Failed to update user")
    }
    console.log("User updated successfully");
    
  }
    console.log("User updated successfully");
  }



  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="pfp"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center space-y-4">
                  <FormLabel>Profile Picture</FormLabel>
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={previewImage} alt="Profile picture" />
                    <AvatarFallback>{user.name?.[0] || '?'}</AvatarFallback>
                  </Avatar>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      className="max-w-xs"
                      onChange={(e) => handleImage(e, field.onChange)}
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
                    <Input placeholder="Choose a unique username" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
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
                    <Textarea 
                      placeholder="Tell us about yourself"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full"
              
            >Submit
            </Button>
            {Object.keys(form.formState.errors).length > 0 && (
              <div className="text-red-500">
                {Object.entries(form.formState.errors).map(([key, error]) => (
                  <p key={key}>{error.message}</p>
                ))}
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>

  )
}

export default OnboardingForm