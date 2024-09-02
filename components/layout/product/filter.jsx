"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { FilterIcon, ChevronDown, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const FilterSection = ({ title, children, badge = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
      <div className="flex items-center justify-between">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="flex w-full justify-between p-0">
            <span>{title}</span>
            {badge && <Badge variant="secondary">{badge}</Badge>}
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2">{children}</CollapsibleContent>
    </Collapsible>
  );
};

const Filter = ({
  products,
  selectedFilters,
  handleFilterChange,
  clearAllFilters,
  filters,
}) => {
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  const filterOptions = useMemo(() => {
    const options = products.reduce(
      (acc, product) => {
        acc.categories.add(product.name.split(" ")[0]);
        product.colors.forEach((color) => acc.colors.add(color));
        product.sizes.forEach((size) => acc.sizes.add(size));
        acc.minPrice = Math.min(acc.minPrice, parseFloat(product.price));
        acc.maxPrice = Math.max(acc.maxPrice, parseFloat(product.price));
        return acc;
      },
      {
        categories: new Set(),
        colors: new Set(),
        sizes: new Set(),
        minPrice: Infinity,
        maxPrice: -Infinity,
      }
    );

    return {
      categories: Array.from(options.categories),
      colors: Array.from(options.colors),
      sizes: Array.from(options.sizes),
      minPrice: Math.floor(options.minPrice),
      maxPrice: Math.ceil(options.maxPrice),
    };
  }, [products]);

  const parentRef = React.useRef();

  const rowVirtualizer = useVirtualizer({
    count: filterOptions.categories.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 5,
  });

  const activeFiltersCount =
    selectedFilters.category.length +
    selectedFilters.color.length +
    selectedFilters.size.length +
    (selectedFilters.price.min !== filterOptions.minPrice ||
    selectedFilters.price.max !== filterOptions.maxPrice
      ? 1
      : 0);

  return (
    <div className="w-full">
      <Button
        variant="outline"
        className="w-full md:w-auto mb-4"
        onClick={() => setIsFiltersVisible(!isFiltersVisible)}>
        <FilterIcon className="mr-2 h-4 w-4" />
        {filters}
        {activeFiltersCount > 0 && (
          <Badge variant="secondary" className="ml-2">
            {activeFiltersCount}
          </Badge>
        )}
      </Button>

      <AnimatePresence>
        {isFiltersVisible && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-background border rounded-md p-4 space-y-4">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <FilterSection
                title="Catégorie"
                badge={selectedFilters.category.length || null}>
                <div ref={parentRef} className="h-[200px] overflow-auto">
                  <div
                    style={{
                      height: `${rowVirtualizer.getTotalSize()}px`,
                      width: "100%",
                      position: "relative",
                    }}>
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => (
                      <div
                        key={virtualRow.index}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: `${virtualRow.size}px`,
                          transform: `translateY(${virtualRow.start}px)`,
                        }}>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${
                              filterOptions.categories[virtualRow.index]
                            }`}
                            checked={selectedFilters.category.includes(
                              filterOptions.categories[virtualRow.index]
                            )}
                            onCheckedChange={(checked) =>
                              handleFilterChange(
                                "category",
                                filterOptions.categories[virtualRow.index],
                                checked
                              )
                            }
                          />
                          <Label
                            htmlFor={`category-${
                              filterOptions.categories[virtualRow.index]
                            }`}>
                            {filterOptions.categories[virtualRow.index]}
                          </Label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </FilterSection>

              <FilterSection
                title="Couleur"
                badge={selectedFilters.color.length || null}>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.colors.map((color) => (
                    <Button
                      key={color}
                      variant="outline"
                      className={`w-8 h-8 rounded-full p-0 ${
                        selectedFilters.color.includes(color)
                          ? "ring-2 ring-offset-2 ring-primary"
                          : ""
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      onClick={() => handleFilterChange("color", color)}>
                      {selectedFilters.color.includes(color) && (
                        <X className="h-4 w-4 text-background" />
                      )}
                    </Button>
                  ))}
                </div>
              </FilterSection>

              <FilterSection
                title="Fourchette de prix (FCFA)"
                badge={
                  selectedFilters.price.min !== filterOptions.minPrice ||
                  selectedFilters.price.max !== filterOptions.maxPrice
                    ? "1"
                    : null
                }>
                <Slider
                  min={filterOptions.minPrice}
                  max={filterOptions.maxPrice}
                  step={500}
                  value={[selectedFilters.price.min, selectedFilters.price.max]}
                  onValueChange={(value) =>
                    handleFilterChange("price", {
                      min: value[0],
                      max: value[1],
                    })
                  }
                />
                <div className="flex justify-between mt-2 text-sm">
                  <span>{selectedFilters.price.min.toLocaleString()} FCFA</span>
                  <span>{selectedFilters.price.max.toLocaleString()} FCFA</span>
                </div>
              </FilterSection>

              <FilterSection
                title="Taille"
                badge={selectedFilters.size.length || null}>
                <div className="grid grid-cols-3 gap-2">
                  {filterOptions.sizes.map((size) => (
                    <div key={size} className="flex items-center space-x-2">
                      <Checkbox
                        id={`size-${size}`}
                        checked={selectedFilters.size.includes(size)}
                        onCheckedChange={(checked) =>
                          handleFilterChange("size", size, checked)
                        }
                      />
                      <Label htmlFor={`size-${size}`}>{size}</Label>
                    </div>
                  ))}
                </div>
              </FilterSection>
            </ScrollArea>

            <Separator className="my-4" />
            <Button
              onClick={() => {
                clearAllFilters();
                setIsFiltersVisible(false);
              }}
              variant="outline"
              className="w-full">
              Effacer tous les filtres
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Filter;
