import React, { useEffect, useRef } from 'react';

const AsciiGameOfLife = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const gridStateRef = useRef<{
    width: number;
    height: number;
    currentGrid: number[][];
    nextGrid: number[][];
    ageGrid: number[][];
    noiseGrid: number[][];
    generation: number;
    lastGameUpdate: number;
    lastRandomSpawn: number;
    lastNoiseUpdate: number;
  }>();

  useEffect(() => {
    const width = 180;
    const height = 8;
    const gameSpeed = 5000;
    const randomSpawnInterval = 3000;
    const noiseUpdateInterval = 500;

    // Initialize grid state
    const initGrid = () => {
      const currentGrid: number[][] = [];
      const nextGrid: number[][] = [];
      const ageGrid: number[][] = [];
      const noiseGrid: number[][] = [];
      
      for (let y = 0; y < height; y++) {
        const currentRow: number[] = [];
        const nextRow: number[] = [];
        const ageRow: number[] = [];
        const noiseRow: number[] = [];
        for (let x = 0; x < width; x++) {
          currentRow.push(0);
          nextRow.push(0);
          ageRow.push(0);
          noiseRow.push(Math.random() * 5);
        }
        currentGrid.push(currentRow);
        nextGrid.push(nextRow);
        ageGrid.push(ageRow);
        noiseGrid.push(noiseRow);
      }

      return { currentGrid, nextGrid, ageGrid, noiseGrid };
    };

    const seedGrid = (currentGrid: number[][]) => {
      const centerX = Math.floor(width / 2);
      const centerY = Math.floor(height / 2);
      
      // Vertical blinker
      if (centerY - 1 >= 0 && centerY + 1 < height) {
        currentGrid[centerY - 1][centerX] = 1;
        currentGrid[centerY][centerX] = 1;
        currentGrid[centerY + 1][centerX] = 1;
      }

      // Another vertical blinker offset
      if (centerY - 1 >= 0 && centerY + 1 < height) {
        currentGrid[centerY - 1][centerX - 25] = 1;
        currentGrid[centerY][centerX - 25] = 1;
        currentGrid[centerY + 1][centerX - 25] = 1;
      }

      // Glider 1 - left side
      if (centerY - 1 >= 0 && centerY + 1 < height) {
        currentGrid[centerY - 1][25] = 1;
        currentGrid[centerY - 1][27] = 1;
        currentGrid[centerY][26] = 1;
        currentGrid[centerY][27] = 1;
        currentGrid[centerY + 1][26] = 1;
      }

      // Glider 2 - right side
      if (centerY - 1 >= 0 && centerY + 1 < height) {
        currentGrid[centerY - 1][width - 25] = 1;
        currentGrid[centerY - 1][width - 23] = 1;
        currentGrid[centerY][width - 24] = 1;
        currentGrid[centerY][width - 23] = 1;
        currentGrid[centerY + 1][width - 24] = 1;
      }

      // Blocks for stability
      if (centerY - 1 >= 0 && centerY < height) {
        currentGrid[centerY - 1][centerX - 40] = 1;
        currentGrid[centerY - 1][centerX - 39] = 1;
        currentGrid[centerY][centerX - 40] = 1;
        currentGrid[centerY][centerX - 39] = 1;
      }

      // Random scattered cells
      for (let i = 0; i < 20; i++) {
        const x = Math.floor(Math.random() * width);
        const y = Math.floor(Math.random() * height);
        if (Math.random() > 0.75) {
          currentGrid[y][x] = 1;
        }
      }
    };

    const updateNoise = (noiseGrid: number[][]) => {
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          noiseGrid[y][x] += (Math.random() - 0.5) * 0.3;
          noiseGrid[y][x] = Math.max(0, Math.min(10, noiseGrid[y][x]));
          
          if (Math.random() > 0.95) {
            const neighbors: number[] = [];
            for (let dy = -1; dy <= 1; dy++) {
              for (let dx = -1; dx <= 1; dx++) {
                const nx = x + dx;
                const ny = y + dy;
                if (nx >= 0 && nx < width && ny >= 0 && ny < height && !(dx === 0 && dy === 0)) {
                  neighbors.push(noiseGrid[ny][nx]);
                }
              }
            }
            if (neighbors.length > 0) {
              const avgNoise = neighbors.reduce((a, b) => a + b, 0) / neighbors.length;
              noiseGrid[y][x] = (noiseGrid[y][x] * 0.7) + (avgNoise * 0.3);
            }
          }
        }
      }
    };

    const spawnRandomCell = (currentGrid: number[][], ageGrid: number[][]) => {
      if (Math.random() > 0.3) {
        const x = Math.floor(Math.random() * width);
        const y = Math.floor(Math.random() * height);
        
        if (currentGrid[y][x] === 0) {
          currentGrid[y][x] = 1;
          ageGrid[y][x] = 0;
        }
      }
    };

    const countNeighbors = (x: number, y: number, grid: number[][]) => {
      let count = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            count += grid[ny][nx];
          }
        }
      }
      return count;
    };

    const updateGameLogic = (currentGrid: number[][], nextGrid: number[][]) => {
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const neighbors = countNeighbors(x, y, currentGrid);
          const currentCell = currentGrid[y][x];
          
          if (currentCell === 1) {
            if (neighbors < 2) {
              nextGrid[y][x] = 0;
            } else if (neighbors === 2 || neighbors === 3) {
              nextGrid[y][x] = 1;
            } else {
              nextGrid[y][x] = 0;
            }
          } else {
            if (neighbors === 3) {
              nextGrid[y][x] = 1;
            } else {
              nextGrid[y][x] = 0;
            }
          }
        }
      }
    };

    const updateAges = (currentGrid: number[][], ageGrid: number[][]) => {
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const currentCell = currentGrid[y][x];
          
          if (currentCell === 1) {
            ageGrid[y][x] = Math.min(20, ageGrid[y][x] + 0.8);
          } else {
            ageGrid[y][x] = Math.max(0, ageGrid[y][x] - 0.5);
          }
        }
      }
    };

    const render = (currentGrid: number[][], ageGrid: number[][], noiseGrid: number[][]) => {
      if (!canvasRef.current) return;
      
      let html = '';
      
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const cell = currentGrid[y][x];
          const age = ageGrid[y][x];
          const noise = noiseGrid[y][x];
          
          if (cell === 1 || age > 0) {
            // Use only consistent-width block characters to prevent jittering
            const symbols = ['█', '▓', '▒', '░', '■', '□'];
            
            let symbol: string;
            let opacity: number;
            
            if (age >= 16) {
              symbol = symbols[0]; // █
              opacity = 0.95;
            } else if (age >= 12) {
              symbol = symbols[1]; // ▓
              opacity = 0.85;
            } else if (age >= 8) {
              symbol = symbols[2]; // ▒
              opacity = 0.75;
            } else if (age >= 6) {
              symbol = symbols[3]; // ░
              opacity = 0.65;
            } else if (age >= 4) {
              symbol = symbols[4]; // ■
              opacity = 0.4 + (age / 20);
            } else if (age >= 2) {
              symbol = symbols[5]; // □
              opacity = 0.25 + (age / 15);
            } else if (age >= 1) {
              symbol = symbols[4]; // ■
              opacity = 0.15 + (age / 10);
            } else {
              symbol = symbols[5]; // □
              opacity = 0.05 + (age / 8);
            }
            
            const brownShades = [
              [101, 67, 33], [139, 90, 43], [160, 82, 45], [139, 105, 20],
              [92, 51, 23], [123, 63, 0], [107, 68, 35], [165, 113, 78],
              [83, 53, 10], [101, 84, 20], [150, 111, 51], [111, 78, 55]
            ];
            
            const colorIndex = Math.floor((x + y + age) * 0.5) % brownShades.length;
            const [r, g, b] = brownShades[colorIndex];
            const color = `rgba(${r}, ${g}, ${b}, ${opacity})`;
            
            html += `<span style="color: ${color}">${symbol}</span>`;
          } else {
            // Use consistent-width characters for noise too
            const noiseThreshold = 2.5;
            const strongNoiseThreshold = 6;
            
            if (noise > strongNoiseThreshold) {
              // Use only consistent dot/period characters
              const strongNoiseSymbols = ['.', '·', '•'];
              const noiseSymbol = strongNoiseSymbols[Math.floor((noise + x + y) * 1.3) % strongNoiseSymbols.length];
              const noiseOpacity = 0.15 + (noise - strongNoiseThreshold) * 0.05;
              const noiseColor = `rgba(101, 67, 33, ${Math.min(0.4, noiseOpacity)})`;
              html += `<span style="color: ${noiseColor}">${noiseSymbol}</span>`;
            } else if (noise > noiseThreshold) {
              // Use consistent small dots
              const mediumNoiseSymbols = ['.', '·'];
              const noiseSymbol = mediumNoiseSymbols[Math.floor((noise + x * 0.7 + y * 1.1) * 2) % mediumNoiseSymbols.length];
              const noiseOpacity = 0.08 + (noise - noiseThreshold) * 0.02;
              const noiseColor = `rgba(139, 90, 43, ${Math.min(0.25, noiseOpacity)})`;
              html += `<span style="color: ${noiseColor}">${noiseSymbol}</span>`;
            } else if (noise > 1) {
              // Use simple dash for light noise
              if (Math.random() > 0.85) {
                const noiseOpacity = 0.03 + noise * 0.01;
                const noiseColor = `rgba(160, 82, 45, ${Math.min(0.15, noiseOpacity)})`;
                html += `<span style="color: ${noiseColor}">-</span>`;
              } else {
                html += ' ';
              }
            } else {
              html += ' ';
            }
          }
        }
        html += '<br>';
      }
      
      canvasRef.current.innerHTML = html;
    };

    const animate = (timestamp: number) => {
      if (!gridStateRef.current) return;

      const state = gridStateRef.current;

      if (timestamp - state.lastGameUpdate >= gameSpeed) {
        updateGameLogic(state.currentGrid, state.nextGrid);
        const temp = state.currentGrid;
        state.currentGrid = state.nextGrid;
        state.nextGrid = temp;
        state.generation++;
        state.lastGameUpdate = timestamp;
      }
      
      if (timestamp - state.lastRandomSpawn >= randomSpawnInterval) {
        spawnRandomCell(state.currentGrid, state.ageGrid);
        state.lastRandomSpawn = timestamp;
      }
      
      if (timestamp - state.lastNoiseUpdate >= noiseUpdateInterval) {
        updateNoise(state.noiseGrid);
        state.lastNoiseUpdate = timestamp;
      }
      
      updateAges(state.currentGrid, state.ageGrid);
      render(state.currentGrid, state.ageGrid, state.noiseGrid);
      
      animationRef.current = requestAnimationFrame(animate);
    };

    // Initialize
    const { currentGrid, nextGrid, ageGrid, noiseGrid } = initGrid();
    seedGrid(currentGrid);
    
    gridStateRef.current = {
      width,
      height,
      currentGrid,
      nextGrid,
      ageGrid,
      noiseGrid,
      generation: 0,
      lastGameUpdate: 0,
      lastRandomSpawn: 0,
      lastNoiseUpdate: 0
    };

    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full overflow-hidden">
      <div
        ref={canvasRef}
        className="font-mono leading-tight select-none whitespace-pre text-center w-full"
        style={{
          fontFamily: "'Courier New', monospace",
          lineHeight: "0.9",
          letterSpacing: "0px",
          fontSize: "7px", // Slightly increased from 8px to 7px for better visibility
          width: "100%",
        }}
      />
    </div>
  );
};

export default AsciiGameOfLife;
