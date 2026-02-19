'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/buttons';
import IconButton from '@/app/components/ui/buttons/icon-button/icon-button';
import Input from '@/app/components/ui/inputs/input';
import { Textarea, SelectMenu } from '@/app/components/ui/inputs';
import TimePicker from '@/app/components/ui/inputs/time-picker';
import TimePickerOld from '@/app/components/ui/inputs/time-picker-old';
import DatePicker from '@/app/components/ui/inputs/date-picker';
import { Label } from '@/app/components/ui/label';
import { Settings, Trash2, Plus, X, Heart, Share2 } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from '@/app/components/ui/form';
import WarningIcon from '@/app/components/ui/icons/warning-icon';

const testSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type TestFormData = z.infer<typeof testSchema>;

export default function ComponentTestPage() {
  const [inputValue, setInputValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const [time, setTime] = useState<Date | null>(() => {
    const date = new Date();
    date.setHours(9, 0, 0, 0);
    return date;
  });
  const [timeOld, setTimeOld] = useState<Date | null>(() => {
    const date = new Date();
    date.setHours(9, 0, 0, 0);
    return date;
  });
  const [shiftStartDate, setShiftStartDate] = useState<Date | null>(new Date());
  const [shiftEndDate, setShiftEndDate] = useState<Date | null>(null);
  const [availabilityDate, setAvailabilityDate] = useState<Date | null>(null);
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<TestFormData>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const selectOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
    { value: 'option4', label: 'Option 4 - Long Text Example' },
  ];

  // Helper to create time Date objects
  const createTimeDate = (hours: number, minutes: number) => {
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  // Format time for display
  const formatTimeDisplay = (date: Date | null) => {
    if (!date) return '';
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    return `${displayHours}:${displayMinutes} ${period}`;
  };

  const formatDateDisplay = (date: Date | null) => {
    if (!date) return 'Not set';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const today = new Date();
  const availabilityWindowMinDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    1,
  );
  const availabilityWindowMaxDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    21,
  );
  const isWeekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6;

  const handleLoadingTest = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className='mx-auto max-w-6xl space-y-12 p-8'>
      {/* Header */}
      <div className='space-y-4'>
        <div>
          <h1 className='typescale-headline-large mb-2'>
            UI Component Library
          </h1>
          <p className='typescale-body-large text-on-surface-variant'>
            Visual testing ground for all base UI components. Scroll or use
            quick navigation below.
          </p>
        </div>

        {/* Mobile Quick Navigation */}
        <div className='lg:hidden'>
          <Card className='border border-outline-variant'>
            <CardContent className='p-4'>
              <p className='mb-3 text-sm font-medium'>Quick Jump</p>
              <div className='flex flex-wrap gap-2'>
                <Button
                  variant='tonal'
                  onClick={() => scrollToSection('buttons')}
                >
                  Buttons
                </Button>
                <Button
                  variant='tonal'
                  onClick={() => scrollToSection('inputs')}
                >
                  Inputs
                </Button>
                <Button
                  variant='tonal'
                  onClick={() => scrollToSection('form-components')}
                >
                  Forms
                </Button>
                <Button
                  variant='tonal'
                  onClick={() => scrollToSection('date-picker')}
                >
                  Date Picker
                </Button>
                <Button
                  variant='tonal'
                  onClick={() => scrollToSection('cards')}
                >
                  Cards
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Desktop Quick Navigation */}
        <div className='hidden lg:block'>
          <Card className='border border-outline-variant'>
            <CardContent className='p-4'>
              <p className='mb-3 text-sm font-medium'>Quick Jump to Section</p>
              <div className='flex flex-wrap gap-2'>
                <Button
                  variant='tonal'
                  onClick={() => scrollToSection('buttons')}
                >
                  Buttons
                </Button>
                <Button
                  variant='tonal'
                  onClick={() => scrollToSection('icon-buttons')}
                >
                  Icon Buttons
                </Button>
                <Button
                  variant='tonal'
                  onClick={() => scrollToSection('inputs')}
                >
                  Inputs
                </Button>
                <Button
                  variant='tonal'
                  onClick={() => scrollToSection('textarea')}
                >
                  Textarea
                </Button>
                <Button
                  variant='tonal'
                  onClick={() => scrollToSection('select')}
                >
                  Select
                </Button>
                <Button
                  variant='tonal'
                  onClick={() => scrollToSection('time-picker')}
                >
                  Time Picker
                </Button>
                <Button
                  variant='tonal'
                  onClick={() => scrollToSection('date-picker')}
                >
                  Date Picker
                </Button>
                <Button
                  variant='tonal'
                  onClick={() => scrollToSection('form-components')}
                >
                  Form Components
                </Button>
                <Button
                  variant='tonal'
                  onClick={() => scrollToSection('cards')}
                >
                  Cards
                </Button>
                <Button
                  variant='tonal'
                  onClick={() => scrollToSection('labels')}
                >
                  Labels
                </Button>
                <Button
                  variant='tonal'
                  onClick={() => scrollToSection('checklist')}
                >
                  Checklist
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* BUTTONS SECTION */}
      <section id='buttons' className='scroll-mt-8'>
        <div className='mb-6 border-b-2 border-primary pb-4'>
          <h2 className='typescale-headline-medium mb-2 text-primary'>
            Button Component
          </h2>
          <p className='typescale-body-medium text-on-surface-variant'>
            All button variants with different states and sizes
          </p>
        </div>

        <Card className='border-none shadow-elevation-2'>
          <CardContent className='space-y-8 pt-6'>
            <div>
              <Label className='typescale-title-medium mb-3 block'>
                Filled Variant (Primary Actions)
              </Label>
              <div className='flex flex-wrap gap-3'>
                <Button variant='filled'>Default</Button>
                <Button variant='filled' disabled>
                  Disabled
                </Button>
                <Button
                  variant='filled'
                  loading={isLoading}
                  loadingText='Loading...'
                  onClick={handleLoadingTest}
                >
                  Click to Load
                </Button>
              </div>
            </div>

            <div>
              <Label className='typescale-title-medium mb-3 block'>
                Outlined Variant (Secondary Actions)
              </Label>
              <div className='flex flex-wrap gap-3'>
                <Button variant='outlined'>Default</Button>
                <Button variant='outlined' disabled>
                  Disabled
                </Button>
                <Button variant='outlined' loading={isLoading}>
                  Loading State
                </Button>
              </div>
            </div>

            <div>
              <Label className='typescale-title-medium mb-3 block'>
                Tonal Variant (Alternative Secondary)
              </Label>
              <div className='flex flex-wrap gap-3'>
                <Button variant='tonal'>Default</Button>
                <Button variant='tonal' disabled>
                  Disabled
                </Button>
                <Button variant='tonal' loading={isLoading}>
                  Loading State
                </Button>
              </div>
            </div>

            <div>
              <Label className='typescale-title-medium mb-3 block'>
                Text Variant (Low Priority / Navigation)
              </Label>
              <div className='flex flex-wrap gap-3'>
                <Button variant='text'>Default</Button>
                <Button variant='text' disabled>
                  Disabled
                </Button>
                <Button variant='text'>Skip for Now</Button>
                <Button variant='text'>Back</Button>
              </div>
            </div>

            <div>
              <Label className='typescale-title-medium mb-3 block'>
                Elevated Variant (Special Emphasis)
              </Label>
              <div className='flex flex-wrap gap-3'>
                <Button variant='elevated'>Default</Button>
                <Button variant='elevated' disabled>
                  Disabled
                </Button>
                <Button variant='elevated' loading={isLoading}>
                  Loading State
                </Button>
              </div>
            </div>

            <div>
              <Label className='typescale-title-medium mb-3 block'>
                Button Sizes
              </Label>
              <div className='flex flex-wrap items-center gap-3'>
                <Button variant='filled'>Default Size</Button>
                <Button variant='filled' size='large'>
                  Large Size
                </Button>
              </div>
            </div>

            <div>
              <Label className='typescale-title-medium mb-3 block'>
                Full Width Button
              </Label>
              <Button variant='filled' className='w-full'>
                Full Width Button
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ICON BUTTONS SECTION */}
      <section id='icon-buttons' className='scroll-mt-8'>
        <div className='mb-6 border-b-2 border-primary pb-4'>
          <h2 className='typescale-headline-medium mb-2 text-primary'>
            Icon Button Component
          </h2>
          <p className='typescale-body-medium text-on-surface-variant'>
            Icon-only buttons with focus outline transition - Tab to test keyboard navigation
          </p>
        </div>

        <Card className='border-none shadow-elevation-2'>
          <CardContent className='space-y-8 pt-6'>
            <div>
              <Label className='typescale-title-medium mb-3 block'>
                Filled Variant
              </Label>
              <div className='flex flex-wrap items-center gap-3'>
                <IconButton variant='filled' icon={<Settings />} />
                <IconButton variant='filled' icon={<Plus />} />
                <IconButton variant='filled' icon={<Heart />} />
                <IconButton variant='filled' icon={<Share2 />} disabled />
                <IconButton variant='filled' icon={<Trash2 />} loading />
              </div>
            </div>

            <div>
              <Label className='typescale-title-medium mb-3 block'>
                Tonal Variant
              </Label>
              <div className='flex flex-wrap items-center gap-3'>
                <IconButton variant='tonal' icon={<Settings />} />
                <IconButton variant='tonal' icon={<Plus />} />
                <IconButton variant='tonal' icon={<Heart />} />
                <IconButton variant='tonal' icon={<Share2 />} disabled />
              </div>
            </div>

            <div>
              <Label className='typescale-title-medium mb-3 block'>
                Outlined Variant
              </Label>
              <div className='flex flex-wrap items-center gap-3'>
                <IconButton variant='outlined' icon={<Settings />} />
                <IconButton variant='outlined' icon={<Plus />} />
                <IconButton variant='outlined' icon={<X />} />
                <IconButton variant='outlined' icon={<Trash2 />} disabled />
              </div>
            </div>

            <div>
              <Label className='typescale-title-medium mb-3 block'>
                Standard Variant (Text-like)
              </Label>
              <div className='flex flex-wrap items-center gap-3'>
                <IconButton variant='standard' icon={<Settings />} />
                <IconButton variant='standard' icon={<Plus />} />
                <IconButton variant='standard' icon={<X />} />
                <IconButton variant='standard' icon={<Trash2 />} disabled />
              </div>
            </div>

            <div>
              <Label className='typescale-title-medium mb-3 block'>
                Sizes (xs, small, medium, large)
              </Label>
              <div className='flex flex-wrap items-center gap-3'>
                <IconButton variant='filled' size='xs' icon={<Settings />} />
                <IconButton variant='filled' size='small' icon={<Settings />} />
                <IconButton variant='filled' size='medium' icon={<Settings />} />
                <IconButton variant='filled' size='large' icon={<Settings />} />
              </div>
            </div>

            <div>
              <Label className='typescale-title-medium mb-3 block'>
                Focus Ring Transition Test
              </Label>
              <p className='typescale-body-small mb-3 text-on-surface-variant'>
                Use Tab to navigate to these buttons, then press Space or Enter. Watch the outline smoothly transition with the border-radius change.
              </p>
              <div className='flex flex-wrap items-center gap-4'>
                <IconButton variant='filled' icon={<Heart />} />
                <IconButton variant='tonal' icon={<Plus />} />
                <IconButton variant='outlined' icon={<Settings />} />
                <IconButton variant='standard' icon={<Share2 />} />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* I   </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* INPUT FIELDS SECTION */}
      <section id='inputs' className='scroll-mt-8'>
        <div className='mb-6 border-b-2 border-primary pb-4'>
          <h2 className='typescale-headline-medium mb-2 text-primary'>
            Input Component
          </h2>
          <p className='typescale-body-medium text-on-surface-variant'>
            Text input with various states, with and without placeholders
          </p>
        </div>

        <Card className='border-none shadow-elevation-2'>
          <CardContent className='space-y-6 pt-6'>
            <div>
              <Label className='typescale-title-medium mb-3 block'>
                With Placeholder (Label Floats)
              </Label>
              <Input
                label='Email Address *'
                type='email'
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder='Enter your email'
              />
              <p className='mt-2 text-xs text-on-surface-variant'>
                Notice: Label floats above when placeholder is present
              </p>
            </div>

            <div>
              <Label className='typescale-title-medium mb-3 block'>
                Without Placeholder (Label Inside)
              </Label>
              <Input label='Password *' type='password' />
              <p className='mt-2 text-xs text-on-surface-variant'>
                Notice: Label stays inside until focus or value
              </p>
            </div>

            <div>
              <Label className='typescale-title-medium mb-3 block'>
                Error State
              </Label>
              <Input
                label='Username *'
                type='text'
                error={true}
                errorMessage='Username must be at least 3 characters'
              />
            </div>

            <div>
              <Label className='typescale-title-medium mb-3 block'>
                Disabled State
              </Label>
              <Input
                label='Disabled Field'
                type='text'
                value='Cannot edit this'
                disabled
              />
            </div>

            <div>
              <Label className='typescale-title-medium mb-3 block'>
                Various Input Types
              </Label>
              <div className='grid gap-6 md:grid-cols-2'>
                <Input label='Full Name *' type='text' placeholder='John Doe' />
                <Input
                  label='Email *'
                  type='email'
                  placeholder='john@example.com'
                />
                <Input
                  label='Phone Number'
                  type='tel'
                  placeholder='(555) 123-4567'
                />
                <Input label='Hire Date' type='date' />
                <Input label='Hire Date' type='time' />
                <Input label='Salary' type='number' placeholder='50000' />
                <Input
                  label='Website URL'
                  type='url'
                  placeholder='https://example.com'
                />
              </div>
            </div>

            <div>
              <Label className='typescale-title-medium mb-3 block'>
                Interactive Error Toggle
              </Label>
              <Button
                variant='outlined'
                onClick={() => setShowError(!showError)}
              >
                {showError ? 'Hide' : 'Show'} Error State
              </Button>
              {showError && (
                <div className='mt-4'>
                  <Input
                    label='Test Field *'
                    type='text'
                    error={true}
                    errorMessage='This field is required'
                    placeholder='Type something'
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* TEXTAREA SECTION */}
      <section id='textarea' className='scroll-mt-8'>
        <div className='mb-6 border-b-2 border-primary pb-4'>
          <h2 className='typescale-headline-medium mb-2 text-primary'>
            Textarea Component
          </h2>
          <p className='typescale-body-medium text-on-surface-variant'>
            Multi-line text input with and without placeholders
          </p>
        </div>

        <Card className='border-none shadow-elevation-2'>
          <CardContent className='space-y-6 pt-6'>
            <div>
              <Label className='typescale-title-medium mb-3 block'>
                With Placeholder
              </Label>
              <Textarea
                label='Description *'
                value={textareaValue}
                onChange={e => setTextareaValue(e.target.value)}
                placeholder='Enter a detailed description...'
              />
            </div>

            <div>
              <Label className='typescale-title-medium mb-3 block'>
                Without Placeholder
              </Label>
              <Textarea label='Notes' />
            </div>

            <div>
              <Label className='typescale-title-medium mb-3 block'>
                Error State
              </Label>
              <Textarea
                label='Comments *'
                error={true}
                errorMessage='Please provide additional details'
                placeholder='Enter comments...'
              />
            </div>

            <div>
              <Label className='typescale-title-medium mb-3 block'>
                Disabled State
              </Label>
              <Textarea
                label='Read-only Notes'
                value='This content cannot be edited'
                disabled
              />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* SELECT MENU SECTION */}
      <section id='select' className='scroll-mt-8'>
        <div className='mb-6 border-b-2 border-primary pb-4'>
          <h2 className='typescale-headline-medium mb-2 text-primary'>
            SelectMenu Component
          </h2>
          <p className='typescale-body-medium text-on-surface-variant'>
            Dropdown select with options and states
          </p>
        </div>

        <Card className='border-none shadow-elevation-2'>
          <CardContent className='space-y-6 pt-6'>
            <div>
              <Label className='typescale-title-medium mb-3 block'>
                Default State
              </Label>
              <SelectMenu
                name='test-select'
                label='Choose an Option *'
                value={selectValue}
                onChange={setSelectValue}
                options={selectOptions}
              />
            </div>

            <div>
              <Label className='typescale-title-medium mb-3 block'>
                Error State
              </Label>
              <SelectMenu
                name='error-select'
                label='Required Selection *'
                value=''
                onChange={() => {}}
                options={selectOptions}
                error={true}
                errorMessage='Please select an option'
              />
              <p className='mt-2 text-xs text-on-surface-variant'>
                Note: This is to display error state, selecting an item is not
                possible
              </p>
            </div>

            <div>
              <Label className='typescale-title-medium mb-3 block'>
                Disabled State
              </Label>
              <SelectMenu
                name='disabled-select'
                label='Disabled Dropdown'
                value='option2'
                onChange={() => {}}
                options={selectOptions}
                disabled
              />
            </div>

            {selectValue && (
              <div className='rounded-lg bg-tertiary-container p-4'>
                <p className='text-sm text-on-tertiary-container'>
                  <strong>Selected Value:</strong> {selectValue}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* TIME PICKER SECTION */}
      <section id='time-picker' className='scroll-mt-8'>
        <div className='mb-6 border-b-2 border-primary pb-4'>
          <h2 className='typescale-headline-medium mb-2 text-primary'>
            TimePicker Component (Refactored)
          </h2>
          <p className='typescale-body-medium text-on-surface-variant'>
            New modular architecture - 70% smaller, better organized
          </p>
        </div>

        <Card className='border-none shadow-elevation-2'>
          <CardContent className='space-y-8 pt-6'>
            <div>
              <Label className='typescale-title-medium mb-3 block'>
                Interactive Time Picker (New)
              </Label>
              <p className='mb-4 text-sm text-on-surface-variant'>
                Click or drag on the clock face, or type directly into the inputs.
                Supports keyboard navigation with Tab and Arrow keys.
              </p>
              <TimePicker
                label='Select Time *'
                value={time}
                onChange={setTime}
              />
            </div>

            <div>
              <Label className='typescale-title-medium mb-3 block'>
                With Custom Label
              </Label>
              <TimePicker
                label='Shift Start Time *'
                value={createTimeDate(8, 30)}
                onChange={() => {}}
              />
            </div>

            <div>
              <Label className='typescale-title-medium mb-3 block'>
                Error State
              </Label>
              <TimePicker
                label='Appointment Time *'
                value={null}
                onChange={() => {}}
                error={true}
                errorMessage='Please select a valid time'
              />
            </div>

            <div>
              <Label className='typescale-title-medium mb-3 block'>
                Disabled State
              </Label>
              <TimePicker
                label='Locked Time'
                value={createTimeDate(14, 15)}
                onChange={() => {}}
                disabled
              />
            </div>

            {time && (
              <div className='rounded-lg bg-tertiary-container p-4'>
                <p className='text-sm text-on-tertiary-container'>
                  <strong>Selected Time:</strong> {formatTimeDisplay(time)}
                </p>
                <p className='mt-2 text-xs text-on-tertiary-container/70'>
                  Time format: 12-hour with AM/PM
                </p>
              </div>
            )}

            <div className='rounded-lg border border-outline-variant bg-surface-container-low p-4'>
              <p className='mb-2 text-sm font-medium'>Features:</p>
              <ul className='list-inside list-disc space-y-1 text-sm text-on-surface-variant'>
                <li>Visual clock face with animated hand</li>
                <li>Click or drag to select time</li>
                <li>Editable hour/minute inputs with validation</li>
                <li>AM/PM toggle button</li>
                <li>Keyboard navigation (Tab, Arrow keys)</li>
                <li>Ripple effects on all interactive elements</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* DATE PICKER SECTION */}
      <section id='date-picker' className='scroll-mt-8'>
        <div className='mb-6 border-b-2 border-primary pb-4'>
          <h2 className='typescale-headline-medium mb-2 text-primary'>
            DatePicker Component
          </h2>
          <p className='typescale-body-medium text-on-surface-variant'>
            Manual entry with auto-formatting, calendar selection, and constraint rules
          </p>
        </div>

        <Card className='border-none shadow-elevation-2'>
          <CardContent className='space-y-8 pt-6'>
            <div>
              <Label className='typescale-title-medium mb-3 block'>
                Interactive Date Picker
              </Label>
              <DatePicker
                label='Shift Date *'
                value={shiftStartDate}
                onChange={setShiftStartDate}
                supportingText='Type MMDDYYYY or use the calendar icon'
              />
            </div>

            <div className='grid gap-4 md:grid-cols-2'>
              <DatePicker
                label='Shift Start Date'
                value={shiftStartDate}
                onChange={setShiftStartDate}
              />
              <DatePicker
                label='Shift End Date'
                value={shiftEndDate}
                onChange={setShiftEndDate}
                minDate={shiftStartDate ?? undefined}
                supportingText='End date cannot be before start date'
                outOfRangeDateMessage='End date must be on or after the start date.'
              />
            </div>

            <div>
              <Label className='typescale-title-medium mb-3 block'>
                Weekday Constraint Example
              </Label>
              <DatePicker
                label='Available Work Day'
                value={availabilityDate}
                onChange={setAvailabilityDate}
                minDate={availabilityWindowMinDate}
                maxDate={availabilityWindowMaxDate}
                isDateDisabled={isWeekend}
                supportingText='Only weekdays are allowed in the first 21 days of this month'
                outOfRangeDateMessage='Pick a weekday within the allowed window.'
              />
            </div>

            <div className='rounded-lg bg-tertiary-container p-4'>
              <p className='text-sm text-on-tertiary-container'>
                <strong>Shift Start:</strong> {formatDateDisplay(shiftStartDate)}
              </p>
              <p className='mt-2 text-sm text-on-tertiary-container'>
                <strong>Shift End:</strong> {formatDateDisplay(shiftEndDate)}
              </p>
              <p className='mt-2 text-sm text-on-tertiary-container'>
                <strong>Available Work Day:</strong> {formatDateDisplay(availabilityDate)}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* TIME PICKER COMPARISON SECTION */}
      <section id='time-picker-comparison' className='scroll-mt-8'>
        <div className='mb-6 border-b-2 border-tertiary pb-4'>
          <h2 className='typescale-headline-medium mb-2 text-tertiary'>
            TimePicker Component (Original - For Comparison)
          </h2>
          <p className='typescale-body-medium text-on-surface-variant'>
            Legacy 1361-line monolithic implementation - preserved for behavior
            verification
          </p>
        </div>

        <Card className='border-none shadow-elevation-2'>
          <CardContent className='space-y-8 pt-6'>
            {/* Basic Interactive Time Picker (Old) */}
            <div>
              <Label className='typescale-title-medium mb-3 block'>
                Interactive Time Picker (Original)
              </Label>
              <TimePickerOld label='Choose a time' value={timeOld} onChange={setTimeOld} />
            </div>

            {/* Custom Label */}
            <div>
              <Label className='typescale-title-medium mb-3 block'>
                With Custom Label (Original)
              </Label>
              <TimePickerOld
                label='Appointment Time'
                value={timeOld}
                onChange={setTimeOld}
              />
            </div>

            {/* Error State */}
            <div>
              <Label className='typescale-title-medium mb-3 block'>
                Error State (Original)
              </Label>
              <TimePickerOld
                label='Invalid Time'
                value={timeOld}
                onChange={setTimeOld}
                error={true}
                errorMessage='Please select a valid time'
              />
            </div>

            {/* Disabled State */}
            <div>
              <Label className='typescale-title-medium mb-3 block'>
                Disabled State (Original)
              </Label>
              <TimePickerOld
                label='Scheduled Time'
                value={timeOld}
                onChange={setTimeOld}
                disabled={true}
              />
            </div>

            {timeOld && (
              <div className='rounded-lg border border-tertiary-container bg-tertiary-container/20 p-4'>
                <p className='typescale-body-large text-on-tertiary-container'>
                  <strong>Selected Time (Original):</strong>{' '}
                  {formatTimeDisplay(timeOld)}
                </p>
                <p className='mt-2 text-xs text-on-tertiary-container/70'>
                  Compare with refactored version above - behavior should be
                  identical
                </p>
              </div>
            )}

            <div className='rounded-lg border border-outline-variant bg-surface-container-low p-4'>
              <p className='mb-2 text-sm font-medium'>
                Comparison Testing Notes:
              </p>
              <ul className='list-inside list-disc space-y-1 text-sm text-on-surface-variant'>
                <li>
                  Both versions should have identical visual appearance and
                  animations
                </li>
                <li>
                  Test clock interaction (click, drag), keyboard input, and
                  manual editing
                </li>
                <li>Verify responsive behavior (desktop vs mobile modes)</li>
                <li>
                  Check that error states, disabled states, and validation work
                  the same
                </li>
                <li>
                  Refactored version is 70% smaller (400 vs 1361 lines) with
                  modular architecture
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* FORM COMPONENTS SECTION */}
      <section id='form-components' className='scroll-mt-8'>
        <div className='mb-6 border-b-2 border-primary pb-4'>
          <h2 className='typescale-headline-medium mb-2 text-primary'>
            Form Components (React Hook Form)
          </h2>
          <p className='typescale-body-medium text-on-surface-variant'>
            FormField, FormControl, FormMessage, FormErrorDisplay with
            validation
          </p>
        </div>

        <Card className='border-none shadow-elevation-2'>
          <CardContent className='space-y-8 pt-6'>
            <div>
              <Label className='typescale-title-medium mb-3 block'>
                Complete Form Example with Validation
              </Label>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(data => console.log(data))}
                  className='space-y-6'
                >
                  <FormField
                    name='email'
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            label='Email Address *'
                            type='email'
                            placeholder='Enter your email'
                            error={!!fieldState.error}
                            errorMessage={fieldState.error?.message}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name='password'
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            label='Password *'
                            type='password'
                            placeholder='At least 8 characters'
                            error={!!fieldState.error}
                            errorMessage={fieldState.error?.message}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button type='submit' variant='filled'>
                    Validate Form
                  </Button>
                </form>
              </Form>
              <p className='mt-4 text-xs text-on-surface-variant'>
                Try submitting with empty or invalid fields to see validation
                errors
              </p>
            </div>

            <div>
              <Label className='typescale-title-medium mb-3 block'>
                FormErrorDisplay Component
              </Label>
              <div className='rounded-lg border border-error bg-error-container p-4'>
                <div className='flex items-center space-x-3'>
                  <div className='flex-shrink-0'>
                    <WarningIcon className='h-5 w-5 text-error' />
                  </div>
                  <div className='flex-1'>
                    <p className='typescale-body-medium text-on-error-container'>
                      This is an error message with an icon. Used for form-level
                      errors.
                    </p>
                  </div>
                </div>
              </div>
              <p className='mt-4 text-xs text-on-surface-variant'>
                FormErrorDisplay wraps errors with warning icon. Must be used
                inside a Form context in real usage.
              </p>
            </div>

            <div>
              <Label className='typescale-title-medium mb-3 block'>
                Form Components Summary
              </Label>
              <div className='space-y-2 rounded-lg bg-surface-container p-4'>
                <p className='text-sm text-on-surface'>
                  <strong>FormField:</strong> Wraps input components with React
                  Hook Form control
                </p>
                <p className='text-sm text-on-surface'>
                  <strong>FormControl:</strong> Connects the input to the form
                  field
                </p>
                <p className='text-sm text-on-surface'>
                  <strong>FormItem:</strong> Container for form field components
                </p>
                <p className='text-sm text-on-surface'>
                  <strong>FormMessage:</strong> Displays field-level validation
                  errors (see form example above)
                </p>
                <p className='text-sm text-on-surface'>
                  <strong>FormErrorDisplay:</strong> Displays form-level errors
                  with icon (see above)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CARDS SECTION */}
      <section id='cards' className='scroll-mt-8'>
        <div className='mb-6 border-b-2 border-primary pb-4'>
          <h2 className='typescale-headline-medium mb-2 text-primary'>
            Card Component
          </h2>
          <p className='typescale-body-medium text-on-surface-variant'>
            Container cards with different elevations and borders
          </p>
        </div>

        <Card className='border-none shadow-elevation-2'>
          <CardContent className='pt-6'>
            <div className='grid gap-6 md:grid-cols-2'>
              <Card className='border-none shadow-elevation-0'>
                <CardHeader>
                  <CardTitle>Elevation 0</CardTitle>
                  <CardDescription>No shadow, flat appearance</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className='text-sm text-on-surface-variant'>
                    This card has no elevation shadow
                  </p>
                </CardContent>
              </Card>

              <Card className='border-none shadow-elevation-2'>
                <CardHeader>
                  <CardTitle>Elevation 2</CardTitle>
                  <CardDescription>Medium shadow depth</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className='text-sm text-on-surface-variant'>
                    This card has elevation-2 shadow
                  </p>
                </CardContent>
              </Card>

              <Card className='border border-outline-variant'>
                <CardHeader>
                  <CardTitle>With Border</CardTitle>
                  <CardDescription>
                    Border with outline variant color
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className='text-sm text-on-surface-variant'>
                    This card has a subtle border
                  </p>
                </CardContent>
              </Card>

              <Card className='border-none bg-secondary-container shadow-elevation-1'>
                <CardHeader>
                  <CardTitle className='text-on-secondary-container'>
                    Colored Background
                  </CardTitle>
                  <CardDescription className='text-on-secondary-container opacity-80'>
                    Secondary container color
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className='text-sm text-on-secondary-container'>
                    This card uses a colored background
                  </p>
                </CardContent>
              </Card>

              <Card className='border-none shadow-elevation-2'>
                <CardHeader>
                  <CardTitle>Card with Footer</CardTitle>
                  <CardDescription>
                    Demonstrates CardFooter usage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className='text-sm text-on-surface-variant'>
                    Main content goes here
                  </p>
                </CardContent>
                <CardFooter className='flex justify-between'>
                  <Button variant='text'>Cancel</Button>
                  <Button variant='filled'>Save</Button>
                </CardFooter>
              </Card>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* LABELS SECTION */}
      <section id='labels' className='scroll-mt-8'>
        <div className='mb-6 border-b-2 border-primary pb-4'>
          <h2 className='typescale-headline-medium mb-2 text-primary'>
            Label Component
          </h2>
          <p className='typescale-body-medium text-on-surface-variant'>
            Text labels for form fields and sections
          </p>
        </div>

        <Card className='border-none shadow-elevation-2'>
          <CardContent className='space-y-4 pt-6'>
            <div>
              <Label>Default Label</Label>
              <p className='text-sm text-on-surface-variant'>
                Standard label styling
              </p>
            </div>
            <div>
              <Label className='text-lg font-semibold'>Large Label</Label>
              <p className='text-sm text-on-surface-variant'>
                Custom sized label
              </p>
            </div>
            <div>
              <Label className='text-error'>Error Label</Label>
              <p className='text-sm text-on-surface-variant'>
                Label with error color
              </p>
            </div>
            <div>
              <Label className='typescale-title-medium'>Section Label</Label>
              <p className='text-sm text-on-surface-variant'>
                Used as section headers
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* TESTING CHECKLIST */}
      <section id='checklist' className='scroll-mt-8'>
        <div className='mb-6 border-b-2 border-primary pb-4'>
          <h2 className='typescale-headline-medium mb-2 text-primary'>
            Testing Checklist
          </h2>
          <p className='typescale-body-medium text-on-surface-variant'>
            Comprehensive verification checklist
          </p>
        </div>

        <Card className='border-none bg-secondary-container shadow-elevation-2'>
          <CardContent className='pt-6'>
            <ul className='space-y-2 text-sm text-on-secondary-container'>
              <li>
                □ All button variants render correctly (filled, outlined, tonal,
                text, elevated)
              </li>
              <li>□ Button sizes work (default, large)</li>
              <li>□ Button hover states show visual feedback</li>
              <li>□ Loading buttons show spinner and text</li>
              <li>□ Disabled buttons are not clickable</li>
              <li>□ Input fields WITH placeholders - label floats above</li>
              <li>
                □ Input fields WITHOUT placeholders - label inside until focus
              </li>
              <li>□ Input fields show focus states</li>
              <li>□ Error messages display properly</li>
              <li>□ Placeholder text is visible and readable</li>
              <li>□ Textarea resizes correctly</li>
              <li>□ Textarea WITH/WITHOUT placeholder works</li>
              <li>□ Select dropdown opens and closes smoothly</li>
              <li>□ Date picker manual input auto-formats as MM/DD/YYYY</li>
              <li>□ Date picker constraints block out-of-range and disabled dates</li>
              <li>□ Form validation errors trigger properly</li>
              <li>□ FormErrorDisplay shows with icon</li>
              <li>□ Cards have appropriate elevation shadows</li>
              <li>□ Card footer layout works</li>
              <li>□ Typography scales are consistent</li>
              <li>□ Components are responsive (resize browser)</li>
              <li>□ Sidebar navigation works on desktop (lg+)</li>
              <li>□ Mobile quick navigation works (&lt; lg)</li>
              <li>□ Smooth scrolling to sections works</li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
