"use client"
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Button } from "@/shared/ui/components/button";
import { useRouter } from "next/navigation";
import { DataTableDemo } from "@/features/actions/productsTable/table";
import { Products } from "@prisma/client";
import { Toaster } from '@/shared/ui/components/sonner';

interface TableProdutctPageProps {
products: Products[] 
}

export default function TableProdutctPage({products}: TableProdutctPageProps) {
    const router = useRouter()
  return (
    <>
        <div className="flex w-full items-center gap-4">
          <div className="flex-1" />
          <Toaster richColors position="top-right" />
          <div className="flex-1 flex justify-center">
            <h5 className="text-muted-foreground text-xl text-center">
              Produtos
            </h5>
          </div>
          <div className="flex-1 flex items-center justify-end space-x-4">
            <h1>Adicionar Produtos</h1>
            <Button
              type="submit"
              variant="outline"
              className="bg-transparent rounded-full w-12 h-12 p-0 flex items-center justify-center"
              onClick={() => {
                router.push("/dashboard/enterprise?table=products");
              }}
            >
            <AddCircleOutlineIcon />
            </Button>
          </div>
        </div>
      <div>
        <DataTableDemo products={products}/>
      </div>
    </>
  );
}