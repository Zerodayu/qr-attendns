'use client';

import React, { useState, useEffect } from "react";
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ScanQrCode, LoaderCircle } from "lucide-react";
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
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state

  // Check if device is already registered for notifications
  useEffect(() => {
    async function checkSubscription() {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      setEnabled(!!sub);
    }
    checkSubscription();
  }, []);

  async function handleEnable() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
    setLoading(true);
    try {
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
    } finally {
      setLoading(false);
    }
  }

  async function handleDisable() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
    setLoading(true);
    try {
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
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex flex-col justify-center h-screen px-2">
        <div className="fixed top-0 inline-flex m-6">
          <Link href="/main">
            <ScanQrCode className="size-10" />
          </Link>
        </div>
      <div className="flex pb-20 flex-col items-center justify-center gap-2">
        <div>
          <Announcement>
            <AnnouncementTag>New</AnnouncementTag>
            <AnnouncementTitle>
              Notification feature added
            </AnnouncementTitle>
          </Announcement>
        </div>
        <h1 className="text-center text-5xl md:text-8xl font-bold tracking-tight text-balance">Qr Attendns</h1>
        <p className="font-mono text-center text-md md:text-lg text-muted-foreground pb-10">Receive notifications for attendance updates</p>
        {loading ? (
          <Button disabled>
            <LoaderCircle className="size-5 animate-spin" />
            Loading
          </Button>
        ) : enabled ? (
          <Button onClick={handleDisable} variant={"outline"}>
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

      <div className="flex items-center justify-center gap-4 filter invert opacity-50">
        <Image
          src="/next.svg"
          alt="Qr Attendns Logo"
          width={300}
          height={300}
          className="size-20"
        />
        <Image
          src="/shadcn-ui.svg"
          alt="Qr Attendns Logo"
          width={100}
          height={100}
          className="size-6"
        />
        <Image
          src="/tailwind-css.svg"
          alt="Qr Attendns Logo"
          width={100}
          height={100}
          className="size-10"
        />
        <Image
          src="/vercel.svg"
          alt="Qr Attendns Logo"
          width={100}
          height={100}
          className="size-6"
        />
      </div>
    </section>
  );
}