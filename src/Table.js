import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { supabase } from './utils/supabase.js'
import { useState, useEffect } from "react";
export default function SimpleTable() {
    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase
                .from('databoard')
                .select('*');
            if (error) {
                alert("Error fetching data:", error);
                return;
            }
            setData(data.map((item, index) => ({
                sno: index + 1,
                category: item.category,
                link: item.link,
                paid: item.pricing,
                numImages: item.nimages,
                au: item.au,
                uploadedBy: item.uploadedby,
                timeOfUpload: new Date(item.uploadedtime).toLocaleString(),
                notes: item.notes,
            })));
        };
        fetchData();
    }, []);

  const columns = useMemo(
    () => [
      { accessorKey: "sno", header: "SNO" },
      { accessorKey: "category", header: "Category" },
      {
        accessorKey: "link",
        header: "Link",
        cell: (info) => (
          <a href={info.getValue()} target="_blank" rel="noreferrer">
            {info.getValue()}
          </a>
        ),
      },
      { accessorKey: "paid", header: "Paid/Free" },
      { accessorKey: "numImages", header: "NumImages" },
      { accessorKey: "au", header: "A/U" },
      { accessorKey: "uploadedBy", header: "uploadedBy" },
      { accessorKey: "timeOfUpload", header: "timeOfUpload" },
      { accessorKey: "notes", header: "Notes" },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div style={{ padding: "20px", marginTop: "5vh" }}>
      <table
        style={{
          borderCollapse: "collapse",
          width: "100%",
          backgroundColor: "whitesmoke",
          color: "black",
          border: "1px solid black",
        }}
      >
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  style={{
                    border: "1px solid black",
                    padding: "8px",
                    textAlign: "left",
                  }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {data.length!==0 ? table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  style={{
                    border: "1px solid black",
                    padding: "8px",
                  }}
                >
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </td>
              ))}
            </tr>
          ))
          : 
          <div>No Links are saved so far...</div>
          }
        </tbody>
      </table>
    </div>
  );
}