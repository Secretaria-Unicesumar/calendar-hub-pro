import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CalendarEvent } from "@/types/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getModuleColor } from "@/utils/moduleColors";
import { Calendar, Tag, Package, Folder } from "lucide-react";

interface EventDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date | null;
  events: CalendarEvent[];
}

export const EventDetailsDialog = ({
  open,
  onOpenChange,
  date,
  events,
}: EventDetailsDialogProps) => {
  if (!date) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Eventos de {format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {events.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhum evento neste dia
            </p>
          ) : (
            events.map((event) => {
              const colorNum = getModuleColor(event.modulo);
              
              return (
                <div
                  key={event.id}
                  className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                  style={{
                    borderLeft: `4px solid hsl(var(--module-${colorNum}))`,
                  }}
                >
                  <h3 className="font-semibold text-lg mb-3">{event.atividade}</h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(event.dataInicio, "dd/MM/yyyy")} até{" "}
                        {format(event.dataFim, "dd/MM/yyyy")}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Tag className="h-4 w-4" />
                      <span>Módulo: <strong>{event.modulo}</strong></span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Folder className="h-4 w-4" />
                      <span>Categoria: {event.categoria}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Package className="h-4 w-4" />
                      <span>Produto: {event.produto}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
