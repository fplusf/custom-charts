import { ChartOptions, DataPoint } from './types';

interface Bar {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  value: number;
}

// Draws the entire bar chart
export function drawBarChart(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  data: DataPoint[],
  options: ChartOptions
) {
  // Clear the canvas before drawing
  ctx.clearRect(0, 0, options.width, options.height);

  // Draw the axes
  drawAxes(ctx, options);

  // Handle mouse hover
  handleMouseHover(canvas, ctx, options, drawBars(ctx, data, options));
}

// Draws the X and Y axes
function drawAxes(ctx: CanvasRenderingContext2D, options: ChartOptions): void {
  const { width, height, padding, axisColor } = options;

  ctx.strokeStyle = axisColor;
  ctx.lineWidth = 2;

  // Draw X axis
  ctx.beginPath();
  ctx.moveTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.stroke();

  // Draw Y axis
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding);
  ctx.stroke();
}

// Draws the bars based on the data
function drawBars(ctx: CanvasRenderingContext2D, data: DataPoint[], options: ChartOptions): Bar[] {
  const { width, height, padding, barColor, labelColor } = options;
  const bars: Bar[] = [];

  const barWidth = (width - 2 * padding) / data.length;

  const fontSize = Math.min(barWidth / 3, 28);
  ctx.font = `${fontSize}px Arial`;
  ctx.fillStyle = barColor;

  data.forEach((point, index) => {
    const barHeight = (point.value / Math.max(...data.map((p) => p.value))) * (height - 2 * padding);
    const x = padding + index * barWidth;
    const y = height - padding - barHeight;

    // Draw the bar
    ctx.fillRect(x, y, barWidth - 5, barHeight);

    // Draw the label
    ctx.fillStyle = labelColor;
    ctx.textAlign = 'center';
    ctx.fillText(point.label, x + barWidth / 2 - 2.5, height - padding + fontSize + 5);

    ctx.fillStyle = barColor;

    // Assign an ID and store bar info
    const id = `bar-${index}`;
    bars.push({
      id,
      x,
      y,
      width: barWidth - 5,
      height: barHeight,
      label: point.label,
      value: point.value,
    });
  });

  return bars;
}

function handleMouseHover(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  options: ChartOptions,
  bars: Bar[]
): void {
  canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    let hoveredBar: Bar | null = null;

    bars.forEach((bar) => {
      if (
        x > bar.x / options.dpr &&
        x < (bar.x + bar.width) / options.dpr &&
        y < (bar.y + bar.height) / options.dpr &&
        y > bar.y / options.dpr
      ) {
        hoveredBar = bar;
      }
    });

    if (hoveredBar) {
      drawTooltip(ctx, hoveredBar, options);
    } else {
      hideTooltip();
    }
  });
}

function drawTooltip(ctx: CanvasRenderingContext2D, bar: Bar, options: ChartOptions): void {
  const padding = 5;
  const text = `${bar.label}: ${bar.value}`;

  // Get the tooltip element
  const chartData = document.getElementById('chartData');
  if (chartData) {
    // Update tooltip content
    chartData.innerHTML = text;

    // Apply CSS styles to tooltip
    chartData.style.position = 'absolute';

    // Calculate position above the bar
    const canvasRect = ctx.canvas.getBoundingClientRect();
    const tooltipX = canvasRect.left + (bar.x + bar.width / 2) / options.dpr;
    const tooltipY = canvasRect.top + bar.y / options.dpr - 10; // 10px above the bar

    // Apply the position
    chartData.style.left = `${tooltipX}px`;
    chartData.style.top = `${tooltipY}px`;
    // Center horizontally and position above
    chartData.style.transform = 'translate(-50%, -100%)';

    chartData.style.backgroundColor = '#000';
    chartData.style.color = '#fff';
    chartData.style.padding = `${padding}px`;
    chartData.style.borderRadius = '4px';
    chartData.style.pointerEvents = 'none';
    chartData.style.display = 'block';
  }
}

function hideTooltip(): void {
  const chartData = document.getElementById('chartData');
  if (chartData) {
    chartData.style.display = 'none';
  }
}
