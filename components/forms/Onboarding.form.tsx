"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Textarea } from "../ui/textarea"
import { useUser } from "@clerk/nextjs"
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
import Image from "next/image"
import React, { useEffect, useState } from "react"
import { useUploadThing } from "@/lib/uploadthing"


const formSchema = z.object({
  name: z.string().min(2, {
    message: "name must be at least 2 characters.",
  }),
  bio: z.string().min(2, {
    message: "bio must be at least 2 characters.",
  }),
  profile_pic:z.instanceof(File).optional(),
  
})




function Onboardingform() {
  const { isSignedIn, user, isLoaded } = useUser()
  const [imagePreview,setImage] = useState<string|null>(user?.imageUrl||"")
  const { startUpload } = useUploadThing("media");

useEffect(()=>{
  if(isLoaded && user?.imageUrl){
    setImage(user.imageUrl);
  }
},[isLoaded,user?.imageUrl])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.fullName||"",
      profile_pic:undefined,
      bio:"",
    },
  })
  

  if(!isLoaded){
    return <div>Loadinggg....</div>
  }
  

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const user = useUser();
    if(values.profile_pic){
      try{
        const uploadResponse = await startUpload([values.profile_pic]);
        console.log("Upload response",uploadResponse);
        
        if(uploadResponse && uploadResponse[0].url){
          const uploadedImageURL = uploadResponse[0].url;
          
          if(user.user){
            user.user.imageUrl = uploadedImageURL;
          }
  
          setImage(uploadedImageURL)
          console.log("Form submitted with values:",values);
  
        }
      }catch(error){
      console.error("Error uploading the file or updating profile:", error);
  

    }
    
  }
}

  //TODO:Learn more about handling file handling 
  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>){
    const file = event.target.files?.[0]
    if(!file?.type.startsWith("image/")){
      console.error("Selected file is not image");
      return
      
    }
    if(file){
      const reader = new FileReader();
      reader.onload = ()=>{
        setImage(URL.createObjectURL(file));
        form.setValue("profile_pic",file)
      };
      reader.readAsDataURL(file);
    }else{
      setImage(null);
      form.setValue("profile_pic",undefined)
    }
  }
  



  return (

    <Form {...form} >
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8  ">
    <FormField
        control={form.control}
        name="profile_pic"
        render={({ field }) => (
          <FormItem className="flex items-center">
            {imagePreview &&(
              <div>
                <Image src={imagePreview} alt="profile pic" height={100} width={100} unoptimized/>
              </div>
            )

            }
            <FormControl >
              <input className="text-sm " type="file" accept="image/*" onChange={handleImageChange}></input>
            </FormControl>
            
            <FormDescription>
            </FormDescription>
            <FormMessage />
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
              <Input placeholder="This is your public display name." {...field} />
            </FormControl>
            <FormDescription>
            </FormDescription>
            <FormMessage />
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
              <Textarea placeholder="write someting about yourself" {...field}/>
            </FormControl>
            <FormDescription>
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="submit">Submit</Button>
    </form>
  </Form>
  )
}

export default Onboardingform