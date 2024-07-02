import { motion, AnimatePresence } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

const ColorSwatch = ({ color, selected, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    style={{
      width: 20,
      height: 20,
      borderRadius: "50%",
      backgroundColor: color,
      border: selected ? "2px solid black" : "1px solid #ccc",
      cursor: "pointer",
    }}
  />
);

const SizeButton = ({ size, selected, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    style={{
      padding: "4px 8px",
      border: selected ? "2px solid black" : "1px solid #ccc",
      borderRadius: 4,
      backgroundColor: selected ? "black" : "white",
      color: selected ? "white" : "black",
      cursor: "pointer",
      fontSize: "0.75rem",
    }}>
    {size}
  </motion.button>
);

export default function Filter({
  selectedFilters,
  handleFilterChange,
  clearAllFilters,
}) {
  return (
    <div className="bg-background rounded-lg z-20  p-3 sm:p-4 sticky top-4 w-full max-w-xs sm:max-w-sm md:max-w-md">
      <h2 className="text-xl font-bold mb-3">Filters</h2>
      <Accordion type="single" collapsible className="space-y-2">
        <AccordionItem value="category">
          <AccordionTrigger className="text-base font-semibold">
            Category
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-2">
              {["Dresses", "Tops", "Bottoms", "Shoes", "Accessories"].map(
                (category) => (
                  <Label
                    key={category}
                    className="flex items-center gap-2 font-normal text-sm">
                    <Checkbox
                      checked={selectedFilters.category.includes(category)}
                      onCheckedChange={() =>
                        handleFilterChange("category", category)
                      }
                    />
                    {category}
                  </Label>
                )
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger className="text-base font-semibold">
            Price
          </AccordionTrigger>
          <AccordionContent>
            <Slider
              min={0}
              max={500}
              step={10}
              value={[selectedFilters.price.min, selectedFilters.price.max]}
              onValueChange={(value) =>
                handleFilterChange("price", { min: value[0], max: value[1] })
              }
            />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>${selectedFilters.price.min}</span>
              <span>${selectedFilters.price.max}</span>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="color">
          <AccordionTrigger className="text-base font-semibold">
            Color
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-6 gap-2">
              {["white", "black", "blue", "pink", "olive", "brown"].map(
                (color) => (
                  <ColorSwatch
                    key={color}
                    color={color}
                    selected={selectedFilters.color.includes(color)}
                    onClick={() => handleFilterChange("color", color)}
                  />
                )
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="size">
          <AccordionTrigger className="text-base font-semibold">
            Size
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-3 gap-2">
              {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                <SizeButton
                  key={size}
                  size={size}
                  selected={selectedFilters.size.includes(size)}
                  onClick={() => handleFilterChange("size", size)}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="bg-muted rounded-lg p-3 mt-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-base font-semibold">Selected Filters</h3>
          <Button variant="outline" size="sm" onClick={clearAllFilters}>
            Clear All
          </Button>
        </div>
        <AnimatePresence>
          <motion.div className="flex flex-wrap gap-1">
            {[
              ...selectedFilters.category,
              ...selectedFilters.color,
              ...selectedFilters.size,
            ].map((filter) => (
              <Badge
                key={filter}
                variant="outline"
                className="cursor-pointer text-xs"
                onClick={() =>
                  handleFilterChange(
                    selectedFilters.category.includes(filter)
                      ? "category"
                      : selectedFilters.color.includes(filter)
                      ? "color"
                      : "size",
                    filter
                  )
                }>
                {filter}
              </Badge>
            ))}
            {(selectedFilters.price.min > 0 ||
              selectedFilters.price.max < 500) && (
              <Badge
                variant="outline"
                className="cursor-pointer text-xs"
                onClick={() =>
                  handleFilterChange("price", { min: 0, max: 500 })
                }>
                ${selectedFilters.price.min} - ${selectedFilters.price.max}
              </Badge>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
