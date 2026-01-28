import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  IconButton,
  Stack,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { createProductApi, updateProductApi } from "../api/product.api";
import type { Product } from "../types/Products";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  type: "add" | "edit";
  product: Product | null;
}

interface Errors {
  name?: string;
  price?: string;
  stock?: string;
  images?: string;
}

const MAX_IMAGES = 5;

const ProductModal = ({ isOpen, onClose, type, product }: Props) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    discount: "",
    category: "",
    stock: "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  /* =====================
     Prefill edit mode
  ===================== */
  useEffect(() => {
    if (type === "edit" && product) {
      setForm({
        name: product.name,
        description: product.description,
        price: String(product.price),
        discount: String(product.discount || 0),
        category: product.category,
        stock: String(product.stock),
      });
    } else {
      setForm({
        name: "",
        description: "",
        price: "",
        discount: "",
        category: "",
        stock: "",
      });
      setImages([]);
      setErrors({});
    }
  }, [type, product, isOpen]);

  /* =====================
     Image Handlers
  ===================== */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);

    if (images.length + selectedFiles.length > MAX_IMAGES) {
      setErrors((prev) => ({
        ...prev,
        images: `You can upload maximum ${MAX_IMAGES} images`,
      }));
      return;
    }

    setImages((prev) => [...prev, ...selectedFiles]);
    setErrors((prev) => ({ ...prev, images: undefined }));
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  /* =====================
     Validation
  ===================== */
  const validate = () => {
    const e: Errors = {};

    if (!form.name.trim()) e.name = "Product name is required";
    if (!form.price || Number(form.price) <= 0)
      e.price = "Price must be greater than 0";
    if (!form.stock || Number(form.stock) < 0)
      e.stock = "Stock must be 0 or more";
    if (type === "add" && images.length === 0)
      e.images = "At least one image is required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* =====================
     Submit
  ===================== */
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      const fd = new FormData();

      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      images.forEach((img) => fd.append("images", img));

      if (type === "add") {
        await createProductApi(fd);
      } else if (product) {
        await updateProductApi(product._id, fd);
      }

      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* =====================
     UI
  ===================== */
  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {type === "add" ? "Add Product" : "Edit Product"}
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2}>
          <TextField
            label="Product Name *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
          />

          <TextField
            label="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            fullWidth
          />

          <TextField
            label="Stock *"
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            error={!!errors.stock}
            helperText={errors.stock}
            fullWidth
          />

          <TextField
            label="Price *"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            error={!!errors.price}
            helperText={errors.price}
            fullWidth
          />

          <TextField
            label="Discount (%)"
            type="number"
            value={form.discount}
            onChange={(e) => setForm({ ...form, discount: e.target.value })}
            fullWidth
          />

          <TextField
            label="Description"
            multiline
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            fullWidth
          />

          {/* Image Upload */}
          <Box>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ justifyContent: "flex-start" }}
            >
              Upload Images (Max {MAX_IMAGES})
              <input
                type="file"
                multiple
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </Button>
            {errors.images && (
              <Typography variant="caption" color="error">
                {errors.images}
              </Typography>
            )}

            {/* Preview */}
            {images.length > 0 && (
              <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
                {images.map((img, i) => (
                  <Box key={i} position="relative">
                    <img
                      src={URL.createObjectURL(img)}
                      alt="preview"
                      style={{
                        width: 80,
                        height: 80,
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: -6,
                        right: -6,
                        bgcolor: "error.main",
                        color: "white",
                        "&:hover": { bgcolor: "error.dark" },
                      }}
                      onClick={() => removeImage(i)}
                    >
                      ✕
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined" fullWidth>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          fullWidth
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          Save Product
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductModal;
