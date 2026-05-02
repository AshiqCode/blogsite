interface AdSlotProps {
  label?: string;
  className?: string;
}
export const AdSlot = ({ label = "Advertisement", className = "" }: AdSlotProps) => (
  <div className={`flex items-center justify-center rounded-lg border border-dashed border-border bg-secondary/40 text-xs text-muted-foreground py-8 px-4 ${className}`}>
    <span>{label}</span>
  </div>
);
