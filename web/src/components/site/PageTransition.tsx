import { ViewTransition, type ReactNode } from "react";

// Route content fades out and the next page rises in; the header stays put.
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      {children}
    </ViewTransition>
  );
}
