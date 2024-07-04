import React, { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { FilterIcon, X } from "lucide-react";

const Filter = ({ selectedFilters, handleFilterChange, clearAllFilters }) => {
  const [isOpen, setIsOpen] = useState(false);

  const categories = ["Dresses", "Tops", "Bottoms", "Shoes", "Accessories"];
  const colors = ["white", "black", "blue", "pink", "olive", "brown"];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  // Adjust price range for FCFA
  const minPrice = 0;
  const maxPrice = 100000; // Adjust based on your product range

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full md:w-auto">
          <FilterIcon className="mr-2 h-4 w-4" /> Filtres
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Catégorie</h3>
            <select
              className="w-full p-2 border rounded"
              onChange={(e) => handleFilterChange("category", e.target.value)}
              value={selectedFilters.category}>
              <option value="">Toutes les catégories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Couleur</h3>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  className={`w-6 h-6 rounded-full ${
                    selectedFilters.color.includes(color)
                      ? "ring-2 ring-offset-2 ring-black"
                      : ""
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleFilterChange("color", color)}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Fourchette de prix (FCFA)</h3>
            <Slider
              min={minPrice}
              max={maxPrice}
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

          <div>
            <h3 className="font-semibold mb-2">Taille</h3>
            <div className="grid grid-cols-3 gap-2">
              {sizes.map((size) => (
                <label key={size} className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedFilters.size.includes(size)}
                    onCheckedChange={() => handleFilterChange("size", size)}
                  />
                  <span>{size}</span>
                </label>
              ))}
            </div>
          </div>

          <Button
            onClick={clearAllFilters}
            variant="outline"
            className="w-full">
            Effacer tous les filtres
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Filter;
