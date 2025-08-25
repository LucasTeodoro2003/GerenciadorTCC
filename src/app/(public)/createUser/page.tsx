import { auth } from "@/shared/lib/auth";
import ThemeToggleV2 from "@/shared/ui/components/toggleDarkMode";
import { CreatedUser } from "@/shared/ui/createdUser-form";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <>
      <div className="absolute top-6 right-6">
        <ThemeToggleV2 />
      </div>

      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <CreatedUser />
        </div>
      </div>
    </>
  );
}
