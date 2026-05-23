/**
 * Gates scroll/entrance animations until the loading screen has faded out.
 */

"use client";

import { createContext, useContext } from "react";

export const PortfolioReadyContext = createContext(false);

export function usePortfolioReady(): boolean {
  return useContext(PortfolioReadyContext);
}
