import { CalendarEvent } from "@/types/calendar";
import { getModuleColor } from "@/utils/moduleColors";
import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";

interface YearViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onMonthClick: (month: number) => void;
}

export const YearView = ({ currentDate, events, onMonthClick }: YearViewProps) => {
  const year = currentDate.getFullYear();
  
  const months = Array.from({ length: 12 }, (_, i) => {
    const monthDate = new Date(year, i, 1);
    const monthEvents = events.filter((event) => {
      const eventStart = new Date(event.dataInicio);
      const eventEnd = new Date(event.dataFim);
      return (
        (eventStart.getFullYear() === year && eventStart.getMonth() === i) ||
        (eventEnd.getFullYear() === year && eventEnd.getMonth() === i) ||
        (eventStart < monthDate && eventEnd > new Date(year, i + 1, 0))
      );
    });
    
    return {
      date: monthDate,
      name: format(monthDate, "MMMM", { locale: ptBR }),
      events: monthEvents,
    };
  });
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {months.map((month, index) => {
        const uniqueModules = new Set(month.events.map((e) => e.modulo));
        
        return (
          <div
            key={index}
            className="bg-card rounded-lg border border-border p-4 hover:shadow-md transition-all cursor-pointer group"
            onClick={() => onMonthClick(index)}
          >
            <h3 className="text-lg font-semibold mb-3 capitalize group-hover:text-primary transition-colors">
              {month.name}
            </h3>
            
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                {month.events.length} evento{month.events.length !== 1 ? 's' : ''}
              </div>
              
              {uniqueModules.size > 0 && (
                <div className="flex flex-wrap gap-2">
                  {Array.from(uniqueModules).slice(0, 4).map((moduleId) => {
                    const colorNum = getModuleColor(moduleId);
                    return (
                      <div
                        key={moduleId}
                        className="text-xs px-2 py-1 rounded"
                        style={{
                          backgroundColor: `hsl(var(--module-${colorNum}) / 0.15)`,
                          color: `hsl(var(--module-${colorNum}))`,
                        }}
                      >
                        {moduleId}
                      </div>
                    );
                  })}
                  {uniqueModules.size > 4 && (
                    <div className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                      +{uniqueModules.size - 4}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
