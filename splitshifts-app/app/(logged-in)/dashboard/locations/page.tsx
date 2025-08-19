// File: app/(logged-in)/dashboard/locations/page.tsx

'use client';

export default function LocationsPage() {
  return (
    <section className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-on-surface">Locations</h1>
          <p className="mt-2 text-sm text-on-surface-variant">
            Manage your business locations, hours, and operational settings.
          </p>
        </div>
        
        <button className="px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          Add Location
        </button>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-surface-container rounded-xl p-4 hover:bg-surface-container-high transition-colors cursor-pointer">
          <h3 className="font-medium text-on-surface mb-2">Bulk Operations</h3>
          <p className="text-sm text-on-surface-variant mb-3">Update multiple locations at once</p>
          <button className="text-sm text-primary hover:underline">Manage Hours</button>
        </div>
        
        <div className="bg-surface-container rounded-xl p-4 hover:bg-surface-container-high transition-colors cursor-pointer">
          <h3 className="font-medium text-on-surface mb-2">Import/Export</h3>
          <p className="text-sm text-on-surface-variant mb-3">Sync location data with external systems</p>
          <button className="text-sm text-primary hover:underline">Import Data</button>
        </div>
        
        <div className="bg-surface-container rounded-xl p-4 hover:bg-surface-container-high transition-colors cursor-pointer">
          <h3 className="font-medium text-on-surface mb-2">Location Analytics</h3>
          <p className="text-sm text-on-surface-variant mb-3">Performance metrics by location</p>
          <button className="text-sm text-primary hover:underline">View Reports</button>
        </div>
      </div>

      {/* Location Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {[
          {
            name: 'Downtown Store',
            address: '123 Main Street, Downtown',
            hours: 'Mon-Fri: 9 AM - 9 PM',
            employees: 12,
            status: 'Active'
          },
          {
            name: 'Westside Branch',
            address: '456 Oak Avenue, Westside',
            hours: 'Mon-Sun: 8 AM - 10 PM',
            employees: 8,
            status: 'Active'
          },
          {
            name: 'Mall Location',
            address: '789 Shopping Center, Mall District',
            hours: 'Mon-Sun: 10 AM - 9 PM',
            employees: 15,
            status: 'Under Renovation'
          }
        ].map((location, index) => (
          <div key={index} className="bg-surface-container rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-on-surface">{location.name}</h3>
                <p className="text-sm text-on-surface-variant mt-1">{location.address}</p>
              </div>
              
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                location.status === 'Active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-orange-100 text-orange-800'
              }`}>
                {location.status}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-on-surface-variant">Hours:</span>
                <span className="text-on-surface">{location.hours}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <span className="text-on-surface-variant">Employees:</span>
                <span className="text-on-surface">{location.employees} staff members</span>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-outline-variant">
              <button className="flex-1 px-3 py-2 text-sm text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors">
                Edit Details
              </button>
              <button className="flex-1 px-3 py-2 text-sm bg-primary text-on-primary rounded-lg hover:bg-primary/90 transition-colors">
                Manage Staff
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="bg-surface-container rounded-xl p-4">
          <h3 className="font-medium text-on-surface mb-2">Total Locations</h3>
          <p className="text-2xl font-bold text-primary">3</p>
          <p className="text-sm text-on-surface-variant">All regions</p>
        </div>
        
        <div className="bg-surface-container rounded-xl p-4">
          <h3 className="font-medium text-on-surface mb-2">Active Today</h3>
          <p className="text-2xl font-bold text-green-600">2</p>
          <p className="text-sm text-on-surface-variant">Operational status</p>
        </div>
        
        <div className="bg-surface-container rounded-xl p-4">
          <h3 className="font-medium text-on-surface mb-2">Total Staff</h3>
          <p className="text-2xl font-bold text-blue-600">35</p>
          <p className="text-sm text-on-surface-variant">Across all locations</p>
        </div>
        
        <div className="bg-surface-container rounded-xl p-4">
          <h3 className="font-medium text-on-surface mb-2">Avg Hours</h3>
          <p className="text-2xl font-bold text-purple-600">12.5</p>
          <p className="text-sm text-on-surface-variant">Operating hours/day</p>
        </div>
      </div>
    </section>
  );
}
