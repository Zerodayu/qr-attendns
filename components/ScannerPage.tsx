"use client";

import { useState } from "react";
import {
  Scanner,
  useDevices,
  outline,
  boundingBox,
  centerText,
} from "@yudiel/react-qr-scanner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ScannerPage({
  className,
  onScanValue,
  toggleValue,
}: {
  className?: string;
  onScanValue?: (value: string) => void;
  toggleValue: "off" | "on";
}) {
  const [deviceId, setDeviceId] = useState<string | undefined>(undefined);
  const [tracker, setTracker] = useState<string | undefined>("outline");
  const [pause, setPause] = useState(false);
  const [scannedValue, setScannedValue] = useState<string>("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertDescription, setAlertDescription] = useState<string>("");

  const devices = useDevices();

  function getTracker() {
    switch (tracker) {
      case "outline":
        return outline;
      case "boundingBox":
        return boundingBox;
      case "centerText":
        return centerText;
      default:
        return undefined;
    }
  }

  const handleScan = (data: string) => {
    setPause(true);
    setScannedValue(data);
    if (onScanValue) onScanValue(data);
    setAlertDescription(data);
    setAlertOpen(true);
    setPause(false);
  };

  return (
    <div className={`flex flex-col items-center w-full ${className ?? ""}`}>
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold self-center">{(toggleValue === "off" ? "Sign-in" : "Sign-out")}</AlertDialogTitle>
            <AlertDialogDescription className="text-md">
              {new Date().toLocaleDateString()} - {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} <br />
              <span className="text-primary font-semibold">{alertDescription}</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction> 
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <h1 className="p-4 text-2xl font-bold font-mono">
        {(toggleValue === "off" ? "Sign-in" : "Sign-out")}
      </h1>
      <div className="p-2 flex flex-col md:flex-row gap-2 w-full max-w-lg">
        <Select
          value={deviceId}
          onValueChange={(value) => setDeviceId(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a device" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Devices</SelectLabel>
              {devices.map((device, index) => (
                <SelectItem key={index} value={device.deviceId}>
                  {device.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          value={tracker ?? "none"}
          onValueChange={(value) => setTracker(value === "none" ? undefined : value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select tracker" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Tracker</SelectLabel>
              <SelectItem value="centerText">Center Text</SelectItem>
              <SelectItem value="outline">Outline</SelectItem>
              <SelectItem value="boundingBox">Bounding Box</SelectItem>
              <SelectItem value="none">No Tracker</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="w-full flex justify-center">
        <Scanner
          formats={[
            "qr_code",
            "micro_qr_code",
            "rm_qr_code",
            "maxi_code",
            "pdf417",
            "aztec",
            "data_matrix",
            "matrix_codes",
            "dx_film_edge",
            "databar",
            "databar_expanded",
            "codabar",
            "code_39",
            "code_93",
            "code_128",
            "ean_8",
            "ean_13",
            "itf",
            "linear_codes",
            "upc_a",
            "upc_e",
          ]}
          constraints={{
            deviceId: deviceId,
          }}
          onScan={(detectedCodes) => {
            handleScan(detectedCodes[0].rawValue);
          }}
          onError={(error) => {
            console.log(`onError: ${error}'`);
          }}
          styles={{
            container: {
              width: "100%",
              maxWidth: "400px",
              aspectRatio: "1/1",
            },
          }}
          components={{
            onOff: true,
            torch: true,
            zoom: true,
            finder: true,
            tracker: getTracker(),
          }}
          allowMultiple={true}
          scanDelay={2000}
          paused={pause}
        />
      </div>
    </div>
  );
}