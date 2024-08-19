import React from "react";
import { List, AutoSizer } from "react-virtualized";
import { Select, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select"; // shadcn-ui components

const VirtualizedSelect = ({ options, value, onChange, placeholder }) => {
  const rowRenderer = ({ index, key, style }) => (
    <div
      key={key}
      style={style}
      onClick={() => onChange(options[index].name)}
      className="cursor-pointer p-2 hover:bg-gray-100"
    >
      {options[index].name}
    </div>
  );

  return (
    <Select>
      <SelectTrigger className="border-primary">
        <SelectValue>{value || placeholder}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <AutoSizer disableHeight>
          {({ width }) => (
            <List
              width={width}
              height={200}
              rowHeight={40}
              rowCount={options.length}
              rowRenderer={rowRenderer}
              style={{ outline: "none" }} // Remove focus outline from List
            />
          )}
        </AutoSizer>
      </SelectContent>
    </Select>
  );
};

export default VirtualizedSelect;
