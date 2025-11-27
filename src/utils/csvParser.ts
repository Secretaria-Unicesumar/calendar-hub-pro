import { CalendarEvent } from "@/types/calendar";

export const parseCSV = async (csvText: string): Promise<CalendarEvent[]> => {
  const lines = csvText.split('\n').filter(line => line.trim());
  const events: CalendarEvent[] = [];
  
  // Skip header
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    // Split by semicolon
    const parts = line.split(';');
    
    if (parts.length >= 6) {
      const [atividade, produto, categoria, modulo, dataInicioStr, dataFimStr] = parts;
      
      // Parse Brazilian date format (DD/MM/YYYY)
      const parseDate = (dateStr: string): Date => {
        const [day, month, year] = dateStr.trim().split('/');
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      };
      
      try {
        events.push({
          id: `${i}-${modulo}`,
          atividade: atividade.trim(),
          produto: produto.trim(),
          categoria: categoria.trim(),
          modulo: modulo.trim(),
          dataInicio: parseDate(dataInicioStr),
          dataFim: parseDate(dataFimStr),
        });
      } catch (error) {
        console.error(`Error parsing line ${i}:`, error);
      }
    }
  }
  
  return events;
};

export const loadCalendarData = async (): Promise<CalendarEvent[]> => {
  try {
    const response = await fetch('/data/calendario.csv');
    const blob = await response.blob();
    
    // Decode ANSI/Windows-1252 encoding
    const text = await blob.text();
    const decoder = new TextDecoder('windows-1252');
    const arrayBuffer = await blob.arrayBuffer();
    const decodedText = decoder.decode(arrayBuffer);
    
    return parseCSV(decodedText);
  } catch (error) {
    console.error('Error loading calendar data:', error);
    return [];
  }
};
