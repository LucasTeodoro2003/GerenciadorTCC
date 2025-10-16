"use client"
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Button } from "@/shared/ui/components/button";
import { useRouter } from "next/navigation";
import { Services } from "@prisma/client";
import { DataTableDemoServices } from '@/features/actions/servicesTable/table';
import { Toaster } from 'sonner';

interface TableServicePageProps {
  services: Services[]
}

export default function TableServicePage({services}: TableServicePageProps) {
    const router = useRouter()
  return (
    <>
        <div className="flex w-full items-center gap-4">
          <div className="flex-1" />
          <div className="flex-1 flex justify-center">
            <Toaster richColors position="top-center" />
            <h5 className="text-muted-foreground text-xl text-center">
              Serviços
            </h5>
          </div>
          <div className="flex-1 flex items-center justify-end space-x-4">
            <Button
              type="submit"
              variant="outline"
              className="bg-transparent rounded-full p-2 flex items-center justify-center"
              onClick={() => {
                router.push("/dashboard/enterprise?table=service");
              }}
              >
            <AddCircleOutlineIcon />
              <h1>Adicionar Serviços</h1>
            </Button>
          </div>
        </div>
      <div>
        <DataTableDemoServices services={services}/>
      </div>
    </>
  );
}