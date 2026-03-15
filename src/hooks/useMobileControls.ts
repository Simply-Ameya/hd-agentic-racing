import { useState, useCallback } from "react";
import { CarControls } from "@/types/car.types";

const defaultControls: CarControls = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  brake: false,
};

export function useMobileControls() {
  const [controls, setControls] = useState<CarControls>(defaultControls);

  const setControl = useCallback((key: keyof CarControls, value: boolean) => {
    setControls((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetControls = useCallback(() => {
    setControls(defaultControls);
  }, []);

  return { controls, setControl, resetControls };
}
