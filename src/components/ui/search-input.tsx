// Search Input Component with Glass Morphism and Auto-complete
import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  onSelect?: (suggestion: string) => void;
  onClear?: () => void;
  placeholder?: string;
  suggestions?: string[];
  isLoading?: boolean;
  className?: string;
  showSuggestions?: boolean;
  maxSuggestions?: number;
  autoFocus?: true;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({
    value,
    onChange,
    onSearch,
    onSelect,
    onClear,
    placeholder = "Buscar ocupação...",
    suggestions = [],
    isLoading = false,
    className,
    showSuggestions = true,
    maxSuggestions = 5,
    autoFocus,
    ...props
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const suggestionRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const visibleSuggestions = suggestions.slice(0, maxSuggestions);
    const showSuggestionsList = showSuggestions && isFocused && value.length > 0 && visibleSuggestions.length > 0;

    useEffect(() => {
      if (ref) {
        if (typeof ref === 'function') {
          ref(inputRef.current);
        } else {
          ref.current = inputRef.current;
        }
      }
    }, [ref]);

    useEffect(() => {
      setHighlightedIndex(-1);
    }, [suggestions]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      onChange(newValue);
      setHighlightedIndex(-1);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!showSuggestionsList) {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleSearch();
        }
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex(prev => 
            prev < visibleSuggestions.length - 1 ? prev + 1 : 0
          );
          break;
          
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex(prev => 
            prev > 0 ? prev - 1 : visibleSuggestions.length - 1
          );
          break;
          
        case 'Enter':
          e.preventDefault();
          if (highlightedIndex >= 0 && highlightedIndex < visibleSuggestions.length) {
            handleSuggestionSelect(visibleSuggestions[highlightedIndex]);
          } else {
            handleSearch();
          }
          break;
          
        case 'Escape':
          e.preventDefault();
          setIsFocused(false);
          inputRef.current?.blur();
          break;
      }
    };

    const handleSearch = () => {
      if (value && onSearch) {
        onSearch(value);
      }
      setIsFocused(false);
    };

    const handleSuggestionSelect = (suggestion: string) => {
      console.log({suggestion});
      

      onChange(suggestion);
      onSelect?.(suggestion);
      setIsFocused(false);
      // handleSearch();
      setHighlightedIndex(-1);
    };

    const handleClear = () => {
      onChange('');
      onClear();
      inputRef.current?.focus();
    };

    const handleSuggestionMouseEnter = (index: number) => {
      setHighlightedIndex(index);
    };

    return (
      <div className={cn('relative w-full', className)}>
        {/* Main Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          
          <Input
            ref={inputRef}
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              // Delay hiding suggestions to allow for clicks
              setTimeout(() => setIsFocused(false), 150);
            }}
            placeholder={placeholder}
            className={cn(
              'pl-10 pr-20 h-12 text-base glass border-glass-border bg-glass-bg backdrop-blur-md',
              'focus:border-primary/50 focus:shadow-glow',
              'transition-all duration-300'
            )}
            autoFocus
            {...props}
          />

          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            {isLoading && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
            
            {value && !isLoading && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Limpar busca</span>
              </Button>
            )}

            <Button
              type="button"
              onClick={handleSearch}
              disabled={!value || isLoading}
              size="sm"
              className="h-8 bg-gradient-primary hover:shadow-glow transition-all duration-300"
            >
              <Search className="h-3 w-3" />
              <span className="sr-only">Buscar</span>
            </Button>
          </div>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestionsList && (
          <GlassCard
            variant="elevated"
            size="sm"
            className="absolute top-full left-0 right-0 my-2 max-h-50 overflow-y-auto z-[9999]"
          >
            <div className="space-y-1">
              {visibleSuggestions.map((suggestion, index) => (
                <button
                  key={suggestion}
                  ref={el => suggestionRefs.current[index] = el}
                  type="button"
                  onClick={() => handleSuggestionSelect(suggestion)}
                  onMouseEnter={() => handleSuggestionMouseEnter(index)}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200',
                    'hover:bg-primary/10 hover:text-primary',
                    highlightedIndex === index && 'bg-primary/10 text-primary'
                  )}
                >
                  <Search className="inline-block h-3 w-3 mr-2 opacity-50 z-[999999]" />
                  {suggestion}
                </button>
              ))}
            </div>
          </GlassCard>
        )}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';

export default SearchInput;