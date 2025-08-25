import CalendarServer from "@/shared/ui/componentsMobile/calendar/calendar_server";

export default async function homePageMobile() {
  // const session = await auth();
  // if (session) redirect("/dashboard");

  return (
    <>
      <CalendarServer/>
    </>
  );
}
