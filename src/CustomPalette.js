import { palettes, colors } from "./palettes";
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
  TextField,
} from "@mui/material";

export const CustomPalette = () => {
  const [gridSize, setGridSize] = useState(16);
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedImg, setSelectedImg] = useState(null);
  const [grid, setGrid] = useState(Array.from({ length: gridSize }));
  const [showBack, setShowBack] = useState(false);
  const [filteredPalettes, setFilteredPalettes] = useState(palettes);
  const [search, setSearch] = useState("");
  const [filterColor, setFilterColor] = useState(null);

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

  useEffect(() => {
    if (search === "" && filterColor === null)
      return setFilteredPalettes(palettes);

    const matchedPalettes = palettes.filter((palette) => {
      // if (color === null)return palette.name.toLowerCase().includes(search.toLowerCase());
      if (!palette.colors) return false;
      return palette?.colors.includes(filterColor);
    });

    setFilteredPalettes(matchedPalettes);
  }, [search, filterColor]);

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
        <TextField
          label="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <FormControl sx={{ width: 150 }}>
          <InputLabel id="palette-size-label">Size</InputLabel>
          <Select
            labelId="palette-size-label"
            value={gridSize}
            label="Size"
            onChange={(e) => setGridSize(+e.target.value)}
          >
            <MenuItem value={16}>16</MenuItem>
            <MenuItem value={24}>24</MenuItem>
            <MenuItem value={36}>36</MenuItem>
          </Select>
        </FormControl>
        <FormControlLabel
          onChange={(e) => setShowBack(e.target.checked)}
          control={<Switch />}
          label="Show back view"
        />
        <Box>
          {colors.map((color) => (
            <Box
              onClick={() => setFilterColor(color)}
              sx={{
                height: 24,
                width: 24,
                borderRadius: "50%",
                backgroundColor: color.toLowerCase() ?? "transparent",
              }}
            />
          ))}
        </Box>
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
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: `repeat(${
              gridSize === 16 ? 4 : gridSize === 24 ? 8 : 9
            }, 1fr)`,
            overflow: "hidden",
            borderRadius: gridSize === 16 ? "150px" : 0,
            border: "2px solid black",
            width: "600px",
            flexShrink: 0,
            backdropFilter: "blur(15px)",
            backgroundColor: "#ffffff80",
          }}
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
        </Box>
        <div className="palettes">
          {filteredPalettes.map((palette, idx) => (
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
