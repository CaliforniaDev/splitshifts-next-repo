// File: app/(logged-in)/dashboard/locations/page.tsx

import { validateUserSession } from '@/app/lib/auth-utils';
import { getWorksites } from '../actions/worksite';
import Button from '@/app/components/ui/buttons/button';

export default async function LocationsPage() {
  await validateUserSession();

  // Fetch real worksites from database
  const result = await getWorksites();
  const worksites = result.success ? result.worksites : [];
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
        
        <Button variant="filled" size='small'>
          Add Location
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-surface-container rounded-xl p-4 hover:bg-surface-container-high transition-colors cursor-pointer">
          <h3 className="font-medium text-on-surface mb-2">Bulk Operations</h3>
          <p className="text-sm text-on-surface-variant mb-3">Update multiple locations at once</p>
          <Button variant="text">Manage Hours</Button>
        </div>
        
        <div className="bg-surface-container rounded-xl p-4 hover:bg-surface-container-high transition-colors cursor-pointer">
          <h3 className="font-medium text-on-surface mb-2">Import/Export</h3>
          <p className="text-sm text-on-surface-variant mb-3">Sync location data with external systems</p>
          <Button variant="text">Import Data</Button>
        </div>
        
        <div className="bg-surface-container rounded-xl p-4 hover:bg-surface-container-high transition-colors cursor-pointer">
          <h3 className="font-medium text-on-surface mb-2">Location Analytics</h3>
          <p className="text-sm text-on-surface-variant mb-3">Performance metrics by location</p>
          <Button variant="text">View Reports</Button>
        </div>
      </div>

      {/* Location Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {worksites.length === 0 ? (
          <div className="col-span-2 bg-surface-container rounded-xl p-8 text-center">
            <p className="text-on-surface-variant mb-4">No locations found. Add your first location to get started.</p>
            <Button variant="filled" size='small'>
              Add Location
            </Button>
          </div>
        ) : (
          worksites.map((location) => (
            <div key={location.id} className="bg-surface-container rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-on-surface">{location.name}</h3>
                  <p className="text-sm text-on-surface-variant mt-1">{location.address}</p>
                </div>
                
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-on-surface-variant">Timezone:</span>
                  <span className="text-on-surface">{location.timezone}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-on-surface-variant">24/7 Operation:</span>
                  <span className="text-on-surface">{location.is247 ? 'Yes' : 'No'}</span>
                </div>
                
                {location.contactInfo?.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-on-surface-variant">Phone:</span>
                    <span className="text-on-surface">{location.contactInfo.phone}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4 border-t border-outline-variant">
                <Button variant="outlined" size='small' className="flex-1">
                  Edit Details
                </Button>
                <Button variant="filled" size='small' className="flex-1">
                  Manage Staff
                </Button>
              </div>
            </div>
          ))
        )}
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
