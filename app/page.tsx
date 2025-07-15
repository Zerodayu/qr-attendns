'use client';

import React, { useState } from "react";
import ScannerPage from "@/components/ScannerPage";
import Navbar from "@/components/navbar";

export default function Home() {
  const [qrValue, setQrValue] = useState<string>("");
  const [toggleValue, setToggleValue] = useState<"off" | "on">("off"); // "off" = Sign-in, "on" = Sign-out

  return (
    <section>
      <div className="flex">
        <Navbar toggleValue={toggleValue} setToggleValue={setToggleValue} />
        <div className="flex pt-15 w-full min-h-screen flex-col items-center justify-center pag-4">
          <ScannerPage
            className="w-full max-w-lg"
            onScanValue={setQrValue}
            toggleValue={toggleValue}
          />
          <h1 className="m-4 text-xl font-bold">
            {qrValue || "Scan a QR code"}
          </h1>
        </div>
      </div>
    </section>
  );
}