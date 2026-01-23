import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from "@mui/material/Button";
import Box from '@mui/material/Box';

interface FilterProps {
  category: string;
  minPrice: string;
  maxPrice: string;
  categoryOptions: string[];
  onChange: (key: string, value: string) => void;
  onApply: () => void;
  onClear: () => void;
  onClose: () => void;
}

const ProductFilter = ({
  category,
  minPrice,
  maxPrice,
  categoryOptions,
  onChange,
  onApply,
  onClear,
  onClose,
}: FilterProps) => {
  const filterRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close on outside click (desktop only)
  useEffect(() => {
    if (!isMobile) {
      const handleOutsideClick = (e: MouseEvent) => {
        if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
          onClose();
        }
      };

      document.addEventListener("mousedown", handleOutsideClick);
      return () => document.removeEventListener("mousedown", handleOutsideClick);
    }
  }, [onClose, isMobile]);

  // Render portal so it's never clipped
  return createPortal(
    <Box
      ref={filterRef}
      className={`z-50 ${isMobile
        ? "fixed inset-0 bg-white overflow-auto p-5" // Full screen modal for mobile
        : "fixed top-20 left-1/2 -translate-x-1/2 w-[90%] max-w-[600px] bg-white border border-gray-300 rounded-2xl shadow-xl p-5"
        }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Category */}
        <div className={`${isMobile ? "flex flex-col gap-4 overflow-visible" : ""}`}>
          {/* Category */}
          <div className="relative">
            <Autocomplete
              disablePortal
              options={categoryOptions}
              value={category || null}
              onChange={(_, newValue) =>
                onChange("category", newValue ?? "")
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Category"
                  placeholder="All"
                />
              )}
            />
          </div>
        </div>

        {/* Min Price */}
        <div>
          <TextField
            id="outlined-basic"
            type="number"
            label="Min Price"
            variant="outlined"
            value={minPrice}
            onChange={(e) => onChange("minPrice", e.target.value)}
            fullWidth
          />
        </div>

        {/* Max Price */}
        <div>
          <TextField
            id="outlined-basic"
            type="number"
            label="Min Price"
            variant="outlined"
            value={maxPrice}
            onChange={(e) => onChange("maxPrice", e.target.value)}
            fullWidth
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-5">
        <Button variant="outlined" onClick={onClear}>Clear</Button>
        <Button variant="contained" onClick={onApply}>Apply</Button>
      </div>
    </Box>,
    document.body
  );
};

export default ProductFilter;
