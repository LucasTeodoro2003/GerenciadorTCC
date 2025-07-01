// import { updateUser } from "@/shared/lib/actionsUpdateUser";
// import { Button } from "@/shared/ui/components/button";
// import { Input } from "@/shared/ui/components/input";
// import { Label } from "@/shared/ui/components/label";
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogDescription,
// //   DialogFooter,
// //   DialogHeader,
// //   DialogTitle,
// // } from "@/shared/ui/components/alert-dialog

// import { User } from "@prisma/client";

// interface ModalClientPromp {
//   openModal: boolean;
//   user: User;
// }

// export default function ModalClient({ openModal, user }: ModalClientPromp) {
//   return (
//     <Dialog open={openModal}>
//       <DialogContent className="sm:max-w-[425px] max-w-[90%] rounded-lg">
//         <form action={updateUser.bind(undefined, user.id)}>
//           <DialogHeader>
//             <DialogTitle>Primeiro Acesso</DialogTitle>
//             <DialogDescription>Digite suas informações</DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-4 py-4 ">
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="name" className="text-center">
//                 Nome
//               </Label>
//               <Input id="name" className="col-span-3" name="name" />
//             </div>
//             <div className="flex w-full items-center gap-1.5">
//             <Label htmlFor="image" className="text-center">
//                 Selecione sua foto
//               </Label>
//               <div className="flex w-full items-center gap-1.5">
//                 <Input id="image" type="file" name="image"/>
//               </div>
//             </div>
//           </div>
//           <DialogFooter>
//             <Button type="submit">Salvar</Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }
