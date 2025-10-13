import ThemeToggle from "@/shared/ui/darkOrWhiteDown";
import { redirect } from "next/navigation";

export default async function NoAcessPage() {
  redirect("clientApp/calendarApp");

  // return (
  //   <>
  //     <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
  //       <ThemeToggle />
  //       <div className="w-full max-w-sm md:max-w-3xl">
  //         Utilize o Aplicativo ou link Mobile
  //       </div>
  //     </div>
  //   </>
  // );
}
