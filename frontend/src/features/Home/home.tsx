import { Typography } from "@heroui/react";
import { profile } from "./data/profileData";
import { MonthCalendar } from "./components/MonthCalendar";
import { ProfileSection } from "./components/ProfileSection";

export default function Home() {
  return (
    <main className="flex-1 px-4 pb-8 pt-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <aside
          aria-label="カレンダー"
          className="hidden shrink-0 lg:sticky lg:top-6 lg:block lg:w-72 lg:border-r lg:border-gray-200 lg:pr-6"
        >
          <MonthCalendar events={profile.calendarEvents} />
        </aside>

        <div className="min-w-0 flex-1 space-y-8 lg:pl-2">
          <Typography.Heading level={1} className="text-left">
            Home
          </Typography.Heading>
          <ProfileSection profile={profile} />
        </div>
      </div>
    </main>
  );
}
