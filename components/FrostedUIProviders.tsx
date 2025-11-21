"use client";

import { TooltipProvider, Toaster } from "@whop/frosted-ui";

export default function FrostedUIProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      {children}
      <Toaster />
    </TooltipProvider>
  );
}

