import { motion, useReducedMotion } from "motion/react";
import { profile } from "./data/profileData";
import { MonthCalendar } from "./components/MonthCalendar";
import { ProfileSection } from "./components/ProfileSection";

export default function Home() {
  const reduceMotion = useReducedMotion();

  return (
    <main className="flex-1 px-4 pb-10 pt-6 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-start">
        <aside
          aria-label="カレンダー"
          className="hidden shrink-0 lg:sticky lg:top-6 lg:block lg:w-72 lg:border-r lg:border-[var(--lib-line)] lg:pr-6"
        >
          <MonthCalendar events={profile.calendarEvents} />
        </aside>

        <div className="min-w-0 flex-1 text-left lg:pl-8">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <h1 className="font-display m-0 text-4xl font-semibold tracking-tight text-[var(--lib-ink)] sm:text-5xl">
              Home
            </h1>
            <p className="mt-2 max-w-xl text-base text-[var(--lib-ink-muted)]">
              スキル、プロジェクト、読書記録をまとめた個人サイトです。
            </p>
          </motion.div>
          <div className="mt-8">
            <ProfileSection profile={profile} />
          </div>
        </div>
      </div>
    </main>
  );
}
