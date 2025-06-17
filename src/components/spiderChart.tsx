"use client"

import React, { useEffect } from "react";
import * as d3 from 'd3';

interface DataPoint {
    axis: string;
    value: number;
}

export const SpiderChart = () => {
    useEffect(() => {
        const data: DataPoint[] = [
            { axis: "I", value: 65 },
            { axis: "P", value: 68 },
            { axis: "E", value: 90 },
            { axis: "D", value: 31 },
            { axis: "V", value: 56 },
        ];

        // Close the radar chart by adding the first point to the end
        const closedData = [...data, data[0]]; // Append the first data point

        // Create a second dataset for the maximum values
        const maxData: DataPoint[] = [
            { axis: "I", value: 100 },
            { axis: "P", value: 100 },
            { axis: "E", value: 100 },
            { axis: "D", value: 100 },
            { axis: "V", value: 100 },
        ];
        const closedMaxData = [...maxData, maxData[0]]; // Append the first data point

        const margin = { top: 20, right: 20, bottom: 20, left: 20 };
        const width = 400;
        const height = 400;

        const svg = d3.select("#viped-spider-chart")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`); // Center the group

        const maxValue = 100; // Fixed maximum value
        const allAxis = data.map((d: DataPoint) => d.axis);
        const total = allAxis.length;
        const angleSlice = (Math.PI * 2) / total;

        const radius = Math.min((width - margin.left - margin.right) / 2, (height - margin.top - margin.bottom) / 2);

        // Create the radar chart background
        const rScale = d3.scaleLinear().range([0, radius]).domain([0, maxValue]);

        // Draw the light blue background area
        svg.append("path")
            .datum(closedMaxData) // Use the closed max data for background
            .attr("class", "radar-background")
            .attr("d", d3.lineRadial<DataPoint>()
                .radius(d => rScale(d.value)) // Reduce radius for curvature effect
                .angle((d, i) => angleSlice * i))
            .style("fill", "oklch(52% 0.105 223.128)") // Light blue color with some transparency
            .style("stroke", "none"); // No stroke for the background

        // Draw the radar chart path
        svg.append("path")
            .datum(closedData) // Use the closed data
            .attr("class", "radar-chart")
            .attr("d", d3.lineRadial<DataPoint>()
                .radius(d => rScale(d.value))
                .angle((d, i) => angleSlice * i))
            .style("fill", "oklch(60% 0.118 184.704)") // No fill for the radar chart path
            .style("stroke", "white") // Set stroke color to white
            .style("stroke-width", 2);

        // Draw the axes
        svg.selectAll(".axis")
            .data(allAxis)
            .enter()
            .append("g")
            .attr("class", "axis")
            .attr("transform", (d: string, i: number) => `rotate(${i * (360 / total)})`)
            .append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", (d: string, i: number) => rScale(maxValue) * Math.cos(angleSlice * i - Math.PI / 2))
            .attr("y2", (d: string, i: number) => rScale(maxValue) * Math.sin(angleSlice * i - Math.PI / 2))
            .attr("class", "line")
            .style("stroke", "white") // Set axis lines to white
            .style("stroke-width", 2); // Adjust stroke width as needed

        // Add small white dots at the end of each axis
        svg.selectAll(".axis-dot")
            .data(allAxis)
            .enter()
            .append("circle")
            .attr("class", "axis-dot")
            .attr("cx", (d: string, i: number) => rScale(maxValue) * Math.cos(angleSlice * i - Math.PI / 2))
            .attr("cy", (d: string, i: number) => rScale(maxValue) * Math.sin(angleSlice * i - Math.PI / 2))
            .attr("r", 3) // Radius of the small dot
            .style("fill", "white"); // Set dot color to white

        // Add circles at the end of each axis
        svg.selectAll(".axis-circle")
            .data(closedData) // Use closed data for circles
            .enter()
            .append("circle")
            .attr("class", "axis-circle")
            .attr("cx", (d: DataPoint, i: number) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
            .attr("cy", (d: DataPoint, i: number) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))
            .attr("r", 10) // Radius of the circle
            .style("fill", "white") // Set circle color to white


        // Add labels at the end of each axis, positioned outside
        svg.selectAll(".label")
            .data(allAxis)
            .enter()
            .append("text")
            .attr("class", "label")
            .attr("text-anchor", "middle")
            .attr("x", (d: string, i: number) => (rScale(maxValue) + 15) * Math.cos(angleSlice * i - Math.PI / 2)) // Offset for outside positioning
            .attr("y", (d: string, i: number) => {
                // Adjust the y position for the bottom labels
                const offset = 15; // General offset for all labels to account for circle size
                return (rScale(maxValue) + offset) * Math.sin(angleSlice * i - Math.PI / 2) + (i === 2 || i === 3 ? 5 : 0); // Adjust for "E" and "D"
            }) // Offset for outside positioning
            .text((d: string) => d) // Set the text to the axis label
            .style("fill", "white") // Set label color to white
            .style("font-size", "14px") // Adjust font size as needed
            .style("font-family", "Arial, sans-serif"); // Set a consistent font family

    }, []);

    return (
        <svg id="viped-spider-chart" className="w-full"></svg>
    )
}
