import LocationAddress, {
  DistanceBetweenPoints,
} from "@/shared/lib/actionLocation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/ui/components/alert-dialog";
import { toast } from "sonner";

interface CalculeDistanceProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setWantsSearchService: (wants: boolean) => void;
  setAddValue: (value: number) => void;
  postalCode: string
  setDisable: (disable: boolean) => void;
}
export function CalculeDistance({
  open,
  onOpenChange,
  setWantsSearchService,
  setAddValue,
  postalCode,
  setDisable,
}: CalculeDistanceProps) {
  
  const calculeDistance = async () => {
    try {
      const location = await LocationAddress(postalCode);
      const formDistance = new FormData();
      formDistance.append("lat", location.lat.toString());
      formDistance.append("lng", location.lng.toString());
      formDistance.append("baseLat", location.baseLat.toString());
      formDistance.append("baseLng", location.baseLng.toString());
      const distance = await DistanceBetweenPoints(formDistance);
      const distanceFinaly = distance.distancia.text
        .split(" ")[0]
        .replace(",", ".");
      if (Number(distanceFinaly) >= 5.1 && Number(distanceFinaly) < 10) {
        setAddValue(1.15);
      } else if (Number(distanceFinaly) >= 10.1) {
        setAddValue(1.2);
      } else if (Number(distanceFinaly) <= 5 && Number(distanceFinaly) >= 2) {
        setAddValue(1.1);
      } else if (Number(distanceFinaly) < 2) {
        setAddValue(1.05);
      }
      setDisable(true);
      setWantsSearchService(true);
    } catch (error) {
      console.log("Erro ao calcular distância:", error);
      toast.error(
        "Erro ao calcular a distância. Por favor, verifique o CEP do endereço e tente novamente."
      );
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Serão cobradas taxas adicionais</AlertDialogTitle>
          <AlertDialogHeader>
            Deseja continuar e solicitar o serviço de busca do veículo?
          </AlertDialogHeader>
          <AlertDialogDescription>
            Obs: O endereço deve estar correto para evitar cobranças indevidas.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setWantsSearchService(false)}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={calculeDistance}
          >
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
