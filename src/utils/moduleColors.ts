// Maps module IDs to color indices (1-8)
const moduleColorMap = new Map<string, number>();
let colorIndex = 1;

export const getModuleColor = (moduleId: string): number => {
  if (!moduleColorMap.has(moduleId)) {
    moduleColorMap.set(moduleId, colorIndex);
    colorIndex = (colorIndex % 8) + 1;
  }
  return moduleColorMap.get(moduleId)!;
};

export const getModuleColorClass = (moduleId: string): string => {
  const colorNum = getModuleColor(moduleId);
  return `module-${colorNum}`;
};
