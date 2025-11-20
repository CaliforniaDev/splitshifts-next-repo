'use server';

import { requireAuth } from '@/app/lib/auth-utils';
import db from '@/db/drizzle';
import { shifts, worksites, roles, shiftAssignments, employees } from '@/db/schema';
import { eq, and, isNull, gte, lte, sql } from 'drizzle-orm';
import {
  getShiftsSchema,
  type GetShiftsFilters,
} from '@/app/lib/validation/shift';

export async function getShifts(filters?: GetShiftsFilters) {
  // 1. Authentication
  const session = await requireAuth();

  try {
    // 2. Validation (if filters provided)
    const validatedFilters = filters ? getShiftsSchema.parse(filters) : {};

    // 3. Authorization
    const orgId = session.user.orgId;
    if (!orgId) {
      return { success: false, error: 'No organization found', shifts: [] };
    }

    // 4. Build query conditions
    const conditions = [
      eq(shifts.orgId, orgId),
      isNull(shifts.deletedAt),
    ];

    if (validatedFilters.workSiteId) {
      conditions.push(eq(shifts.workSiteId, validatedFilters.workSiteId));
    }
    if (validatedFilters.roleId) {
      conditions.push(eq(shifts.roleId, validatedFilters.roleId));
    }
    if (validatedFilters.status) {
      conditions.push(eq(shifts.status, validatedFilters.status));
    }
    if (validatedFilters.startDate) {
      conditions.push(gte(shifts.shiftStart, new Date(validatedFilters.startDate)));
    }
    if (validatedFilters.endDate) {
      conditions.push(lte(shifts.shiftEnd, new Date(validatedFilters.endDate)));
    }

    // 5. Execute query with joins
    const shiftsData = await db
      .select({
        id: shifts.id,
        workSiteId: shifts.workSiteId,
        workSiteName: worksites.name,
        roleId: shifts.roleId,
        roleTitle: roles.title,
        shiftStart: shifts.shiftStart,
        shiftEnd: shifts.shiftEnd,
        hourlyRate: shifts.hourlyRate,
        notes: shifts.notes,
        status: shifts.status,
        shiftGroupId: shifts.shiftGroupId,
        createdAt: shifts.createdAt,
        updatedAt: shifts.updatedAt,
        // Assignment info (if any)
        assignmentId: shiftAssignments.id,
        assignmentStatus: shiftAssignments.status,
        employeeId: employees.id,
        employeeName: sql<string>`CONCAT(${employees.firstName}, ' ', ${employees.lastName})`,
      })
      .from(shifts)
      .innerJoin(worksites, eq(shifts.workSiteId, worksites.id))
      .innerJoin(roles, eq(shifts.roleId, roles.id))
      .leftJoin(shiftAssignments, eq(shifts.id, shiftAssignments.shiftId))
      .leftJoin(employees, eq(shiftAssignments.employeeId, employees.id))
      .where(and(...conditions))
      .orderBy(shifts.shiftStart);

    // 6. Filter by employee if specified
    let filteredShifts = shiftsData;
    if (validatedFilters.employeeId) {
      filteredShifts = shiftsData.filter(
        shift => shift.employeeId === validatedFilters.employeeId
      );
    }

    return { success: true, shifts: filteredShifts };
  } catch (error) {
    console.error('Failed to get shifts:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message, shifts: [] };
    }
    return { success: false, error: 'Failed to get shifts', shifts: [] };
  }
}
