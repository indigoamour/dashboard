"use client";

import { useState, useEffect } from "react";

import { StoreModal } from "@/components/modal/store-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <StoreModal />;
};
