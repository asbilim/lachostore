import React from "react";
import {
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Breadcrumb,
} from "../ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function BreadcrumbComponent({ items }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items?.map((item, index) => (
          <>
            <BreadcrumbItem key={index}>
              {item.type === "link" && (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              )}
              {item.type === "text" && (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
              {item.type === "dropdown" && (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1">
                    <BreadcrumbEllipsis className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {item.options.map((option, idx) => (
                      <DropdownMenuItem key={idx}>{option}</DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </BreadcrumbItem>
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default Breadcrumb;
