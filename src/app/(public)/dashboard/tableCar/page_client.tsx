"use client"
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Button } from "@/shared/ui/components/button";
import { useRouter } from "next/navigation";
import { Vehicle} from "@prisma/client";
import { Toaster } from 'sonner';
import { DataTableDemoCar } from '@/features/actions/carTable/table';

interface TableCarPageProps {
  vehicles: Vehicle[]
}

export default function TableCarPage({vehicles}: TableCarPageProps) {
    const router = useRouter()
  return (
    <>
        <div className="flex w-full items-center gap-4">
          <div className="flex-1" />
          <div className="flex-1 flex justify-center">
            <Toaster richColors position="top-center" />
            <h5 className="text-muted-foreground text-xl text-center">
              Veículos Cadastrados
            </h5>
          </div>
          <div className="flex-1 flex items-center justify-end space-x-4">
            <h1>Adicionar Veículo</h1>
            <Button
              type="submit"
              variant="outline"
              className="bg-transparent rounded-full w-12 h-12 p-0 flex items-center justify-center"
              onClick={() => {
                router.push("/dashboard/clients?table=vehicles");
              }}
            >
            <AddCircleOutlineIcon />
            </Button>
          </div>
        </div>
      <div>
        <DataTableDemoCar vehicles={vehicles}/>
      </div>
    </>
  );
}