import { drawBarChart } from './bar-chart';
import './style.css';
import { ChartOptions, DataPoint } from './types';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Bar Chart</h1>
    <div id="chartData"></div>
    <canvas id="chartCanvas"></canvas>
  </div>
`;
const canvas = document.getElementById('chartCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

setCanvasSize(canvas, 600, 400);

// Sample data
const data: DataPoint[] = [
  { label: 'January', value: 30 },
  { label: 'February', value: 50 },
  { label: 'March', value: 40 },
  { label: 'April', value: 60 },
  { label: 'May', value: 70 },
];

// Chart configuration
const options: ChartOptions = {
  width: canvas.width,
  height: canvas.height,
  padding: 50,
  barColor: '#3498db',
  axisColor: '#046ac9',
  labelColor: '#6691bd',
  dpr: window.devicePixelRatio || 1,
};

// Draw the bar chart
drawBarChart(canvas, ctx, data, options);

// Set the canvas size based on the device pixel ratio DPR
function setCanvasSize(canvas: HTMLCanvasElement, width: number, height: number) {
  // Get the device pixel ratio, falling back to 1.
  const dpr = window.devicePixelRatio || 1;

  console.log('Device pixel ratio:', dpr);

  // Set the canvas size based on the device pixel ratio
  canvas.width = width * dpr;
  canvas.height = height * dpr;

  // Scale the canvas context to match the device pixel ratio
  // ctx.scale(dpr, dpr);

  // Set the display size (CSS pixels)
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
}
