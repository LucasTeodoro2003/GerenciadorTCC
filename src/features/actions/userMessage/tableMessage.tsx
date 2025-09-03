"use client";

import { Checkbox } from "@/shared/ui/components/checkbox";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/components/table";
import { useState } from "react";
import { toast } from "sonner";

export function TableMessage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const invoices = [
    {
      id: "1",
      invoice: "Lucas Teodoro de Melo",
      paymentStatus: "34998795116",
      totalAmount: "Pacote Ouro",
      paymentMethod: "Credit Card",
      photo: "usuario.png",
      plate: "HHD1A51",
      typeCar: "HB20 Cor Laranja-Metalico",
    },
    {
      id: "2",
      invoice: "INV002",
      paymentStatus: "Pending",
      totalAmount: "$150.00",
      paymentMethod: "PayPal",
    },
    {
      id: "3",
      invoice: "INV003",
      paymentStatus: "Unpaid",
      totalAmount: "$350.00",
      paymentMethod: "Bank Transfer",
    },
    {
      id: "4",
      invoice: "INV004",
      paymentStatus: "Paid",
      totalAmount: "$450.00",
      paymentMethod: "Credit Card",
    },
    {
      id: "5",
      invoice: "INV005",
      paymentStatus: "Paid",
      totalAmount: "$550.00",
      paymentMethod: "PayPal",
    },
    {
      id: "6",
      invoice: "INV006",
      paymentStatus: "Pending",
      totalAmount: "$200.00",
      paymentMethod: "Bank Transfer",
    },
    {
      id: "7",
      invoice: "INV007",
      paymentStatus: "Unpaid",
      totalAmount: "$300.00",
      paymentMethod: "Credit Card",
    },
  ];

  const formatPhoneNumber = (phoneNumber: any) => {
    if (!phoneNumber || typeof phoneNumber !== "string") return phoneNumber;
    const cleaned = phoneNumber.replace(/\D/g, "");
    if (cleaned.length !== 11) return phoneNumber;
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(
      2,
      3
    )} ${cleaned.substring(3, 7)}-${cleaned.substring(7, 11)}`;
  };

  const formatPlateCar = (plate: any) => {
    if (!plate || typeof plate !== "string") return plate;
    if (plate.length !== 7) return plate;
    return `${plate.substring(0, 3)} - ${plate.substring(3, 7)}`;
  };

  const handleCheckboxChange = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => {
        const newSelected = [...prev, id];
        console.log(newSelected);
        toast.warning(newSelected.toString());
        return newSelected;
      });
    } else {
      setSelectedIds((prev) => {
        const newSelected = prev.filter((item) => item !== id);
        console.log(newSelected);
        toast.warning(newSelected.toString());
        return newSelected;
      });
    }
  };

  return (
    <Table>
      {/* <TableCaption>Ultimos Serviços dos Usuários</TableCaption> */}
      <TableHeader>
        <TableRow>
          <TableHead className="w-20">Foto</TableHead>
          <TableHead className="w-36">Nome</TableHead>
          <TableHead className="w-28">Número</TableHead>
          <TableHead className="w-20">Placa</TableHead>
          <TableHead className="w-40">Veículo</TableHead>
          <TableHead>Serviço Realizado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell>
              {" "}
              <div
                className="relative cursor-pointer"
                onClick={() =>
                  handleCheckboxChange(
                    invoice.id,
                    !selectedIds.includes(invoice.id)
                  )
                }
              >
                <div className="relative rounded-full overflow-hidden w-12 h-12 hover:bg-blue-500 hover:border-2 hover:border-blue-500">
                  <img
                    src={invoice.photo || "usuario.png"}
                    alt={invoice.invoice}
                    className="w-full h-full object-cover"
                  />
                  {selectedIds.includes(invoice.id) && (
                    <div className="absolute inset-0 rounded-full bg-blue-500 bg-opacity-40 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </TableCell>
            <TableCell className="font-medium">
              {invoice.invoice.split(" ").slice(0, 2).join(" ")}
            </TableCell>
            <TableCell>{formatPhoneNumber(invoice.paymentStatus)}</TableCell>
            <TableCell>{formatPlateCar(invoice.plate)}</TableCell>
            <TableCell>{invoice.typeCar}</TableCell>
            <TableCell>{invoice.totalAmount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={5}>Total de Serviços</TableCell>
          <TableCell className="w-56">
            {invoices.filter((e) => e.totalAmount).length}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
