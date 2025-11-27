import { CalendarEvent } from "@/types/calendar";
import { getModuleColor } from "@/utils/moduleColors";
import { isSameDay, format } from "date-fns";

interface CalendarGridProps {
  currentDate: Date;
  events: CalendarEvent[];
  onDayClick: (date: Date, events: CalendarEvent[]) => void;
}

export const CalendarGrid = ({ currentDate, events, onDayClick }: CalendarGridProps) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  // Get first day of month and total days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  // Get days from previous month to fill the first week
  const previousMonthLastDay = new Date(year, month, 0).getDate();
  const previousMonthDays = startingDayOfWeek;
  
  // Calculate total cells needed
  const totalCells = Math.ceil((daysInMonth + startingDayOfWeek) / 7) * 7;
  const nextMonthDays = totalCells - daysInMonth - startingDayOfWeek;
  
  const days = [];
  
  // Previous month days
  for (let i = previousMonthDays - 1; i >= 0; i--) {
    days.push({
      day: previousMonthLastDay - i,
      isCurrentMonth: false,
      date: new Date(year, month - 1, previousMonthLastDay - i),
    });
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      day: i,
      isCurrentMonth: true,
      date: new Date(year, month, i),
    });
  }
  
  // Next month days
  for (let i = 1; i <= nextMonthDays; i++) {
    days.push({
      day: i,
      isCurrentMonth: false,
      date: new Date(year, month + 1, i),
    });
  }
  
  const getDayEvents = (date: Date) => {
    return events.filter((event) => {
      const eventStart = new Date(event.dataInicio);
      const eventEnd = new Date(event.dataFim);
      return date >= eventStart && date <= eventEnd;
    });
  };
  
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  
  return (
    <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
      {/* Week days header */}
      <div className="grid grid-cols-7 bg-muted/50 border-b border-border">
        {weekDays.map((day) => (
          <div
            key={day}
            className="p-3 text-center text-sm font-semibold text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {days.map((dayInfo, index) => {
          const dayEvents = getDayEvents(dayInfo.date);
          const isToday = isSameDay(dayInfo.date, new Date());
          const hasEvents = dayEvents.length > 0;
          
          return (
            <div
              key={index}
              className={`min-h-[100px] p-2 border-b border-r border-border transition-colors ${
                dayInfo.isCurrentMonth
                  ? "bg-card hover:bg-muted/30 cursor-pointer"
                  : "bg-muted/20 text-muted-foreground"
              } ${isToday ? "bg-primary/5" : ""}`}
              onClick={() => dayInfo.isCurrentMonth && onDayClick(dayInfo.date, dayEvents)}
            >
              <div className="flex flex-col h-full">
                <div
                  className={`text-sm font-medium mb-1 ${
                    isToday
                      ? "bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center"
                      : ""
                  }`}
                >
                  {dayInfo.day}
                </div>
                
                {hasEvents && (
                  <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                    {dayEvents.slice(0, 3).map((event, idx) => {
                      const colorNum = getModuleColor(event.modulo);
                      return (
                        <div
                          key={idx}
                          className={`text-xs px-1.5 py-0.5 rounded truncate`}
                          style={{
                            backgroundColor: `hsl(var(--module-${colorNum}) / 0.15)`,
                            borderLeft: `3px solid hsl(var(--module-${colorNum}))`,
                          }}
                          title={event.atividade}
                        >
                          {event.atividade}
                        </div>
                      );
                    })}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-muted-foreground px-1.5">
                        +{dayEvents.length - 3} mais
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
