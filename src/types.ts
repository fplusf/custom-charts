// Represents a single data point in the chart
export interface DataPoint {
  label: string;
  value: number;
}

// Represents the options for the chart
export interface ChartOptions {
  width: number;
  height: number;
  padding: number;
  barColor: string;
  axisColor: string;
  labelColor: string;
  dpr: number;
}