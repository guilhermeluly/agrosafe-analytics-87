
"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ComboboxProps {
  options: { value: string; label: string }[]
  value?: string
  onSelect: (value: string) => void
  placeholder?: string
  emptyMessage?: string
  className?: string
  allowCustomValue?: boolean
}

export function Combobox({
  options,
  value,
  onSelect,
  placeholder = "Selecione uma opção...",
  emptyMessage = "Nenhuma opção encontrada.",
  className,
  allowCustomValue = false
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

  // Find the selected option's label or use the value as the label if it's a custom value
  const displayValue = React.useMemo(() => {
    const selectedOption = options.find((option) => option.value === value)
    return selectedOption ? selectedOption.label : (value || placeholder)
  }, [value, options, placeholder])

  // Handle input change for custom value support
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  // Allow entering custom values if enabled
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (allowCustomValue && e.key === 'Enter' && inputValue) {
      e.preventDefault()
      onSelect(inputValue)
      setOpen(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between text-left font-normal", className)}
          size="sm"
        >
          {displayValue}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command onKeyDown={handleKeyDown}>
          <CommandInput 
            placeholder={placeholder} 
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandEmpty>
            {allowCustomValue ? (
              <div className="flex flex-col gap-1 p-2">
                <span>{emptyMessage}</span>
                <span className="text-xs text-muted-foreground">
                  Pressione Enter para usar "{inputValue}"
                </span>
              </div>
            ) : (
              emptyMessage
            )}
          </CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={() => {
                  onSelect(option.value)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
