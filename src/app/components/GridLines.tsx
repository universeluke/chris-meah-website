"use client";

import { useEffect, useState } from "react";

interface Node {
  id: number;
  x: number;
  y: number;
  baseX: number;
  baseY: number;
}

export default function NetworkBackground() {
  const [nodes, setNodes] = useState<Node[]>([]);

  // grid lines replaced with grid of nodes
  useEffect(() => {
    const cols = 16;
    const rows = 12;

    // need: width and height of window to  work out space between nodes
    const cellWidth = window.innerWidth / cols;
    const cellHeight = window.innerHeight / rows;

    //push the nodes to an empty array after calculating
    const initialNodes = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        initialNodes.push({
          //unique id that describes the node's position
          id: row * cols + col,
          x: (col + 0.5) * cellWidth,
          y: (row + 0.5) * cellHeight,
          baseX: (col + 0.5) * cellWidth,
          baseY: (row + 0.5) * cellHeight,
        });
      }
    }
    setNodes(initialNodes);

    // need an event listener for resizing
    // same calculations on trigger
    window.addEventListener("resize", () => {
      const newCellWidth = window.innerWidth / cols;
      const newCellHeight = window.innerHeight / rows;

      setNodes((prevNodes) =>
        prevNodes.map((node, index) => {
          const row = Math.floor(index / cols);
          const col = index % cols;
          return {
            ...node,
            x: (col + 0.5) * newCellWidth,
            y: (row + 0.5) * newCellHeight,
            baseX: (col + 0.5) * newCellWidth, //original x
            baseY: (row + 0.5) * newCellHeight, //original y
          };
        })
      );
    });
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // update nodes based on mouse position every time mouse is moved
      setNodes((prevNodes) =>
        prevNodes.map((node) => {
          // logic (with help from claude) to calculate horizontal and vertical distances between mouse and node's original pos (baseX, baseY)
          const dx = e.clientX - node.baseX;
          const dy = e.clientY - node.baseY;
          //pythagoras a^2 + b^2 = c^2 to find hyptoeneuse (direct distance)
          const distance = Math.sqrt(dx * dx + dy * dy);

          const maxDistance = 150;
          //by default each node stays in its base pos
          let newX = node.baseX;
          let newY = node.baseY;

          //only moves nodes when mouse in in range of maxDistance (in pixels)
          if (distance < maxDistance) {
            // stronger movement when the mouse distance is smaller
            //weaker as mouse moves away and the distance increases
            const factor = ((maxDistance - distance) / maxDistance) * 0.15;
            newX = node.baseX - dx * factor;
            newY = node.baseY - dy * factor;
          }

          return {
            // return new object with original properties, but with updated x and y coords
            ...node,
            x: newX,
            y: newY,
          };
        })
      );
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: -9999,
        backgroundColor: "#181818",
      }}
    >
      <svg
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        {nodes.map((node) => (
          <circle
            key={node.id}
            cx={node.x}
            cy={node.y}
            r={3}
            fill="#303030"
            opacity={0.6}
          />
        ))}
      </svg>
    </div>
  );
}
