"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./cell-action";

export type ColorColumn = {
  id: string;
  name: string;
  value: string;
  createdAt: string;
};

export const columns: ColumnDef<ColorColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => {
      const colorValues = row.original.value.split(',').map(color => color.trim());
      
      return (
        <div className="flex items-center gap-x-2">
          <span className="text-sm text-muted-foreground">
            {colorValues.length > 1 ? `${colorValues.length} colors` : '1 color'}
          </span>
          <div className="flex items-center gap-x-1">
            {colorValues.map((color, index) => (
              <div
                key={index}
                className="h-6 w-6 rounded-full border shadow-sm"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
