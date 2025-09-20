import { cn } from "@/lib/utils"
import { ChevronDownIcon } from "lucide-react"
import { useState, useRef, useEffect } from "react"

interface SelectOption {
  value: string | number
  label: string
  description?: string
}

interface SelectProps {
  options: SelectOption[]
  value?: string | number
  onValueChange?: (value: string | number) => void
  placeholder?: string
  className?: string
}

export function Select({
  options,
  value,
  onValueChange,
  placeholder = "Select...",
  className
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const selectedOption = options.find((option) => option.value === value)

  return (
    <div ref={selectRef} className={cn("relative", className)}>
      <button
        type="button"
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        )}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDownIcon
          className={cn(
            "h-4 w-4 opacity-50 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-md border bg-popover shadow-lg">
          <div className="max-h-60 overflow-auto p-1">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                className={cn(
                  "w-full rounded-sm px-2 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none",
                  value === option.value && "bg-accent text-accent-foreground"
                )}
                onClick={() => {
                  onValueChange?.(option.value)
                  setIsOpen(false)
                }}
              >
                <div className="font-medium">{option.label}</div>
                {option.description && (
                  <div className="text-xs text-muted-foreground">
                    {option.description}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
