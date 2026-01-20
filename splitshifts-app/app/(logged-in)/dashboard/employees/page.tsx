// File: app/(logged-in)/dashboard/employees/page.tsx

import { validateUserSession } from '@/app/lib/auth-utils';
import { getEmployees } from '../actions/employee';
import { Button } from '@/app/components/ui/buttons';
import Input from '@/app/components/ui/inputs/input';

export default async function EmployeesPage() {
  await validateUserSession();

  // Fetch real employees from database
  const result = await getEmployees();
  const employees = result.success ? result.employees : [];
  return (
    <section className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-on-surface">Employees</h1>
          <p className="mt-2 text-sm text-on-surface-variant">
            Manage your team members, roles, and availability.
          </p>
        </div>
        
        <Button variant="filled">
          Add Employee
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input 
            type="text" 
            placeholder="Search employees..." 
            label="Search"
          />
        </div>
        <Button variant="outlined" >
          Filter
        </Button>
        <Button variant="outlined">
          Sort
        </Button>
      </div>

      {/* Employee List */}
      <div className="bg-surface-container rounded-xl overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-4 bg-surface-container-high border-b border-outline-variant">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm font-medium text-on-surface">
            <div>Employee</div>
            <div className="hidden md:block">Role</div>
            <div className="hidden md:block">Status</div>
            <div className="hidden md:block">Actions</div>
          </div>
        </div>

        {/* Employee Rows */}
        <div className="divide-y divide-outline-variant">
          {employees.length === 0 ? (
            <div className="px-6 py-8 text-center text-on-surface-variant">
              No employees found. Add your first employee to get started.
            </div>
          ) : (
            employees.map((employee) => (
              <div key={employee.id} className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {employee.firstName[0]}{employee.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-on-surface">{employee.fullName}</p>
                      <p className="text-sm text-on-surface-variant">{employee.email || 'No email'}</p>
                    </div>
                  </div>
                  
                  <div className="hidden md:block">
                    <span className="px-2 py-1 bg-surface-container-high rounded text-sm">
                      {employee.phone || 'No phone'}
                    </span>
                  </div>
                  
                  <div className="hidden md:block">
                    <span className="px-2 py-1 rounded text-sm bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                  
                  <div className="hidden md:flex gap-2">
                    <Button variant="text">Edit</Button>
                    <Button variant="text" className="text-error">
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-surface-container rounded-xl p-4">
          <h3 className="font-medium text-on-surface mb-2">Total Employees</h3>
          <p className="text-2xl font-bold text-primary">{employees.length}</p>
          <p className="text-sm text-on-surface-variant">+2 this month</p>
        </div>
        
        <div className="bg-surface-container rounded-xl p-4">
          <h3 className="font-medium text-on-surface mb-2">Active Today</h3>
          <p className="text-2xl font-bold text-green-600">18</p>
          <p className="text-sm text-on-surface-variant">75% utilization</p>
        </div>
        
        <div className="bg-surface-container rounded-xl p-4">
          <h3 className="font-medium text-on-surface mb-2">Pending Requests</h3>
          <p className="text-2xl font-bold text-orange-600">3</p>
          <p className="text-sm text-on-surface-variant">Time off requests</p>
        </div>
      </div>
    </section>
  );
}
