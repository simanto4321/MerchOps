"use client";

import { Button } from "./ui/button";

export function PrintActions() {
  return (
    <Button type="button" onClick={() => window.print()}>
      Print / Save PDF
    </Button>
  );
}
