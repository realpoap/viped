// src/components/spiderChart.tsx
"use client"

import React, { useEffect, useRef } from "react";
import * as d3 from 'd3';

interface DataPoint {
    axis: string;
    value: number;
}

export const SpiderChart = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null); // Create a ref for the canvas

    useEffect(() => {
        const data: DataPoint[] = [
            { axis: "I", value: 65 },
            { axis: "P", value: 68 },
            { axis: "E", value: 90 },
            { axis: "D", value: 31 },
            { axis: "V", value: 56 },
        ];

        const maxValue = 100; // Fixed maximum value
        const radius = 200; // Example radius (half of canvas size)
        const angleSlice = (Math.PI * 2) / data.length;

        const canvas = canvasRef.current; // Get the canvas reference
        if (!canvas) return; // Ensure the canvas exists

        const context = canvas.getContext("2d"); // Get the 2D context
        if (!context) return; // Ensure the context is available

        // Clear the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the radar chart background
        const radarLine = d3.lineRadial()
            .radius(d => (radius * d.value) / maxValue)
            .angle((d, i) => i * angleSlice)
            .curve(d3.curveCardinal); // Use curveCardinal for smooth curves

        // Draw the background path
        context.beginPath();
        radarLine.context(context)(data);
        context.fillStyle = "lightblue";
        context.globalAlpha = 0.5;
        context.fill();

        // Draw the radar chart path for the actual values
        context.beginPath();
        radarLine.context(context)(data);
        context.strokeStyle = "white";
        context.lineWidth = 2;
        context.stroke();

        // Draw small points on the axes with labels
        data.forEach((d, i) => {
            const angle = i * angleSlice;
            const x = (radius * d.value) / maxValue * Math.cos(angle - Math.PI / 2);
            const y = (radius * d.value) / maxValue * Math.sin(angle - Math.PI / 2);

            // Draw small point
            context.beginPath();
            context.arc(200 + x, 200 + y, 5, 0, 2 * Math.PI); // Small circle
            context.fillStyle = "white";
            context.fill();

            // Draw label inside the point
            context.fillStyle = "black"; // Label color
            context.font = "10px sans-serif"; // Font size and family
            context.textAlign = "center"; // Center the text
            context.textBaseline = "middle"; // Middle alignment
            context.fillText(d.axis, 200 + x, 200 + y); // Draw the label
        });
    }, []);

    return <canvas ref={canvasRef} width={400} height={400} className="w-full"></canvas>;
};