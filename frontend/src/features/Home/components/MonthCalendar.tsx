import { useMemo, useState } from "react";
import { Button } from "@heroui/react/button";
import type { CalendarEvent } from "../types/profile";

type Props = {
  events: CalendarEvent[];
};

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"] as const;

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function MonthCalendar({ events }: Props) {
  const today = useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const event of events) {
      const existing = map.get(event.date) ?? [];
      existing.push(event);
      map.set(event.date, existing);
    }
    return map;
  }, [events]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array.from({ length: firstDayOfWeek }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  const monthEvents = events.filter((event) => {
    const [eventYear, eventMonth] = event.date.split("-").map(Number);
    return eventYear === year && eventMonth === month + 1;
  });

  const goToPreviousMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return (
    <section className="lib-panel p-4 text-left">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="font-display m-0 text-base font-semibold text-[var(--lib-ink)]">
          {year}年{month + 1}月
        </h3>
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onPress={goToPreviousMonth} aria-label="前の月">
            ‹
          </Button>
          <Button size="sm" variant="ghost" onPress={goToToday}>
            今日
          </Button>
          <Button size="sm" variant="ghost" onPress={goToNextMonth} aria-label="次の月">
            ›
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-[var(--lib-ink-muted)]">
        {WEEKDAYS.map((day) => (
          <div key={day} className="py-1">
            {day}
          </div>
        ))}
      </div>
      <div className="space-y-1">
        {weeks.map((week, weekIndex) => (
          <div key={`week-${weekIndex}`} className="grid grid-cols-7 gap-1">
            {week.map((day, dayIndex) => {
              if (day === null) {
                return <div key={`empty-${weekIndex}-${dayIndex}`} className="h-8" />;
              }

              const cellDate = new Date(year, month, day);
              const dateKey = toDateKey(cellDate);
              const hasEvent = eventsByDate.has(dateKey);
              const isToday = isSameDay(cellDate, today);

              return (
                <div
                  key={dateKey}
                  className={`relative mx-auto flex h-8 w-8 items-center justify-center rounded-[var(--lib-radius)] text-sm ${
                    isToday
                      ? "bg-[var(--lib-accent)] font-semibold text-[var(--lib-accent-fg)]"
                      : hasEvent
                        ? "bg-[var(--lib-accent-soft)] font-medium"
                        : ""
                  }`}
                  title={
                    hasEvent
                      ? eventsByDate
                          .get(dateKey)
                          ?.map((event) => event.label)
                          .join("、")
                      : undefined
                  }
                >
                  {day}
                  {hasEvent && !isToday ? (
                    <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-[var(--lib-accent)]" />
                  ) : null}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {monthEvents.length > 0 ? (
        <ul className="mt-4 space-y-1 border-t border-[var(--lib-line)] pt-3 text-sm">
          {monthEvents.map((event) => (
            <li key={`${event.date}-${event.label}`}>
              <span className="text-[var(--lib-ink-muted)]">{event.date.slice(5)}</span>
              {" - "}
              {event.label}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
