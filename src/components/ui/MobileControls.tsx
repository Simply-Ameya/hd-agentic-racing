"use client";
import { useCallback } from "react";
import { CarControls } from "@/types/car.types";

interface MobileControlsProps {
  setControl: (key: keyof CarControls, value: boolean) => void;
}

interface ControlButtonProps {
  label: string;
  controlKey: keyof CarControls;
  setControl: (key: keyof CarControls, value: boolean) => void;
  className?: string;
}

function ControlButton({
  label,
  controlKey,
  setControl,
  className = "",
}: ControlButtonProps) {
  const handleStart = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      e.preventDefault();
      setControl(controlKey, true);
    },
    [controlKey, setControl],
  );

  const handleEnd = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      e.preventDefault();
      setControl(controlKey, false);
    },
    [controlKey, setControl],
  );

  return (
    <button
      className={`
        flex items-center justify-center
        w-16 h-16 rounded-full
        bg-white/20 border-2 border-white/40
        text-white font-bold text-xl
        active:bg-white/40 select-none
        touch-none ${className}
      `}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
    >
      {label}
    </button>
  );
}

export default function MobileControls({ setControl }: MobileControlsProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      <div className="flex justify-between items-end p-6 pointer-events-auto">
        {/* Left side — Steering */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-2">
            <ControlButton
              label="◀"
              controlKey="left"
              setControl={setControl}
            />
            <ControlButton
              label="▶"
              controlKey="right"
              setControl={setControl}
            />
          </div>
        </div>

        {/* Right side — Gas & Brake */}
        <div className="flex flex-col items-center gap-2">
          <ControlButton
            label="▲"
            controlKey="forward"
            setControl={setControl}
            className="bg-green-500/30 border-green-400/60"
          />
          <ControlButton
            label="▼"
            controlKey="brake"
            setControl={setControl}
            className="bg-red-500/30 border-red-400/60"
          />
        </div>
      </div>
    </div>
  );
}
