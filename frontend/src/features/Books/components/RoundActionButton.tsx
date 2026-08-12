import { Button } from "@heroui/react";
import type { ReactNode } from "react";

export function RoundActionButton({
  label,
  isPending,
  children,
  type = "submit",
  onPress,
  className,
}: {
  label: string;
  isPending?: boolean;
  children: ReactNode;
  type?: "submit" | "button";
  onPress?: () => void;
  className?: string;
}) {
  return (
    <Button
      type={type}
      size="sm"
      isIconOnly
      aria-label={label}
      title={label}
      isPending={isPending}
      onPress={onPress}
      className={`h-10 w-10 shrink-0 rounded-full bg-[var(--lib-accent)] text-[var(--lib-accent-fg)] ${className ?? ""}`}
      data-round-save
    >
      {children}
    </Button>
  );
}
