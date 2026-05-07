'use client';
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface TrendChartCardProps {
  currentWeight: number;
  targetWeight: number;
  weeks: number;
}

export const TrendChartCard = ({ currentWeight, targetWeight, weeks }: TrendChartCardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!containerRef.current || !svgRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = 220;
    const margin = { top: 20, right: 35, bottom: 20, left: 10 };

    // Clear previous
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Generate fake data points
    const pointsCount = 7;
    const data = Array.from({ length: pointsCount }, (_, i) => {
      const progress = i / (pointsCount - 1);
      const randomNoise = (Math.random() - 0.5) * Math.abs(currentWeight - targetWeight) * 0.15;
      let val = currentWeight + (targetWeight - currentWeight) * progress + randomNoise;
      if (i === 0) val = currentWeight;
      if (i === pointsCount - 1) val = targetWeight;
      return { x: i, y: val };
    });

    const minWeight = Math.min(currentWeight, targetWeight) - 5;
    const maxWeight = Math.max(currentWeight, targetWeight) + 5;

    const xScale = d3.scaleLinear()
      .domain([0, pointsCount - 1])
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([minWeight, maxWeight])
      .range([height - margin.bottom, margin.top]);

    // Horizontal gridlines (Y axis) - academic style
    const yAxis = d3.axisRight(yScale)
      .ticks(4)
      .tickSize(width - margin.left - margin.right)
      .tickFormat(d => `${d}kg`);

    const gY = svg.append('g')
      .attr('class', 'grid-lines')
      .attr('transform', `translate(${margin.left},0)`)
      .call(yAxis);

    gY.select('.domain').remove();
    gY.selectAll('.tick line')
      .attr('stroke', 'currentColor')
      .attr('stroke-opacity', 0.08)
      .attr('stroke-dasharray', '4,4');
    gY.selectAll('.tick text')
      .attr('fill', 'currentColor')
      .attr('opacity', 0.45)
      .attr('font-size', '10px')
      .attr('font-weight', '600')
      .attr('x', width - margin.left - margin.right + 5);

    // Vertical gridlines (X axis) at each data point
    const xAxisGroup = svg.append('g').attr('transform', `translate(0, ${height - margin.bottom})`);

    // X-axis baseline
    xAxisGroup.append('line')
      .attr('x1', margin.left)
      .attr('x2', width - margin.right)
      .attr('stroke', 'currentColor')
      .attr('stroke-opacity', 0.15)
      .attr('stroke-width', 1);

    // X-axis tick marks & vertical gridlines
    for (let i = 0; i < pointsCount; i++) {
      const x = xScale(i);

      // Vertical dashed gridline
      svg.append('line')
        .attr('x1', x)
        .attr('x2', x)
        .attr('y1', margin.top)
        .attr('y2', height - margin.bottom)
        .attr('stroke', 'currentColor')
        .attr('stroke-opacity', 0.07)
        .attr('stroke-dasharray', '3,4')
        .attr('stroke-width', 1);

      // Tick mark on X axis
      xAxisGroup.append('line')
        .attr('x1', x)
        .attr('x2', x)
        .attr('y1', 0)
        .attr('y2', 5)
        .attr('stroke', 'currentColor')
        .attr('stroke-opacity', 0.3)
        .attr('stroke-width', 1);

      // X-axis label: Week N
      xAxisGroup.append('text')
        .attr('x', x)
        .attr('y', 16)
        .attr('text-anchor', 'middle')
        .attr('fill', 'currentColor')
        .attr('opacity', 0.45)
        .attr('font-size', '9px')
        .attr('font-weight', '600')
        .text(`W${i + 1}`);
    }

    const line = d3.line<{ x: number, y: number }>()
      .curve(d3.curveBasis)
      .x(d => xScale(d.x))
      .y(d => yScale(d.y));

    const area = d3.area<{ x: number, y: number }>()
      .curve(d3.curveBasis)
      .x(d => xScale(d.x))
      .y0(height - margin.bottom + 10)
      .y1(d => yScale(d.y));

    // Defs & Gradient
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', 'chart-gradient')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', 'var(--color-primary)')
      .attr('stop-opacity', 0.4);

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'var(--color-primary)')
      .attr('stop-opacity', 0);

    // Claymorphism shadow filter
    const filter = defs.append('filter')
      .attr('id', 'clay-shadow')
      .attr('x', '-20%').attr('y', '-20%')
      .attr('width', '140%').attr('height', '140%');

    filter.append('feDropShadow')
      .attr('dx', 0)
      .attr('dy', 2)
      .attr('stdDeviation', 2)
      .attr('flood-color', 'rgba(0,0,0,0.15)');

    // Draw Area
    const pathArea = svg.append('path')
      .datum(data)
      .attr('fill', 'url(#chart-gradient)')
      .attr('d', area);

    // Draw Line
    const pathLine = svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'var(--color-primary)')
      .attr('stroke-width', 4)
      .attr('stroke-linecap', 'round')
      .attr('d', line);

    // Animate line drawing
    const totalLength = (pathLine.node() as SVGPathElement).getTotalLength();
    pathLine
      .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(2000)
      .ease(d3.easeCubicOut)
      .attr('stroke-dashoffset', 0);

    // Animate area opacity
    pathArea
      .style('opacity', 0)
      .transition()
      .duration(2000)
      .style('opacity', 1);

    // Auxiliary line: target weight reference
    svg.append('line')
      .attr('x1', margin.left)
      .attr('x2', width - margin.right)
      .attr('y1', yScale(targetWeight))
      .attr('y2', yScale(targetWeight))
      .attr('stroke', 'var(--color-primary)')
      .attr('stroke-opacity', 0.35)
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '6,4')
      .style('opacity', 0)
      .transition().delay(1200).duration(600).style('opacity', 1);

    // Target weight label
    svg.append('text')
      .attr('x', width - margin.right + 4)
      .attr('y', yScale(targetWeight))
      .attr('dy', '0.35em')
      .attr('fill', 'var(--color-primary)')
      .attr('font-size', '10px')
      .attr('font-weight', '700')
      .attr('opacity', 0)
      .text(`${targetWeight}kg`)
      .transition().delay(1500).duration(400).attr('opacity', 1);

    // Draw data points: white circle with gray transparent border
    const pointGroup = svg.selectAll('.data-point-group')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'data-point-group')
      .attr('transform', d => `translate(${xScale(d.x)},${yScale(d.y)})`)
      .style('opacity', 0);

    // Subtle drop shadow behind circle
    pointGroup.append('circle')
      .attr('r', 5)
      .attr('cy', 1.5)
      .attr('fill', 'rgba(0,0,0,0.06)');

    // Main white circle with gray border
    pointGroup.append('circle')
      .attr('r', 4)
      .attr('fill', 'white')
      .attr('stroke', 'rgba(228, 228, 228, 0.8)')
      .attr('stroke-width', 2.5);

    // Staggered reveal animation
    pointGroup
      .transition()
      .delay((_, i) => 600 + i * (1400 / pointsCount))
      .duration(400)
      .style('opacity', 1);



  }, [currentWeight, targetWeight]);

  const diff = targetWeight - currentWeight;
  const isLoss = diff < 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 w-full">
      <h3 className="text-gray-500 dark:text-gray-400 font-semibold text-sm uppercase tracking-wider mb-2">Weight Trend Forecast</h3>
      <div className="flex items-end gap-2 mb-2">
        <span className="text-3xl font-bold font-outfit text-gray-800 dark:text-white tabular-nums">
          {Math.abs(diff).toFixed(1)}
        </span>
        <span className="text-lg font-bold text-gray-500 mb-1">
          kg {isLoss ? '↓ Loss' : '↑ Gain'}
        </span>
      </div>
      {/* Inset shadow container for academic chart look — white background */}
      <div
        ref={containerRef}
        className="w-full relative mt-3 rounded-2xl overflow-hidden"
        style={{
          background: '#ffffff',
          boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.08), inset 0 1px 4px rgba(0,0,0,0.06)',
          padding: '12px 4px 4px',
        }}
      >
        <svg ref={svgRef} className="overflow-visible" />
      </div>
    </div>
  );
};
