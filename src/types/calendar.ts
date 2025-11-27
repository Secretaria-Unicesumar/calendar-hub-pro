export interface CalendarEvent {
  id: string;
  atividade: string;
  produto: string;
  categoria: string;
  modulo: string;
  dataInicio: Date;
  dataFim: Date;
}

export interface DayEvents {
  date: Date;
  events: CalendarEvent[];
}
