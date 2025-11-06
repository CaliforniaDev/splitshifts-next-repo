'use client';

import Button from '@/app/components/ui/buttons/button';
import { Plus, Save, Trash2, ArrowRight } from 'lucide-react';

export default function TestButtonsPage() {
  return (
    <div className='min-h-screen bg-surface p-8'>
      <div className='max-w-6xl mx-auto space-y-12'>
        <div>
          <h1 className='typescale-display-medium text-on-surface mb-2'>
            Button Ripple Test
          </h1>
          <p className='typescale-body-large text-on-surface-variant'>
            Test the MUI-style ripple effect on buttons. Try quick taps and long holds.
          </p>
        </div>

        {/* Default Size Buttons */}
        <section className='space-y-6'>
          <h2 className='typescale-title-large text-on-surface'>
            Default Size Buttons
          </h2>

          <div className='space-y-4'>
            <div>
              <h3 className='typescale-title-medium text-on-surface-variant mb-3'>
                Filled Variant
              </h3>
              <div className='flex flex-wrap gap-4'>
                <Button variant='filled'>
                  Click Me
                </Button>
                <Button variant='filled' icon={<Plus />}>
                  With Icon
                </Button>
                <Button variant='filled' disabled>
                  Disabled
                </Button>
                <Button variant='filled' loading loadingText='Saving...'>
                  Save Changes
                </Button>
              </div>
            </div>

            <div>
              <h3 className='typescale-title-medium text-on-surface-variant mb-3'>
                Elevated Variant
              </h3>
              <div className='flex flex-wrap gap-4'>
                <Button variant='elevated'>
                  Elevated
                </Button>
                <Button variant='elevated' icon={<Save />}>
                  Save Draft
                </Button>
                <Button variant='elevated' disabled>
                  Disabled
                </Button>
              </div>
            </div>

            <div>
              <h3 className='typescale-title-medium text-on-surface-variant mb-3'>
                Tonal Variant
              </h3>
              <div className='flex flex-wrap gap-4'>
                <Button variant='tonal'>
                  Tonal Button
                </Button>
                <Button variant='tonal' icon={<ArrowRight />}>
                  Continue
                </Button>
                <Button variant='tonal' disabled>
                  Disabled
                </Button>
              </div>
            </div>

            <div>
              <h3 className='typescale-title-medium text-on-surface-variant mb-3'>
                Outlined Variant
              </h3>
              <div className='flex flex-wrap gap-4'>
                <Button variant='outlined'>
                  Outlined
                </Button>
                <Button variant='outlined' icon={<Plus />}>
                  Add Item
                </Button>
                <Button variant='outlined' disabled>
                  Disabled
                </Button>
              </div>
            </div>

            <div>
              <h3 className='typescale-title-medium text-on-surface-variant mb-3'>
                Text Variant
              </h3>
              <div className='flex flex-wrap gap-4'>
                <Button variant='text'>
                  Text Button
                </Button>
                <Button variant='text' icon={<ArrowRight />}>
                  Learn More
                </Button>
                <Button variant='text' disabled>
                  Disabled
                </Button>
              </div>
            </div>

            <div>
              <h3 className='typescale-title-medium text-on-surface-variant mb-3'>
                Destructive Variant
              </h3>
              <div className='flex flex-wrap gap-4'>
                <Button variant='destructive'>
                  Delete
                </Button>
                <Button variant='destructive' icon={<Trash2 />}>
                  Delete Item
                </Button>
                <Button variant='destructive' disabled>
                  Disabled
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Large Size Buttons */}
        <section className='space-y-6'>
          <h2 className='typescale-title-large text-on-surface'>
            Large Size Buttons
          </h2>

          <div className='space-y-4'>
            <div>
              <h3 className='typescale-title-medium text-on-surface-variant mb-3'>
                Filled Variant
              </h3>
              <div className='flex flex-wrap gap-4'>
                <Button variant='filled' size='large'>
                  Click Me
                </Button>
                <Button variant='filled' size='large' icon={<Plus />}>
                  With Icon
                </Button>
                <Button variant='filled' size='large' disabled>
                  Disabled
                </Button>
              </div>
            </div>

            <div>
              <h3 className='typescale-title-medium text-on-surface-variant mb-3'>
                Elevated Variant
              </h3>
              <div className='flex flex-wrap gap-4'>
                <Button variant='elevated' size='large'>
                  Elevated Large
                </Button>
                <Button variant='elevated' size='large' icon={<Save />}>
                  Save Draft
                </Button>
              </div>
            </div>

            <div>
              <h3 className='typescale-title-medium text-on-surface-variant mb-3'>
                Tonal Variant
              </h3>
              <div className='flex flex-wrap gap-4'>
                <Button variant='tonal' size='large'>
                  Tonal Large
                </Button>
                <Button variant='tonal' size='large' icon={<ArrowRight />}>
                  Continue
                </Button>
              </div>
            </div>

            <div>
              <h3 className='typescale-title-medium text-on-surface-variant mb-3'>
                Outlined Variant
              </h3>
              <div className='flex flex-wrap gap-4'>
                <Button variant='outlined' size='large'>
                  Outlined Large
                </Button>
                <Button variant='outlined' size='large' icon={<Plus />}>
                  Add Item
                </Button>
              </div>
            </div>

            <div>
              <h3 className='typescale-title-medium text-on-surface-variant mb-3'>
                Destructive Variant
              </h3>
              <div className='flex flex-wrap gap-4'>
                <Button variant='destructive' size='large'>
                  Delete Large
                </Button>
                <Button variant='destructive' size='large' icon={<Trash2 />}>
                  Delete Item
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Ripple Testing Instructions */}
        <section className='bg-surface-container-highest p-6 rounded-lg'>
          <h2 className='typescale-title-large text-on-surface mb-4'>
            Testing Instructions
          </h2>
          <ul className='space-y-2 text-on-surface-variant typescale-body-medium'>
            <li>
              <strong className='text-on-surface'>Quick Tap:</strong> Click and release immediately - ripple should fade quickly at moderate size
            </li>
            <li>
              <strong className='text-on-surface'>Hold:</strong> Click and hold - ripple should expand to edge-to-edge and stay visible until you release
            </li>
            <li>
              <strong className='text-on-surface'>Medium Hold:</strong> Click, hold briefly, then release - ripple should fade from wherever it is
            </li>
            <li>
              <strong className='text-on-surface'>Multiple Clicks:</strong> Rapidly click to see multiple overlapping ripples
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
