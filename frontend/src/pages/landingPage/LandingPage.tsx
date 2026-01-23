// src/pages/LandingPage.tsx
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import ProductSection from "../../modules/ProductSection";
import { useEffect, useMemo, useState } from "react";
import { fetchActiveProducts } from "../../features/product/productSlice";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "../../hooks/useDebounce";
import {
  Box,
  Container,
  Typography,
  Stack,
  CircularProgress,
  Pagination,
} from "@mui/material";

const ITEMS_PER_PAGE = 12;

const LandingPage = () => {
  const { products, loading } = useAppSelector((state) => state.products);
  const dispatch = useAppDispatch();

  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);

  /* ---------- READ QUERY PARAMS ---------- */
  const rawSearch = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const minPrice = Number(searchParams.get("minPrice") || 0);
  const maxPrice = Number(searchParams.get("maxPrice") || Infinity);

  const debouncedSearch = useDebounce(rawSearch, 500);

  /* ---------- FETCH PRODUCTS (ONCE) ---------- */
  useEffect(() => {
    dispatch(fetchActiveProducts());
  }, [dispatch]);

  /* ---------- RESET PAGE ON FILTER CHANGE ---------- */
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, category, minPrice, maxPrice]);

  /* ---------- FRONTEND SEARCH + FILTER ---------- */
  const filteredProducts = useMemo(() => {
    return products.filter((product: any) => {
      const matchesSearch = debouncedSearch
        ? product.name.toLowerCase().includes(debouncedSearch.toLowerCase())
        : true;

      const matchesCategory = category
        ? product.category === category
        : true;

      const matchesPrice =
        product.price >= minPrice && product.price <= maxPrice;

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [products, debouncedSearch, category, minPrice, maxPrice]);

  /* ---------- PAGINATION ---------- */
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  /* ---------- PAGE CHANGE ---------- */
  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    setSearchParams(params);
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <ProductSection title="Recommended Products" products={paginatedProducts} />

      {/* Pagination */}
      {totalPages > 1 && (
        <Stack alignItems="center" mt={4} spacing={2}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
          <Typography variant="body2" color="text.secondary">
            Showing {paginatedProducts.length} of {totalProducts} products
          </Typography>
        </Stack>
      )}
    </Container>
  );
};

export default LandingPage;
