import { useState, useEffect } from "react";
import { CalendarEvent } from "@/types/calendar";
import { loadCalendarData } from "@/utils/csvParser";
import { CalendarHeader } from "@/components/Calendar/CalendarHeader";
import { CalendarGrid } from "@/components/Calendar/CalendarGrid";
import { YearView } from "@/components/Calendar/YearView";
import { EventDetailsDialog } from "@/components/Calendar/EventDetailsDialog";
import { ModuleLegend } from "@/components/Calendar/ModuleLegend";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'year'>('month');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<CalendarEvent[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await loadCalendarData();
        setEvents(data);
        if (data.length === 0) {
          toast({
            title: "Aviso",
            description: "Nenhum evento foi encontrado no arquivo.",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os eventos do calendário.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [toast]);

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleMonthChange = (month: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), month));
  };

  const handleYearChange = (year: number) => {
    setCurrentDate(new Date(year, currentDate.getMonth()));
  };

  const handleDayClick = (date: Date, dayEvents: CalendarEvent[]) => {
    setSelectedDate(date);
    setSelectedEvents(dayEvents);
    setDialogOpen(true);
  };

  const handleMonthClickFromYearView = (month: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), month));
    setView('month');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando calendário...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Calendário Acadêmico
          </h1>
          <p className="text-muted-foreground">
            Visualize e gerencie todos os eventos e atividades
          </p>
        </div>

        <div className="space-y-6">
          <ModuleLegend events={events} />
          
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
            <CalendarHeader
              currentDate={currentDate}
              onPreviousMonth={handlePreviousMonth}
              onNextMonth={handleNextMonth}
              onMonthChange={handleMonthChange}
              onYearChange={handleYearChange}
              view={view}
              onViewChange={setView}
            />
            
            {view === 'month' ? (
              <CalendarGrid
                currentDate={currentDate}
                events={events}
                onDayClick={handleDayClick}
              />
            ) : (
              <YearView
                currentDate={currentDate}
                events={events}
                onMonthClick={handleMonthClickFromYearView}
              />
            )}
          </div>
        </div>

        <EventDetailsDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          date={selectedDate}
          events={selectedEvents}
        />
      </div>
    </div>
  );
};

export default Index;
