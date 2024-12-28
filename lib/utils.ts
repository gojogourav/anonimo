import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function isBase64Image(base64String:string) {
  // Regular expression for Base64-encoded image
  const base64ImageRegex = /^data:image\/(png|jpeg|jpg|gif|bmp|webp);base64,[A-Za-z0-9+/]+={0,2}$/;

  return base64ImageRegex.test(base64String);
}

