// File: app/(logged-in)/dashboard/employees/page.tsx

'use client';

export default function EmployeesPage() {
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
        
        <button className="px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          Add Employee
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1">
          <input 
            type="text" 
            placeholder="Search employees..." 
            className="w-full px-4 py-2 bg-surface-container rounded-lg border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button className="px-4 py-2 bg-surface-container hover:bg-surface-container-high rounded-lg text-sm font-medium transition-colors border border-outline-variant">
          Filter
        </button>
        <button className="px-4 py-2 bg-surface-container hover:bg-surface-container-high rounded-lg text-sm font-medium transition-colors border border-outline-variant">
          Sort
        </button>
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

        {/* Sample Employee Rows */}
        <div className="divide-y divide-outline-variant">
          {[
            { name: 'John Smith', email: 'john@example.com', role: 'Manager', status: 'Active' },
            { name: 'Sarah Johnson', email: 'sarah@example.com', role: 'Staff', status: 'Active' },
            { name: 'Mike Davis', email: 'mike@example.com', role: 'Staff', status: 'Inactive' },
          ].map((employee, index) => (
            <div key={index} className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {employee.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-on-surface">{employee.name}</p>
                    <p className="text-sm text-on-surface-variant">{employee.email}</p>
                  </div>
                </div>
                
                <div className="hidden md:block">
                  <span className="px-2 py-1 bg-surface-container-high rounded text-sm">
                    {employee.role}
                  </span>
                </div>
                
                <div className="hidden md:block">
                  <span className={`px-2 py-1 rounded text-sm ${
                    employee.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {employee.status}
                  </span>
                </div>
                
                <div className="hidden md:flex gap-2">
                  <button className="text-sm text-primary hover:underline">Edit</button>
                  <button className="text-sm text-red-600 hover:underline">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-surface-container rounded-xl p-4">
          <h3 className="font-medium text-on-surface mb-2">Total Employees</h3>
          <p className="text-2xl font-bold text-primary">24</p>
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
