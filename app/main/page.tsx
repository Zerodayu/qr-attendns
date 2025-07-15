'use client';

import React, { useState } from "react";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import {
  Announcement,
  AnnouncementTag,
  AnnouncementTitle,
} from '@/components/ui/announcement';
import {
  Bell,
  BellOff,
} from "lucide-react";

export default function Home() {
  const [enabled, setEnabled] = useState(true);

  async function handleEnable() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
    const reg = await navigator.serviceWorker.register('/sw.js');
    await Notification.requestPermission();
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '<YOUR_PUBLIC_VAPID_KEY>',
    });
    await fetch('/api/subscribe', {
      method: 'POST',
      body: JSON.stringify(sub),
      headers: { 'Content-Type': 'application/json' },
    });
    setEnabled(true);
  }

  async function handleDisable() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
    // Get the current subscription
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) {
      await fetch('/api/unsubscribe', {
        method: 'POST',
        body: JSON.stringify({ endpoint: sub.endpoint }),
        headers: { 'Content-Type': 'application/json' },
      });
      await sub.unsubscribe();
    }
    setEnabled(false);
  }

  return (
    <section className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center gap-2">
        <div>
          <Announcement>
            <AnnouncementTag>New</AnnouncementTag>
            <AnnouncementTitle>
              Notification feature added
            </AnnouncementTitle>
          </Announcement>
        </div>
        <h1 className="text-center text-5xl md:text-8xl font-bold tracking-tight text-balance">Qr Attendns</h1>
        <p className="font-mono text-center text-md md:text-lg text-muted-foreground">Receive notifications for attendance updates</p>
        {enabled ? (
          <Button onClick={handleDisable}>
            <BellOff className="size-5" />
            Disable
          </Button>
        ) : (
          <Button onClick={handleEnable}>
            <Bell className="size-5" />
            Enable
          </Button>
        )}
      </div>

      <div className="flex items-center justify-center gap-4 mt-20 filter invert opacity-50">
        <Image
          src="/next.svg"
          alt="Qr Attendns Logo"
          width={300}
          height={300}
          className="rounded-lg size-20"
        />
        <Image
          src="/shadcn-ui.svg"
          alt="Qr Attendns Logo"
          width={100}
          height={100}
          className="rounded-lg size-6"
        />
        <Image
          src="/tailwind-css.svg"
          alt="Qr Attendns Logo"
          width={100}
          height={100}
          className="rounded-lg size-10"
        />
        <Image
          src="/vercel.svg"
          alt="Qr Attendns Logo"
          width={100}
          height={100}
          className="rounded-lg size-6"
        />
      </div>
    </section>
  );
}