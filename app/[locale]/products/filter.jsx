import React, { useMemo } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FilterIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const Filter = ({
  products,
  selectedFilters,
  handleFilterChange,
  clearAllFilters,
  filters,
}) => {
  const filterOptions = useMemo(() => {
    const options = {
      categories: new Set(),
      colors: new Set(),
      sizes: new Set(),
      minPrice: Infinity,
      maxPrice: -Infinity,
    };

    products.forEach((product) => {
      options.categories.add(product.name.split(" ")[0]); // Assuming first word is category
      product.colors.forEach((color) => options.colors.add(color));
      product.sizes.forEach((size) => options.sizes.add(size));
      options.minPrice = Math.min(options.minPrice, parseFloat(product.price));
      options.maxPrice = Math.max(options.maxPrice, parseFloat(product.price));
    });

    return {
      categories: Array.from(options.categories),
      colors: Array.from(options.colors),
      sizes: Array.from(options.sizes),
      minPrice: Math.floor(options.minPrice),
      maxPrice: Math.ceil(options.maxPrice),
    };
  }, [products]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full md:w-auto">
          <FilterIcon className="mr-2 h-4 w-4" /> {filters}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Catégorie</h3>
              {filterOptions.categories.map((category) => (
                <div
                  key={category}
                  className="flex items-center space-x-2 mb-1">
                  <Checkbox
                    id={`category-${category}`}
                    checked={selectedFilters.category.includes(category)}
                    onCheckedChange={(checked) =>
                      handleFilterChange("category", category, checked)
                    }
                  />
                  <Label htmlFor={`category-${category}`}>{category}</Label>
                </div>
              ))}
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">Couleur</h3>
              <div className="flex flex-wrap gap-2">
                {filterOptions.colors.map((color) => (
                  <Button
                    key={color}
                    variant="outline"
                    className={`w-8 h-8 rounded-full p-0 ${
                      selectedFilters.color.includes(color)
                        ? "ring-2 ring-offset-2 ring-black"
                        : ""
                    }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                    onClick={() => handleFilterChange("color", color)}
                  />
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">Fourchette de prix (FCFA)</h3>
              <Slider
                min={filterOptions.minPrice}
                max={filterOptions.maxPrice}
                step={500}
                value={[selectedFilters.price.min, selectedFilters.price.max]}
                onValueChange={(value) =>
                  handleFilterChange("price", { min: value[0], max: value[1] })
                }
              />
              <div className="flex justify-between mt-2 text-sm">
                <span>{selectedFilters.price.min.toLocaleString()} FCFA</span>
                <span>{selectedFilters.price.max.toLocaleString()} FCFA</span>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">Taille</h3>
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
            </div>
          </div>
        </ScrollArea>
        <Separator className="my-4" />
        <Button onClick={clearAllFilters} variant="outline" className="w-full">
          Effacer tous les filtres
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default Filter;
