"use-client";
import { useEffect, useState } from 'react';

const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
export default async function funcWindow() {
const [isClient, setClient] = useState(false)

  useEffect(() => {
    setClient(true)
  }, [])
  return await (window as any).grecaptcha.execute(siteKey, { action: 'submit' }); 
}