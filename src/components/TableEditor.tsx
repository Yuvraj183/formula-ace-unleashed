import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash, X } from "lucide-react";
import { TableData } from "@/lib/data";

interface TableEditorProps {
  table: TableData | undefined;
  onChange: (table: TableData | undefined) => void;
}

const TableEditor = ({ table, onChange }: TableEditorProps) => {
  const [showTable, setShowTable] = useState(!!table);

  const initTable = () => {
    onChange({
      headers: ["Column 1", "Column 2"],
      rows: [["", ""]]
    });
    setShowTable(true);
  };

  const removeTable = () => {
    onChange(undefined);
    setShowTable(false);
  };

  const addColumn = () => {
    if (!table) return;
    onChange({
      headers: [...table.headers, `Column ${table.headers.length + 1}`],
      rows: table.rows.map(row => [...row, ""])
    });
  };

  const addRow = () => {
    if (!table) return;
    onChange({
      ...table,
      rows: [...table.rows, new Array(table.headers.length).fill("")]
    });
  };

  const removeColumn = (index: number) => {
    if (!table || table.headers.length <= 1) return;
    onChange({
      headers: table.headers.filter((_, i) => i !== index),
      rows: table.rows.map(row => row.filter((_, i) => i !== index))
    });
  };

  const removeRow = (index: number) => {
    if (!table || table.rows.length <= 1) return;
    onChange({
      ...table,
      rows: table.rows.filter((_, i) => i !== index)
    });
  };

  const updateHeader = (index: number, value: string) => {
    if (!table) return;
    const newHeaders = [...table.headers];
    newHeaders[index] = value;
    onChange({ ...table, headers: newHeaders });
  };

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    if (!table) return;
    const newRows = table.rows.map((row, ri) =>
      ri === rowIndex ? row.map((cell, ci) => (ci === colIndex ? value : cell)) : row
    );
    onChange({ ...table, rows: newRows });
  };

  if (!showTable) {
    return (
      <Button variant="outline" size="sm" onClick={initTable} className="w-full">
        <Plus className="h-4 w-4 mr-2" /> Add Table
      </Button>
    );
  }

  if (!table) return null;

  return (
    <div className="space-y-3 border rounded-lg p-3 bg-muted/30">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Table Data</span>
        <Button variant="ghost" size="sm" onClick={removeTable} className="h-7 text-destructive">
          <X className="h-4 w-4 mr-1" /> Remove Table
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              {table.headers.map((header, i) => (
                <th key={i} className="p-1">
                  <div className="flex gap-1">
                    <Input
                      value={header}
                      onChange={(e) => updateHeader(i, e.target.value)}
                      className="h-8 text-xs font-semibold"
                      placeholder="Header"
                    />
                    {table.headers.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeColumn(i)}
                        className="h-8 w-8 p-0 text-destructive shrink-0"
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </th>
              ))}
              <th className="p-1 w-8"></th>
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td key={colIndex} className="p-1">
                    <Input
                      value={cell}
                      onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                      className="h-8 text-xs"
                      placeholder="Value"
                    />
                  </td>
                ))}
                <td className="p-1">
                  {table.rows.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRow(rowIndex)}
                      className="h-8 w-8 p-0 text-destructive"
                    >
                      <Trash className="h-3 w-3" />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={addColumn} className="text-xs">
          <Plus className="h-3 w-3 mr-1" /> Column
        </Button>
        <Button variant="outline" size="sm" onClick={addRow} className="text-xs">
          <Plus className="h-3 w-3 mr-1" /> Row
        </Button>
      </div>
    </div>
  );
};

export default TableEditor;