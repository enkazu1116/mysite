export type CalendarEvent = {
  date: string;
  label: string;
};

export type Profile = {
  name: string;
  title: string;
  avatarSrc: string;
  avatarAlt: string;
  bio: string[];
  calendarEvents: CalendarEvent[];
};
