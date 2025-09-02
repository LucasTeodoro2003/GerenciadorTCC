"use client"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/components/table"
import { id } from "date-fns/locale";


export function TableMessage() {

    
const invoices = [
  {
    id: "1",
    invoice: "Lucas Teodoro de Melo",
    paymentStatus: "34998795116",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
    photo: "usuario.png",
    plate: "HHD1A51"
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
]



    const formatPhoneNumber = (phoneNumber:any) => {
    if (!phoneNumber || typeof phoneNumber !== 'string') return phoneNumber;
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length !== 11) return phoneNumber;
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 3)} ${cleaned.substring(3, 7)}-${cleaned.substring(7, 11)}`;
  };

    const formatPlateCar = (plate:any) => {
    if (!plate || typeof plate !== 'string') return plate;
    if (plate.length !== 7) return plate;
    return `${plate.substring(0, 3)} - ${plate.substring(3, 7)}`;
  };

  return (
    <Table>
      <TableCaption>Ultimos Serviços dos Usuários</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-20">Foto</TableHead>
          <TableHead className="w-36">Nome</TableHead>
          <TableHead className="w-56">Número</TableHead>
          <TableHead>Placa</TableHead>
          <TableHead>Veículo</TableHead>
          <TableHead className="text-right">Serviço</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell ><img src={invoice.photo || "usuario.png"} alt={invoice.invoice} className="w-12"/></TableCell>
            <TableCell className="font-medium">{invoice.invoice.split(" ")[0] + " " + invoice.invoice.split(" ")[1]}</TableCell>
            <TableCell>{formatPhoneNumber(invoice.paymentStatus)}</TableCell>
            <TableCell>{formatPlateCar(invoice.plate)}</TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            <TableCell className="text-right">{invoice.totalAmount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}
