// import { auth } from "@/shared/lib/auth";
// import SignOut from "@/shared/ui/signOut";
import { redirect } from "next/navigation";

export default async function Page() {
  redirect("/login");

  // return (
  //   <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
  //     <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
  //       <div>
  //         <p>CONECTADO COM SUCESSO</p>
  //         <p>{session.user?.email}</p>
  //         <p>
  //           <SignOut />
  //         </p>
  //       </div>
  //     </main>
  //   </div>
  // );
}
