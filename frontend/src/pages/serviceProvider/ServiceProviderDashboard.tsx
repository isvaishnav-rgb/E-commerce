import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Add } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Fab,
} from "@mui/material";

import ProductModal from "../../modules/ProductModal";
import ProductImageCarousel from "../../components/ProductImageCarousel";
import { getMyProductsApi, deleteProductApi } from "../../api/product.api";
import type { Product } from "../../types/Products";

const ServiceProviderDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(
    null
  );
  const navigate = useNavigate();

  const fetchProducts = async () => {
    const data = await getMyProductsApi();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteProductApi(id);
    fetchProducts();
  };

  const handleNavigate = (productId: string) => {
    navigate(`/${productId}`);
  };

  return (
    <Box p={3}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h5" fontWeight={700}>
          My Products
        </Typography>

        <Fab
          color="primary"
          variant="extended"
          onClick={() => {
            setMode("add");
            setSelectedProduct(null);
            setOpen(true);
          }}
        >
          <Add sx={{ mr: 1 }} />
          Add Product
        </Fab>
      </Box>

      {/* Products */}
      <Box
        display="flex"
        flexWrap="wrap"
        gap={5}
        justifyContent={{ xs: "center", sm: "flex-start" }}
      >
        {products.map((product) => (
          <Card
            key={product._id}
            sx={{
              cursor: "pointer",
              "&:hover": { boxShadow: 6 },
              width: { xs: "100%", sm: 290, md: 260 },
              display: "flex",
              flexDirection: "column",
            }}
            onClick={() => handleNavigate(product._id)}
          >
            {/* Image Carousel */}
            <ProductImageCarousel images={product.images} />

            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {product.name}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                ₹{product.finalPrice || product.price}
              </Typography>
            </CardContent>

            <CardActions sx={{ gap: 1, p: 2 }}>
              <Button
                variant="outlined"
                size="small"
                fullWidth
                onClick={(e) => {
                  e.stopPropagation();
                  setMode("edit");
                  setSelectedProduct(product);
                  setOpen(true);
                }}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                fullWidth
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(product._id);
                }}
              >
                Delete
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      {/* Product Modal */}
      <ProductModal
        isOpen={open}
        onClose={() => {
          setOpen(false);
          fetchProducts();
        }}
        type={mode}
        product={selectedProduct}
      />
    </Box>
  );
};

export default ServiceProviderDashboard;
