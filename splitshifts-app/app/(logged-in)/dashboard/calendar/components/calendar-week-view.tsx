'use client';

type Shift = {
  id: string;
  workSiteName: string;
  roleTitle: string;
  shiftStart: Date;
  shiftEnd: Date;
  status: 'draft' | 'published' | 'cancelled';
  employeeName: string | null;
};

type CalendarWeekViewProps = {
  shifts: Shift[];
  currentDate: Date;
};

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function CalendarWeekView({ shifts, currentDate }: CalendarWeekViewProps) {
  // Calculate week dates
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });

  // Group shifts by day
  const shiftsByDay = weekDates.map(date => {
    const dayShifts = shifts.filter(shift => {
      const shiftDate = new Date(shift.shiftStart);
      return shiftDate.toDateString() === date.toDateString();
    });
    return { date, shifts: dayShifts };
  });

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="bg-surface-container rounded-xl overflow-hidden">
      {/* Week Grid */}
      <div className="grid grid-cols-7 divide-x divide-outline-variant">
        {shiftsByDay.map(({ date, shifts: dayShifts }, index) => (
          <div key={index} className="min-h-[500px] flex flex-col">
            {/* Day Header */}
            <div className={`p-4 border-b border-outline-variant ${
              isToday(date) ? 'bg-primary/10' : 'bg-surface-container-high'
            }`}>
              <div className="text-center">
                <div className="text-xs font-medium text-on-surface-variant">
                  {DAYS[date.getDay()]}
                </div>
                <div className={`text-lg font-semibold mt-1 ${
                  isToday(date) ? 'text-primary' : 'text-on-surface'
                }`}>
                  {date.getDate()}
                </div>
              </div>
            </div>

            {/* Day Shifts */}
            <div className="flex-1 p-2 space-y-2 overflow-y-auto">
              {dayShifts.length === 0 ? (
                <div className="text-center text-sm text-on-surface-variant py-4">
                  No shifts
                </div>
              ) : (
                dayShifts.map(shift => (
                  <div
                    key={shift.id}
                    className={`p-2 rounded-lg border text-xs cursor-pointer hover:shadow-md transition-shadow ${getStatusColor(shift.status)}`}
                  >
                    <div className="font-semibold truncate">{shift.roleTitle}</div>
                    <div className="text-xs mt-1 truncate">{shift.workSiteName}</div>
                    <div className="text-xs mt-1">
                      {formatTime(shift.shiftStart)} - {formatTime(shift.shiftEnd)}
                    </div>
                    {shift.employeeName && (
                      <div className="text-xs mt-1 font-medium truncate">
                        {shift.employeeName}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
