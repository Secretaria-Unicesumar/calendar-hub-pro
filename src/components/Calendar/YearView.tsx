import { CalendarEvent } from "@/types/calendar";
import { MiniCalendar } from "./MiniCalendar";

interface YearViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onMonthClick: (month: number) => void;
}

export const YearView = ({ currentDate, events, onMonthClick }: YearViewProps) => {
  const year = currentDate.getFullYear();
  
  const months = Array.from({ length: 12 }, (_, i) => {
    const monthEvents = events.filter((event) => {
      const eventStart = new Date(event.dataInicio);
      const eventEnd = new Date(event.dataFim);
      const monthDate = new Date(year, i, 1);
      const monthEnd = new Date(year, i + 1, 0);
      
      return (
        (eventStart.getFullYear() === year && eventStart.getMonth() === i) ||
        (eventEnd.getFullYear() === year && eventEnd.getMonth() === i) ||
        (eventStart <= monthEnd && eventEnd >= monthDate)
      );
    });
    
    return {
      month: i,
      events: monthEvents,
    };
  });
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {months.map((monthData) => (
        <MiniCalendar
          key={monthData.month}
          month={monthData.month}
          year={year}
          events={monthData.events}
          onMonthClick={() => onMonthClick(monthData.month)}
        />
      ))}
    </div>
  );
};
