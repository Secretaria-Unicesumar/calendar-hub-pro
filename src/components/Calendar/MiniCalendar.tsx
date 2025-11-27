import { CalendarEvent } from "@/types/calendar";
import { getModuleColor } from "@/utils/moduleColors";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface MiniCalendarProps {
  month: number;
  year: number;
  events: CalendarEvent[];
  onMonthClick: () => void;
}

export const MiniCalendar = ({ month, year, events, onMonthClick }: MiniCalendarProps) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  const monthName = format(firstDay, "MMMM", { locale: ptBR });
  
  // Create calendar grid
  const weeks: (number | null)[][] = [];
  let currentWeek: (number | null)[] = new Array(7).fill(null);
  
  // Fill first week with nulls before start
  for (let i = 0; i < startingDayOfWeek; i++) {
    currentWeek[i] = null;
  }
  
  // Fill in the days
  let dayOfWeek = startingDayOfWeek;
  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek[dayOfWeek] = day;
    dayOfWeek++;
    
    if (dayOfWeek === 7 || day === daysInMonth) {
      weeks.push([...currentWeek]);
      currentWeek = new Array(7).fill(null);
      dayOfWeek = 0;
    }
  }
  
  const getDayEvents = (day: number) => {
    const date = new Date(year, month, day);
    return events.filter((event) => {
      const eventStart = new Date(event.dataInicio);
      const eventEnd = new Date(event.dataFim);
      return date >= eventStart && date <= eventEnd;
    });
  };
  
  const weekDaysShort = ["D", "S", "T", "Q", "Q", "S", "S"];
  
  return (
    <div
      className="bg-card rounded-lg border border-border p-3 hover:shadow-md transition-all cursor-pointer group"
      onClick={onMonthClick}
    >
      <h3 className="text-sm font-semibold mb-2 capitalize text-center group-hover:text-primary transition-colors">
        {monthName}
      </h3>
      
      {/* Week days */}
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {weekDaysShort.map((day, idx) => (
          <div key={idx} className="text-[10px] text-center text-muted-foreground font-medium">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="space-y-0.5">
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="grid grid-cols-7 gap-0.5">
            {week.map((day, dayIdx) => {
              if (day === null) {
                return <div key={dayIdx} className="aspect-square" />;
              }
              
              const dayEvents = getDayEvents(day);
              const hasEvents = dayEvents.length > 0;
              const isToday =
                new Date().getDate() === day &&
                new Date().getMonth() === month &&
                new Date().getFullYear() === year;
              
              // Get first event's module color
              const firstEventColor = hasEvents
                ? getModuleColor(dayEvents[0].modulo)
                : null;
              
              return (
                <div
                  key={dayIdx}
                  className={`aspect-square flex items-center justify-center text-[10px] rounded ${
                    isToday
                      ? "bg-primary text-primary-foreground font-bold"
                      : hasEvents
                      ? "font-medium"
                      : "text-muted-foreground"
                  }`}
                  style={
                    hasEvents && !isToday && firstEventColor
                      ? {
                          backgroundColor: `hsl(var(--module-${firstEventColor}) / 0.2)`,
                          color: `hsl(var(--module-${firstEventColor}))`,
                        }
                      : {}
                  }
                >
                  {day}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      
      {events.length > 0 && (
        <div className="mt-2 pt-2 border-t border-border">
          <div className="text-[10px] text-muted-foreground text-center">
            {events.length} evento{events.length !== 1 ? "s" : ""}
          </div>
        </div>
      )}
    </div>
  );
};
