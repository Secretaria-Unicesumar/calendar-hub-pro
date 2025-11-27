import { CalendarEvent } from "@/types/calendar";
import { getModuleColor } from "@/utils/moduleColors";

interface ModuleLegendProps {
  events: CalendarEvent[];
}

export const ModuleLegend = ({ events }: ModuleLegendProps) => {
  // Get unique modules
  const uniqueModules = Array.from(new Set(events.map((e) => e.modulo))).sort();
  
  if (uniqueModules.length === 0) return null;
  
  return (
    <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
      <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
        Legenda de Módulos
      </h3>
      <div className="flex flex-wrap gap-3">
        {uniqueModules.map((moduleId) => {
          const colorNum = getModuleColor(moduleId);
          const moduleEvents = events.filter((e) => e.modulo === moduleId);
          
          return (
            <div
              key={moduleId}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md"
              style={{
                backgroundColor: `hsl(var(--module-${colorNum}) / 0.15)`,
              }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: `hsl(var(--module-${colorNum}))`,
                }}
              />
              <span className="text-sm font-medium">{moduleId}</span>
              <span className="text-xs text-muted-foreground">
                ({moduleEvents.length})
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
