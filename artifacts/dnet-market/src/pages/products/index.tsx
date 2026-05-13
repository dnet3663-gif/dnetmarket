import { useState } from "react";
import { useLocation } from "wouter";
import { Search, Star, ShoppingBag } from "lucide-react";
import { useListProducts, useListCategories, useAddToCart } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ProductsList() {
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "";

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("newest");

  const { data: categories, isLoading: isCategoriesLoading } = useListCategories();
  const { data: products, isLoading: isProductsLoading } = useListProducts({
    search: searchQuery,
    category: activeCategory,
  } as any); // using any for missing types

  const addToCart = useAddToCart();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (activeCategory) params.set("category", activeCategory);
    setLocation(`/products?${params.toString()}`);
  };

  const handleCategorySelect = (slug: string) => {
    const newCategory = activeCategory === slug ? "" : slug;
    setActiveCategory(newCategory);
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (newCategory) params.set("category", newCategory);
    setLocation(`/products?${params.toString()}`);
  };

  const handleAddToCart = (e: React.MouseEvent, productId: number) => {
    e.stopPropagation();
    addToCart.mutate(
      { data: { productId, quantity: 1 } },
      {
        onSuccess: () => {
          toast.success("Added to cart", {
            action: {
              label: "View Cart",
              onClick: () => setLocation('/cart')
            }
          });
        }
      }
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-4 space-y-6 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search premium products..." 
            className="w-full pl-10 bg-white/5 border-white/10 rounded-full h-12"
            data-testid="products-search-input"
          />
        </form>
        <div className="w-full md:w-48">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-12 rounded-full border-white/10 bg-white/5" data-testid="products-sort-select">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest Arrivals</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
        <Button
          variant="outline"
          className={cn("rounded-full border-white/10", activeCategory === "" ? "bg-primary text-primary-foreground border-primary" : "bg-white/5")}
          onClick={() => handleCategorySelect("")}
          data-testid="category-filter-all"
        >
          All
        </Button>
        {isCategoriesLoading ? (
          [1, 2, 3].map(i => <Skeleton key={i} className="w-24 h-10 rounded-full" />)
        ) : (
          categories?.map(cat => (
            <Button
              key={cat.id}
              variant="outline"
              className={cn("rounded-full border-white/10 whitespace-nowrap", activeCategory === cat.slug ? "bg-primary text-primary-foreground border-primary" : "bg-white/5")}
              onClick={() => handleCategorySelect(cat.slug)}
              data-testid={`category-filter-${cat.slug}`}
            >
              {cat.name}
            </Button>
          ))
        )}
      </div>

      {isProductsLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="space-y-3">
              <Skeleton className="w-full aspect-square rounded-2xl" />
              <Skeleton className="w-3/4 h-4" />
              <Skeleton className="w-1/2 h-4" />
            </div>
          ))}
        </div>
      ) : products && products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-24 md:pb-8">
          {products.map(product => (
            <Card
              key={product.id}
              onClick={() => setLocation(`/products/${product.id}`)}
              className="bg-card/60 backdrop-blur border-white/5 overflow-hidden cursor-pointer hover:border-primary/25 hover:shadow-[0_4px_24px_rgba(0,0,0,0.4)] transition-all duration-300 flex flex-col h-full group"
              data-testid={`product-card-${product.id}`}
            >
              <div className="aspect-square bg-white/5 relative overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                />
                {product.originalPrice && (
                  <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wide">
                    SALE
                  </div>
                )}
              </div>
              <div className="p-3 flex flex-col flex-1">
                <h4 className="text-sm font-medium line-clamp-2 mb-1 group-hover:text-primary/90 transition-colors">{product.name}</h4>
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-3 h-3 text-primary fill-primary flex-shrink-0" />
                  <span className="text-xs font-semibold">{product.rating?.toFixed(1) || "5.0"}</span>
                  <span className="text-xs text-muted-foreground ml-1 truncate">{product.vendorName}</span>
                </div>
                <div className="mt-auto flex items-end justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-primary">₦{product.price.toLocaleString()}</span>
                    {product.originalPrice && (
                      <span className="text-[11px] text-muted-foreground line-through">₦{product.originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-full bg-primary/15 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 hover:shadow-[0_0_12px_rgba(212,175,55,0.4)] flex-shrink-0"
                    onClick={(e) => handleAddToCart(e, product.id)}
                    disabled={addToCart.isPending}
                    data-testid={`add-to-cart-${product.id}`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
            <Search className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold mb-2">No products found</h3>
          <p className="text-muted-foreground max-w-md">We couldn't find any products matching your search. Try adjusting your filters or search terms.</p>
          <Button onClick={() => { setSearchQuery(""); setActiveCategory(""); setLocation('/products'); }} className="mt-6 rounded-full" variant="outline">
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
