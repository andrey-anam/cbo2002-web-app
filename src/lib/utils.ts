import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function throttle(func: any, delay: number) {
  let lastCall = 0;
  return function (...args: any[]) {
    const now = performance.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func.apply(this, args);
    }
  };
}

export function debounce(func: any, delay: number) {
  let timeout: NodeJS.Timeout;

  return function (this: any, ...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };

}