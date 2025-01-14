import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const priceFormat = new Intl.NumberFormat("en-US", {
  currency: 'NGN',
  style: 'currency'
})