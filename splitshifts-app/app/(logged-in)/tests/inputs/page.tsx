'use client';

import { useState } from 'react';
import Input, { Textarea } from '@/app/components/ui/inputs/input';
import Button from '@/app/components/ui/buttons/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';

export default function TestInputsPage() {
  const [textValue, setTextValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [dateValue, setDateValue] = useState('');
  const [timeValue, setTimeValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [errorInput, setErrorInput] = useState('');
  const [showErrors, setShowErrors] = useState(false);

  return (
    <div className='min-h-screen bg-surface p-8'>
      <div className='max-w-6xl mx-auto space-y-12'>
        <div>
          <h1 className='typescale-display-medium text-on-surface mb-2'>
            Input Components Test
          </h1>
          <p className='typescale-body-large text-on-surface-variant'>
            Test the Material Design 3 input components with floating labels, focus states, and validation.
          </p>
        </div>

        {/* Basic Text Inputs */}
        <section className='space-y-6'>
          <h2 className='typescale-title-large text-on-surface'>
            Text Inputs
          </h2>

          <Card className='w-full border-none shadow-elevation-0'>
            <CardHeader>
              <CardTitle>Standard Text Inputs</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <Input
                label='Text Input *'
                type='text'
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                supportingText='Enter your text here'
              />

              <Input
                label='Email Address *'
                type='email'
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                supportingText='We will never share your email'
              />

              <Input
                label='Password *'
                type='password'
                supportingText='Must be at least 8 characters'
              />

              <Input
                label='Disabled Input'
                type='text'
                defaultValue='This field is disabled'
                disabled
              />

              <Input
                label='With Default Value'
                type='text'
                defaultValue='Default text here'
              />
            </CardContent>
          </Card>
        </section>

        {/* Date and Time Inputs */}
        <section className='space-y-6'>
          <h2 className='typescale-title-large text-on-surface'>
            Date & Time Inputs (Safari Focus Test)
          </h2>

          <Card className='w-full border-none shadow-elevation-0'>
            <CardHeader>
              <CardTitle>Date/Time Input Types</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <Input
                label='Date *'
                type='date'
                value={dateValue}
                onChange={(e) => setDateValue(e.target.value)}
                supportingText='Try tabbing into this field on Safari'
              />

              <Input
                label='Time *'
                type='time'
                value={timeValue}
                onChange={(e) => setTimeValue(e.target.value)}
                supportingText='Select a time'
              />

              <Input
                label='Date and Time *'
                type='datetime-local'
                supportingText='Choose date and time'
              />

              <Input
                label='Month *'
                type='month'
                supportingText='Select a month'
              />

              <Input
                label='Week *'
                type='week'
                supportingText='Select a week'
              />

              <Input
                label='Date with Default Value'
                type='date'
                defaultValue='2025-11-10'
              />
            </CardContent>
          </Card>
        </section>

        {/* Error States */}
        <section className='space-y-6'>
          <h2 className='typescale-title-large text-on-surface'>
            Error States & Validation
          </h2>

          <Card className='w-full border-none shadow-elevation-0'>
            <CardHeader>
              <CardTitle>Error Handling</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <Input
                label='Input with Error *'
                type='text'
                value={errorInput}
                onChange={(e) => setErrorInput(e.target.value)}
                error={showErrors && errorInput.length === 0}
                errorMessage='This field is required'
              />

              <Input
                label='Email with Validation *'
                type='email'
                error={showErrors}
                errorMessage='Please enter a valid email address'
              />

              <Button
                variant='filled'
                onClick={() => setShowErrors(!showErrors)}
              >
                {showErrors ? 'Hide Errors' : 'Show Errors'}
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Textarea */}
        <section className='space-y-6'>
          <h2 className='typescale-title-large text-on-surface'>
            Textarea Components
          </h2>

          <Card className='w-full border-none shadow-elevation-0'>
            <CardHeader>
              <CardTitle>Multiline Text Input</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <Textarea
                label='Message *'
                rows={4}
                value={textareaValue}
                onChange={(e) => setTextareaValue(e.target.value)}
                supportingText='Enter your message here'
              />

              <Textarea
                label='With Default Value'
                rows={3}
                defaultValue='This is a default message that should float the label on initial render.'
              />

              <Textarea
                label='Disabled Textarea'
                rows={3}
                defaultValue='This textarea is disabled'
                disabled
              />

              <Textarea
                label='Textarea with Error *'
                rows={4}
                error={showErrors}
                errorMessage='Message cannot be empty'
              />
            </CardContent>
          </Card>
        </section>

        {/* Other Input Types */}
        <section className='space-y-6'>
          <h2 className='typescale-title-large text-on-surface'>
            Other Input Types
          </h2>

          <Card className='w-full border-none shadow-elevation-0'>
            <CardHeader>
              <CardTitle>Specialized Inputs</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <Input
                label='Number *'
                type='number'
                supportingText='Enter a number'
              />

              <Input
                label='Telephone *'
                type='tel'
                supportingText='Enter your phone number'
              />

              <Input
                label='URL *'
                type='url'
                supportingText='Enter a website URL'
              />

              <Input
                label='Search *'
                type='search'
                supportingText='Search for something'
              />

              <Input
                label='Color Picker *'
                type='color'
                defaultValue='#35618E'
                supportingText='Choose a color'
              />
            </CardContent>
          </Card>
        </section>

        {/* Focus & Tab Test */}
        <section className='space-y-6'>
          <h2 className='typescale-title-large text-on-surface'>
            Tab Navigation Test
          </h2>

          <Card className='w-full border-none shadow-elevation-0'>
            <CardHeader>
              <CardTitle>Keyboard Navigation</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <p className='typescale-body-medium text-on-surface-variant'>
                Try tabbing through these fields to test focus states, especially on Safari:
              </p>
              
              <Input
                label='Field 1'
                type='text'
              />

              <Input
                label='Field 2 (Date)'
                type='date'
              />

              <Input
                label='Field 3'
                type='text'
              />

              <Input
                label='Field 4 (Time)'
                type='time'
              />

              <Textarea
                label='Field 5 (Textarea)'
                rows={3}
              />
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
