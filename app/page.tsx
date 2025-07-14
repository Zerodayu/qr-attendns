'use client';

import React, { useState } from "react";
import ScannerPage from "@/components/ScannerPage";

export default function Home() {
  const [qrValue, setQrValue] = useState<string>("");

  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-center pag-4">
      <ScannerPage
        className="w-full max-w-lg"
        onScanValue={setQrValue}
      />
      <h1 className="m-4 text-2xl font-bold font-mono">{qrValue || "QR code value"}</h1>
    </section>
  );
}