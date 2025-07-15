'use client';

import React, { useState } from "react";
import { useQRCode } from 'next-qrcode';
import { QrCode, ScanQrCode } from 'lucide-react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import Link from "next/link";
import Protected from "@/components/Password";

export default function QRGen() {
    const { Image } = useQRCode();
    const [qrText, setQrText] = useState("");

    const form = useForm<{ name: string }>({
        defaultValues: { name: "" },
    });

    function onSubmit(data: { name: string }) {
        setQrText(data.name);
    }

    return (
        <Protected>
        <section>
            <div className="fixed top-0 inline-flex m-6 mix-blend-difference filter grayscale">
            <Link href="/main">
                <ScanQrCode className="size-10" />
            </Link>
            </div>
            <div className="p-6 gap-4 flex flex-col items-center justify-center h-screen">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold">QR Code Generator</h1>
                    <p>Generate QR codes here to download.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter a name" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            This is the name or text for your QR code.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" variant="secondary">
                                Generate QR Code
                            </Button>
                        </form>
                    </Form>

                    <div className="flex flex-col items-center justify-center gap-2">
                        <h1 className="text-lg md:text-2xl font-mono">{qrText ? qrText : "Qr Code"}</h1>
                        <div className="flex items-center justify-center w-full h-auto">
                            {qrText
                                ? (
                                    <Image
                                        text={qrText}
                                        options={{
                                            type: 'image/png',
                                            quality: 1,
                                            errorCorrectionLevel: 'M',
                                            margin: 2,
                                            scale: 10,
                                            width: 500,
                                            color: {
                                                dark: '#000000FF',
                                                light: '#FFFFFFFF',
                                            },
                                        }}
                                    />
                                )
                                : (
                                    <QrCode className="size-70" />
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </section>
        </Protected>
    );
}