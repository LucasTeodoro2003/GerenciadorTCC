"use client"
import CalendarIcons, {
  CalendarIconsProps,
} from "@/features/calendarWithicons/calendarHome";

export default function CalendarPageClient({
  calendar,
  services,
  user,
}: CalendarIconsProps) {
  return (
      <CalendarIcons calendar={calendar} services={services} user={user} />
  );
}
