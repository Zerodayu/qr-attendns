"use client";

import type { IScannerControls } from "@zxing/browser";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseQrScannerOptions {
  autoStart?: boolean;
  onError?: (error: Error) => void;
  onResult?: (text: string) => void;
}

interface UseQrScannerReturn {
  error: string | null;
  isCameraReady: boolean;
  isScanning: boolean;
  startScan: () => Promise<void>;
  stopScan: () => void;
}

export function useQrScanner(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  options: UseQrScannerOptions = {}
): UseQrScannerReturn {
  const { onResult, onError, autoStart = false } = options;
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const startedRef = useRef(false);

  const stopScan = useCallback(() => {
    controlsRef.current?.stop();
    controlsRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    startedRef.current = false;
    setIsScanning(false);
    setIsCameraReady(false);
  }, []);

  const startScan = useCallback(async () => {
    setError(null);
    stopScan();

    const reader = new BrowserMultiFormatReader();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;

      if (!videoRef.current) {
        throw new Error("Video element not found");
      }

      videoRef.current.srcObject = stream;
      setIsCameraReady(true);
      setIsScanning(true);

      const controls = await reader.decodeFromVideoDevice(
        undefined,
        videoRef.current,
        (result) => {
          if (result) {
            onResult?.(result.getText());
          }
        }
      );
      controlsRef.current = controls;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Camera access denied";
      setError(message);
      onError?.(err instanceof Error ? err : new Error(message));
      stopScan();
    }
  }, [videoRef, onResult, onError, stopScan]);

  useEffect(() => {
    if (autoStart && !startedRef.current) {
      startedRef.current = true;
      startScan();
    }

    return () => {
      stopScan();
    };
  }, [autoStart, startScan, stopScan]);

  return { isScanning, isCameraReady, error, startScan, stopScan };
}
