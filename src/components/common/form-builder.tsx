// FormBuilder - Generic Form Component with Glass Morphism
import React from 'react';
import { useForm, FormProvider, FieldValues, DefaultValues, ControllerRenderProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';

// Field Types
export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'switch';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FormFieldConfig {
  name: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  options?: SelectOption[]; // For select, radio, checkbox
  rows?: number; // For textarea
  min?: number; // For number
  max?: number; // For number
  step?: number; // For number
  className?: string;
  validation?: z.ZodType<any>;
  onChange?: (value: any) => void;
  value?: any; // For controlled components
}

export interface FormBuilderProps<T extends FieldValues = FieldValues> {
  fields: FormFieldConfig[];
  schema?: z.ZodType<T>;
  defaultValues?: DefaultValues<T>;
  onSubmit: (data: T) => void | Promise<void>;
  onReset?: (() => void);
  isLoading?: boolean;
  submitText?: string;
  resetText?: string;
  showReset?: boolean;
  className?: string;
  fieldClassName?: string;
  submitClassName?: string;
  variant?: 'default' | 'glass';
}

export function FormBuilder<T extends FieldValues = FieldValues>({
  fields,
  schema,
  defaultValues,
  onSubmit,
  onReset,
  isLoading = false,
  submitText = 'Enviar',
  resetText = 'Limpar',
  showReset = true,
  className,
  fieldClassName,
  submitClassName,
  variant = 'glass',
}: FormBuilderProps<T>) {
  // Generate dynamic schema if not provided
  const dynamicSchema = schema || z.object(
    fields.reduce((acc, field) => {
      let fieldSchema: any = z.string().default('');
      
      if (field.type === 'email') {
        fieldSchema = z.string().email('Email inválido').default('');
      } else if (field.type === 'number') {
        fieldSchema = z.coerce.number().default(0);
        if (field.min !== undefined) fieldSchema = fieldSchema.min(field.min);
        if (field.max !== undefined) fieldSchema = fieldSchema.max(field.max);
      } else if (field.type === 'checkbox' || field.type === 'switch') {
        fieldSchema = z.boolean().default(false);
      }
      
      if (field.required && field.type !== 'checkbox' && field.type !== 'switch') {
        if (field.type === 'number') {
          // For numbers, we don't use string min
        } else {
          fieldSchema = fieldSchema.min(1, 'Campo obrigatório');
        }
      } else if (!field.required) {
        fieldSchema = fieldSchema.optional();
      }
      
      // Apply custom validation if provided
      if (field.validation) {
        fieldSchema = field.validation;
      }

      if (field.value) {
        fieldSchema = fieldSchema.default(field.value);
      }
      
      acc[field.name] = fieldSchema;
      return acc;
    }, {} as any)
  );

  const {
    handleSubmit: hookFormHandleSubmit,
    reset,
    control,
    ...restForm
  } = useForm<T>({
    resolver: zodResolver(dynamicSchema),
    defaultValues,
  });

  const form = { control, handleSubmit: hookFormHandleSubmit, reset, ...restForm };

  const handleSubmit = hookFormHandleSubmit(async (data) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  });

  const handleReset = () => {
    reset();
    onReset();
  };
  
  const getBaseClassName = (fieldClassName?: string) => {
    return cn(
      'transition-all duration-300',
      variant === 'glass' && 'glass border-glass-border bg-glass-bg backdrop-blur-md',
      fieldClassName
    );
  }

  const renderField = (field: FormFieldConfig, formField: ControllerRenderProps<T>) => {
    const baseProps = {
      disabled: field.disabled || isLoading,
      placeholder: field.placeholder,
      className: cn(
        'transition-all duration-300',
        variant === 'glass' && 'glass border-glass-border bg-glass-bg backdrop-blur-md',
        field.className
      ),
    };
  
    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            {...formField}
            {...baseProps}
            rows={field.rows || 3}
            value={formField.value || ''}
          />
        );
  
      case 'select':
        return (
          <Select
            onValueChange={formField.onChange}
            defaultValue={formField.value}
            disabled={field.disabled || isLoading}
          >
            <FormControl>
              <SelectTrigger className={getBaseClassName(field.className)} ref={formField.ref}>
                <SelectValue placeholder={field.placeholder || "Selecione..."} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className={variant === 'glass' ? 'glass' : ''}>
              {field.options?.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
  
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <FormControl>
              <Checkbox
                checked={formField.value}
                onCheckedChange={formField.onChange}
                disabled={field.disabled || isLoading}
                className={variant === 'glass' ? 'border-glass-border' : ''}
                ref={formField.ref}
              />
            </FormControl>
            <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {field.label}
            </FormLabel>
          </div>
        );
  
      case 'radio':
        return (
          <RadioGroup
            onValueChange={formField.onChange}
            defaultValue={formField.value}
            value={formField.value}
            disabled={field.disabled || isLoading}
            className="flex flex-col space-y-2"
          >
            <FormControl>
              <div ref={formField.ref} className="flex flex-col space-y-2">
                {field.options?.map((option) => (
                  <FormItem
                    key={option.value}
                    className="flex items-center space-x-3 space-y-0"
                  >
                    <FormControl>
                      <RadioGroupItem
                        value={option.value}
                        disabled={option.disabled}
                        className={variant === 'glass' ? 'border-glass-border' : ''}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">{option.label}</FormLabel>
                  </FormItem>
                ))}
              </div>
            </FormControl>
          </RadioGroup>
        );
  
      case 'switch':
        return (
          <div className="flex items-center space-x-2">
            <FormControl>
              <Switch
                checked={formField.value}
                onCheckedChange={formField.onChange}
                disabled={field.disabled || isLoading}
                className={variant === 'glass' ? 'data-[state=checked]:bg-primary' : ''}
                ref={formField.ref}
              />
            </FormControl>
            <FormLabel className="text-sm font-medium leading-none">
              {field.label}
            </FormLabel>
          </div>
        );
  
      case 'number':
        return (
          <Input
            {...formField}
            {...baseProps}
            type="number"
            min={field.min}
            max={field.max}
            step={field.step}
            value={formField.value || 0}
          />
        );
  
      default:
        return (
          <Input
            {...formField}
            {...baseProps}
            type={field.type}
            value={formField.value || ''}
          />
        );
    }
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={handleSubmit}
        className={cn(
          'space-y-6',
          variant === 'glass' && 'glass-card',
          className
        )}
      >
        <div className={cn('grid gap-4', fieldClassName)}>
          {fields.map((field) => (
            <FormField
              key={field.name}
              control={control}
              name={field.name as any}
              render={({ field: formField }) => (
                <FormItem className="space-y-2">
                  {field.type !== 'checkbox' && field.type !== 'switch' && (
                    <FormLabel className="text-sm font-medium">
                      {field.label}
                      {field.required && (
                        <span className="ml-1 text-destructive">*</span>
                      )}
                    </FormLabel>
                  )}
                  {renderField(field, formField)}
                  {field.description && (
                    <FormDescription className="text-xs text-muted-foreground">
                      {field.description}
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className={cn(
              'flex-1 bg-gradient-primary hover:shadow-glow transition-all duration-300',
              variant === 'glass' && 'glass-card border-primary/30',
              submitClassName
            )}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitText}
          </Button>
          
          {showReset && (
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={isLoading}
              className={cn(
                'transition-all duration-300',
                variant === 'glass' && 'glass border-glass-border hover:bg-glass-bg/80'
              )}
            >
              {resetText}
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}

export default FormBuilder;