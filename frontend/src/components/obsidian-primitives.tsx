import {
  createContext,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

const join = (...classes: Array<string | undefined>) =>
  classes.filter(Boolean).join(" ");

type PressableProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  onPress?: () => void;
  isDisabled?: boolean;
  variant?: string;
  size?: string;
  isIconOnly?: boolean;
  isPending?: boolean;
};

export function Button({ onPress, isDisabled, isPending, isIconOnly, className, type, ...props }: PressableProps) {
  return <button type={type ?? "button"} disabled={isDisabled} onClick={onPress} className={join("obsidian-button", className)} {...props} />;
}

export function ButtonGroup({ className, children }: HTMLAttributes<HTMLDivElement> & { size?: string; variant?: string }) {
  return <div className={join("obsidian-button-group", className)}>{children}</div>;
}

export function Spinner({ className }: { className?: string; size?: string }) {
  return <span className={join("obsidian-spinner", className)} aria-label="読み込み中" role="status" />;
}

export function Chip({ className, children }: HTMLAttributes<HTMLSpanElement> & { color?: string; size?: string; variant?: string }) {
  return <span className={join("obsidian-chip", className)}>{children}</span>;
}

export function EmptyState({ className, children }: HTMLAttributes<HTMLDivElement>) {
  return <div className={join("obsidian-empty", className)}>{children}</div>;
}

export function Avatar({ className, children }: HTMLAttributes<HTMLDivElement>) {
  return <span className={join("obsidian-avatar", className)} aria-hidden="true">{children}</span>;
}

export function Label({ className, children, ...props }: HTMLAttributes<HTMLLabelElement>) {
  return <label className={join("obsidian-label", className)} {...props}>{children}</label>;
}

export function TextField({ className, children, onChange }: any) {
  return <div className={join("obsidian-field", className)} onChange={(event) => onChange?.((event.target as HTMLInputElement).value)}>{children}</div>;
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={join("obsidian-input", className)} {...props} />;
}

export function Form({ className, children, ...props }: React.FormHTMLAttributes<HTMLFormElement>) {
  return <form className={join("obsidian-form", className)} {...props}>{children}</form>;
}

export function Typography({ className, children }: HTMLAttributes<HTMLParagraphElement> & { type?: string }) {
  return <p className={join("obsidian-copy", className)}>{children}</p>;
}

export function Surface({ className, children }: HTMLAttributes<HTMLDivElement> & { variant?: string }) {
  return <section className={join("obsidian-surface", className)}>{children}</section>;
}

export const Alert = Object.assign(
  ({ className, children }: HTMLAttributes<HTMLDivElement> & { status?: string }) => <div className={join("obsidian-alert", className)} role="alert">{children}</div>,
  {
    Indicator: () => <span className="obsidian-alert-marker" aria-hidden="true">!</span>,
    Content: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
    Title: ({ children }: { children?: ReactNode }) => <p className="m-0 font-semibold">{children}</p>,
    Description: ({ children }: { children?: ReactNode }) => <p className="m-0 mt-1 text-sm">{children}</p>,
  },
);

type SelectState = {
  value: string | null;
  setValue: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  labels: Record<string, string>;
  register: (id: string, label: string) => void;
  disabled?: boolean;
};
const SelectContext = createContext<SelectState | null>(null);
const useSelect = () => {
  const state = useContext(SelectContext);
  if (!state) throw new Error("Select subcomponents must be nested inside Select.");
  return state;
};

function SelectRoot({ value, onChange, isDisabled, children, className, ...props }: any) {
  const [open, setOpen] = useState(false);
  const [labels, setLabels] = useState<Record<string, string>>({});
  const state = useMemo<SelectState>(() => ({
    value,
    setValue: (next) => { onChange(next); setOpen(false); },
    open,
    setOpen,
    labels,
    register: (id, label) => setLabels((current) => current[id] === label ? current : { ...current, [id]: label }),
    disabled: isDisabled,
  }), [value, onChange, open, labels, isDisabled]);
  return <SelectContext.Provider value={state}><div className={join("obsidian-select", className)} {...props}>{children}</div></SelectContext.Provider>;
}

function SelectTrigger({ className, children }: HTMLAttributes<HTMLButtonElement>) {
  const { open, setOpen, disabled } = useSelect();
  return <button type="button" className={join("obsidian-select-trigger", className)} onClick={() => setOpen(!open)} disabled={disabled} aria-expanded={open}>{children}</button>;
}
function SelectValue({ className }: { className?: string }) {
  const { value, labels } = useSelect();
  return <span className={join("truncate", className)}>{value == null ? "選択" : (labels[value] ?? value)}</span>;
}
function SelectIndicator({ className }: { className?: string }) { return <span className={join("obsidian-select-indicator", className)} aria-hidden="true">⌄</span>; }
function SelectPopover({ className, children }: HTMLAttributes<HTMLDivElement>) { const { open } = useSelect(); return open ? <div className={join("obsidian-popover", className)}>{children}</div> : null; }
export const Select: any = Object.assign(SelectRoot, { Trigger: SelectTrigger, Value: SelectValue, Indicator: SelectIndicator, Popover: SelectPopover });

function ListBoxRoot({ className, children }: HTMLAttributes<HTMLDivElement>) { return <div className={join("obsidian-listbox", className)} role="listbox">{children}</div>; }
function ListBoxItem({ id, textValue, className, children }: HTMLAttributes<HTMLButtonElement> & { id: string; textValue?: string }) {
  const { value, setValue, register } = useSelect();
  useEffect(() => { register(id, textValue ?? (typeof children === "string" ? children : id)); }, [children, id, register, textValue]);
  return <button type="button" role="option" aria-selected={value === id} className={join("obsidian-listbox-item", className)} onClick={() => setValue(id)}>{children}</button>;
}
export const ListBox: any = Object.assign(ListBoxRoot, { Item: ListBoxItem, ItemIndicator: ({ className }: { className?: string }) => <span className={className} aria-hidden="true">✓</span> });

type NumberState = { value: number; onChange: (value: number) => void; min?: number; max?: number; id: string };
const NumberContext = createContext<NumberState | null>(null);
function NumberFieldRoot({ value, onChange, minValue, maxValue, children, className }: { value: number; onChange: (value: number) => void; minValue?: number; maxValue?: number; children?: ReactNode; className?: string }) {
  const id = useId();
  return <NumberContext.Provider value={{ value, onChange, min: minValue, max: maxValue, id }}><div className={join("obsidian-field", className)}>{children}</div></NumberContext.Provider>;
}
function NumberGroup({ children, className }: { children?: ReactNode; className?: string }) { return <div className={className}>{children}</div>; }
function NumberInput({ className }: { className?: string }) { const state = useContext(NumberContext); if (!state) throw new Error("NumberField.Input must be nested inside NumberField."); return <input id={state.id} type="number" min={state.min} max={state.max} value={state.value} onChange={(event) => state.onChange(Number(event.target.value))} className={join("obsidian-input", className)} />; }
export const NumberField = Object.assign(NumberFieldRoot, { Group: NumberGroup, Input: NumberInput });

export const Table = Object.assign(
  ({ className, children }: HTMLAttributes<HTMLDivElement>) => <div className={join("obsidian-table-wrap", className)}>{children}</div>,
  {
    ScrollContainer: ({ children }: { children?: ReactNode }) => <div className="overflow-x-auto">{children}</div>,
    Content: ({ children, ...props }: React.TableHTMLAttributes<HTMLTableElement>) => <table className="obsidian-table" {...props}>{children}</table>,
    Header: ({ children }: { children?: ReactNode }) => <thead>{children}</thead>,
    Column: ({ children }: { children?: ReactNode; isRowHeader?: boolean }) => <th scope="col">{children}</th>,
    Body: ({ children }: { children?: ReactNode }) => <tbody>{children}</tbody>,
    Row: ({ className, children }: HTMLAttributes<HTMLTableRowElement>) => <tr className={className}>{children}</tr>,
    Cell: ({ children }: { children?: ReactNode }) => <td>{children}</td>,
  },
);
