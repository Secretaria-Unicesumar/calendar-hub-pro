import { CalendarEvent } from "@/types/calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filter, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { getModuleColor } from "@/utils/moduleColors";

interface CalendarFiltersProps {
  events: CalendarEvent[];
  selectedModules: string[];
  selectedCategories: string[];
  onModulesChange: (modules: string[]) => void;
  onCategoriesChange: (categories: string[]) => void;
}

export const CalendarFilters = ({
  events,
  selectedModules,
  selectedCategories,
  onModulesChange,
  onCategoriesChange,
}: CalendarFiltersProps) => {
  const allModules = Array.from(new Set(events.map((e) => e.modulo))).sort();
  const allCategories = Array.from(new Set(events.map((e) => e.categoria))).sort();
  
  const toggleModule = (module: string) => {
    if (selectedModules.includes(module)) {
      onModulesChange(selectedModules.filter((m) => m !== module));
    } else {
      onModulesChange([...selectedModules, module]);
    }
  };
  
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoriesChange(selectedCategories.filter((c) => c !== category));
    } else {
      onCategoriesChange([...selectedCategories, category]);
    }
  };
  
  const clearAllFilters = () => {
    onModulesChange([]);
    onCategoriesChange([]);
  };
  
  const hasActiveFilters = selectedModules.length > 0 || selectedCategories.length > 0;
  
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Módulos
            {selectedModules.length > 0 && (
              <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                {selectedModules.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 max-h-[400px] overflow-y-auto">
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-sm">Filtrar por Módulo</h4>
              {selectedModules.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onModulesChange([])}
                  className="h-auto p-1 text-xs"
                >
                  Limpar
                </Button>
              )}
            </div>
            {allModules.map((module) => {
              const colorNum = getModuleColor(module);
              const isSelected = selectedModules.includes(module);
              
              return (
                <div
                  key={module}
                  className="flex items-center space-x-2 p-2 rounded hover:bg-muted cursor-pointer"
                  onClick={() => toggleModule(module)}
                >
                  <Checkbox
                    id={`module-${module}`}
                    checked={isSelected}
                    onCheckedChange={() => toggleModule(module)}
                  />
                  <label
                    htmlFor={`module-${module}`}
                    className="flex items-center gap-2 flex-1 cursor-pointer"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: `hsl(var(--module-${colorNum}))`,
                      }}
                    />
                    <span className="text-sm">{module}</span>
                  </label>
                </div>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Categorias
            {selectedCategories.length > 0 && (
              <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                {selectedCategories.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 max-h-[400px] overflow-y-auto">
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-sm">Filtrar por Categoria</h4>
              {selectedCategories.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onCategoriesChange([])}
                  className="h-auto p-1 text-xs"
                >
                  Limpar
                </Button>
              )}
            </div>
            {allCategories.map((category) => {
              const isSelected = selectedCategories.includes(category);
              
              return (
                <div
                  key={category}
                  className="flex items-center space-x-2 p-2 rounded hover:bg-muted cursor-pointer"
                  onClick={() => toggleCategory(category)}
                >
                  <Checkbox
                    id={`category-${category}`}
                    checked={isSelected}
                    onCheckedChange={() => toggleCategory(category)}
                  />
                  <label
                    htmlFor={`category-${category}`}
                    className="text-sm flex-1 cursor-pointer"
                  >
                    {category}
                  </label>
                </div>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
      
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAllFilters}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
          Limpar filtros
        </Button>
      )}
    </div>
  );
};
