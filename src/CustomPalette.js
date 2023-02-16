import { palettes } from "./palettes";
import { useState, useEffect } from "react";
import {
  Container,
  Box,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  Switch,
  MenuItem,
} from "@mui/material";

export const CustomPalette = () => {
  const [gridSize, setGridSize] = useState(16);
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedImg, setSelectedImg] = useState(null);
  const [grid, setGrid] = useState(Array.from({ length: gridSize }));
  const [showBack, setShowBack] = useState(false);

  useEffect(() => {
    if (grid.length === gridSize) return;
    if (grid.length < gridSize) {
      const arrayItems = gridSize - grid.length;
      const updatedGrid = grid.concat(Array.apply(null, Array(arrayItems)));
      setGrid(updatedGrid);
      return;
    }

    const updatedGrid = [...grid];
    updatedGrid.length = gridSize;
    setGrid(updatedGrid);
  }, [gridSize]);

  const gridItemSelect = (idx) => {
    if (showBack) return;

    if (!selectedImg) return setSelectedCell(idx);
    const updatedGrid = [...grid];
    updatedGrid[idx] = selectedImg;
    setGrid(updatedGrid);
    setSelectedImg(null);
  };

  const imgSelect = (palette) => {
    if (showBack) return;

    if (!selectedCell) {
      setSelectedImg(palette);
      return;
    }

    if (!isNaN(selectedCell)) {
      const updatedGrid = [...grid];
      updatedGrid[selectedCell] = palette;
      setGrid(updatedGrid);
      setSelectedCell(null);
      return;
    }
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: "flex",
          paddingBlock: "1.25rem",
          alignItems: "center",
          gap: "1.5rem",
        }}
      >
        <FormControl sx={{ width: 150 }}>
          <InputLabel id="palette-size-label">Size</InputLabel>
          <Select
            labelId="palette-size-label"
            value={gridSize}
            label="Size"
            onChange={(e) => setGridSize(+e.target.value)}
          >
            <MenuItem value={16}>16</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={24}>24</MenuItem>
          </Select>
        </FormControl>
        <FormControlLabel
          onChange={(e) => setShowBack(e.target.checked)}
          control={<Switch />}
          label="Show back view"
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "nowrap",
          alignItems: "start",
          gap: "1.5rem",
        }}
      >
        <div
          style={{ position: "sticky", top: "1.5rem" }}
          className={["grid", showBack ? "reverse" : ""].join(" ")}
        >
          {grid.map((item, idx) => (
            <Box
              sx={{
                border:
                  idx === selectedCell
                    ? "4px solid #f73378"
                    : "1px solid #eaeaea",
                zIndex: idx === selectedCell ? 100 : 1,
              }}
              className="grid-item"
              onClick={() => gridItemSelect(idx)}
            >
              {grid[idx] && (
                <>
                  {!showBack && (
                    <img src={grid[idx]?.img} alt={grid[idx]?.name} />
                  )}
                  {showBack && <p>{grid[idx].name}</p>}
                </>
              )}
              {!grid[idx] && <>{idx + 1}</>}
            </Box>
          ))}
        </div>
        <div className="palettes">
          {palettes.map((palette, idx) => (
            <img
              style={{
                border:
                  selectedImg?.name === palette.name
                    ? "4px solid #f73378"
                    : "none",
                zIndex: selectedImg?.name === palette.name ? 100 : 1,
              }}
              src={palette.img}
              alt={palette.name}
              key={palette.name}
              onClick={() => imgSelect(palette)}
            />
          ))}
        </div>
      </Box>
    </Container>
  );
};
