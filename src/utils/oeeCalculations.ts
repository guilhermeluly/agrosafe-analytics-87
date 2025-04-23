
// OEE Calculation functions
export const calculateAvailability = (plannedTime: number, downtime: number): number => {
  // Availability = (Planned Production Time - Downtime) / Planned Production Time
  return ((plannedTime - downtime) / plannedTime) * 100;
};

export const calculatePerformance = (
  actualProduction: number, 
  plannedTime: number, 
  downtime: number, 
  idealCycleTime: number
): number => {
  // Performance = (Total Pieces / Theoretical Production) * 100
  // where Theoretical Production = Operating Time / Ideal Cycle Time
  const operatingTime = plannedTime - downtime;
  const theoreticalProduction = operatingTime / idealCycleTime;
  return (actualProduction / theoreticalProduction) * 100;
};

export const calculateQuality = (
  actualProduction: number, 
  rework: number, 
  scrap: number, 
  lostPackages: number
): number => {
  // Quality = (Good Units / Total Units) * 100
  // where Good Units = Total Production - (Rejects + Rework + Lost Packages)
  const goodUnits = actualProduction - (rework + scrap + lostPackages);
  return (goodUnits / actualProduction) * 100;
};

export const calculateOEE = (
  availability: number, 
  performance: number, 
  quality: number
): number => {
  // OEE = Availability * Performance * Quality
  // (converted from percentages by dividing by 10000)
  return (availability * performance * quality) / 10000;
};

// Setup Time adjustment according to the business rules
export const adjustSetupTime = (setupTime: number): number => {
  // Rule: Setup up to 30 minutes doesn't reduce availability
  // Setup > 30 minutes: only the excess is counted as downtime
  return setupTime > 30 ? setupTime - 30 : 0;
};
