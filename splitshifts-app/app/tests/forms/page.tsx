'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import Button from '@/app/components/ui/buttons/button';

// Import onboarding forms
import WorksiteForm from '@/app/(logged-in)/dashboard/components/onboarding/components/worksite-form';
import EmployeeForm from '@/app/(logged-in)/dashboard/components/onboarding/components/employee-form';
import RoleForm from '@/app/(logged-in)/dashboard/components/onboarding/components/role-form';

type FormView = 'menu' | 'worksite' | 'employee' | 'role';

/**
 * Form Component Test Page
 * 
 * Visual testing ground for onboarding form components.
 * Allows viewing each form in isolation to test:
 * - Button layouts and hierarchy
 * - Skip functionality
 * - Form validation
 * - Loading states
 * - Error handling
 * - Visual consistency
 */
export default function FormTestPage() {
  const [currentView, setCurrentView] = useState<FormView>('menu');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleSuccess = (formName: string) => {
    setSuccessMessage(`✅ ${formName} submitted successfully!`);
    setTimeout(() => {
      setSuccessMessage('');
      setCurrentView('menu');
    }, 2000);
  };

  const handleBack = () => {
    setCurrentView('menu');
  };

  if (currentView === 'worksite') {
    return (
      <div className="min-h-screen bg-surface p-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="typescale-headline-large">Worksite Form Test</h1>
            <Button variant="text" onClick={handleBack}>
              ← Back to Menu
            </Button>
          </div>
          <WorksiteForm 
            onSuccess={() => handleSuccess('Worksite Form')} 
            onBack={handleBack}
          />
        </div>
      </div>
    );
  }

  if (currentView === 'employee') {
    return (
      <div className="min-h-screen bg-surface p-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="typescale-headline-large">Employee Form Test</h1>
            <Button variant="text" onClick={handleBack}>
              ← Back to Menu
            </Button>
          </div>
          <EmployeeForm 
            onSuccess={() => handleSuccess('Employee Form')} 
            onBack={handleBack}
          />
        </div>
      </div>
    );
  }

  if (currentView === 'role') {
    return (
      <div className="min-h-screen bg-surface p-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="typescale-headline-large">Role Form Test</h1>
            <Button variant="text" onClick={handleBack}>
              ← Back to Menu
            </Button>
          </div>
          <RoleForm 
            onSuccess={() => handleSuccess('Role Form')} 
            onBack={handleBack}
          />
        </div>
      </div>
    );
  }

  // Main menu
  return (
    <div className="min-h-screen bg-surface p-8">
      <div className="mx-auto max-w-4xl">
        <Card className="border-none shadow-elevation-2">
          <CardHeader>
            <CardTitle className="typescale-headline-large">
              Form Component Test Suite
            </CardTitle>
            <CardDescription className="typescale-body-large">
              Visual testing ground for onboarding form components. Select a form below to test its appearance, validation, and functionality.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {successMessage && (
              <div className="rounded-lg bg-tertiary-container p-4 text-on-tertiary-container">
                {successMessage}
              </div>
            )}

            <div className="space-y-4">
              <h2 className="typescale-title-large text-on-surface">
                Available Forms
              </h2>
              
              {/* Worksite Form Card */}
              <Card className="border border-outline-variant hover:bg-surface-container transition-colors">
                <CardHeader>
                  <CardTitle>Worksite Form</CardTitle>
                  <CardDescription>
                    Tests worksite creation with name, address, and timezone selection.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="mb-4 space-y-2 text-sm text-on-surface-variant">
                    <li>✓ Name and address inputs</li>
                    <li>✓ Timezone dropdown</li>
                    <li>✓ Save & Continue + Add Another buttons</li>
                    <li>✓ Back | Skip for Now navigation</li>
                  </ul>
                  <Button 
                    variant="filled" 
                    onClick={() => setCurrentView('worksite')}
                    className="w-full"
                  >
                    Test Worksite Form
                  </Button>
                </CardContent>
              </Card>

              {/* Employee Form Card */}
              <Card className="border border-outline-variant hover:bg-surface-container transition-colors">
                <CardHeader>
                  <CardTitle>Employee Form</CardTitle>
                  <CardDescription>
                    Tests employee creation with personal information fields.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="mb-4 space-y-2 text-sm text-on-surface-variant">
                    <li>✓ First name and last name</li>
                    <li>✓ Email and phone (optional)</li>
                    <li>✓ Address and hire date</li>
                    <li>✓ Complete button hierarchy</li>
                  </ul>
                  <Button 
                    variant="filled" 
                    onClick={() => setCurrentView('employee')}
                    className="w-full"
                  >
                    Test Employee Form
                  </Button>
                </CardContent>
              </Card>

              {/* Role Form Card */}
              <Card className="border border-outline-variant hover:bg-surface-container transition-colors">
                <CardHeader>
                  <CardTitle>Role Form</CardTitle>
                  <CardDescription>
                    Tests role creation with title and description fields.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="mb-4 space-y-2 text-sm text-on-surface-variant">
                    <li>✓ Role title input</li>
                    <li>✓ Description textarea</li>
                    <li>✓ Material Design 3 button variants</li>
                    <li>✓ Horizontal navigation layout</li>
                  </ul>
                  <Button 
                    variant="filled" 
                    onClick={() => setCurrentView('role')}
                    className="w-full"
                  >
                    Test Role Form
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 rounded-lg bg-secondary-container p-4">
              <h3 className="mb-2 font-medium text-on-secondary-container typescale-title-medium">
                Testing Checklist
              </h3>
              <ul className="space-y-1 text-sm text-on-secondary-container">
                <li>□ Verify button hierarchy (Filled → Outlined/Tonal → Text)</li>
                <li>□ Test &quot;Skip for Now&quot; bypasses validation</li>
                <li>□ Check &quot;Add Another&quot; resets form and stays on page</li>
                <li>□ Confirm &quot;Save & Continue&quot; advances to next step</li>
                <li>□ Test form validation with empty/invalid inputs</li>
                <li>□ Check loading states on button clicks</li>
                <li>□ Verify responsive layout on mobile (resize browser)</li>
                <li>□ Test keyboard navigation (Tab key)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
