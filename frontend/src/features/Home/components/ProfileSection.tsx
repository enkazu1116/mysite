import type { Profile } from "../types/profile";

type Props = {
  profile: Pick<Profile, "name" | "title" | "avatarSrc" | "avatarAlt" | "bio">;
};

export function ProfileSection({ profile }: Props) {
  return (
    <section className="flex flex-col items-center gap-6 text-left sm:flex-row sm:items-start">
      <img
        src={profile.avatarSrc}
        alt={profile.avatarAlt}
        className="h-36 w-36 shrink-0 rounded-[var(--lib-radius)] border border-[var(--lib-line)] object-cover"
      />
      <div className="min-w-0 flex-1">
        <h2 className="font-display m-0 text-2xl font-semibold text-[var(--lib-ink)]">
          {profile.name}
        </h2>
        <p className="mt-1 m-0 text-sm text-[var(--lib-ink-muted)]">{profile.title}</p>
        <h3 className="font-display mt-6 mb-3 text-base font-semibold text-[var(--lib-ink)]">
          自己紹介
        </h3>
        <div className="max-w-prose space-y-3">
          {profile.bio.map((paragraph) => (
            <p
              key={paragraph}
              className="m-0 text-left leading-relaxed text-[var(--lib-ink)]"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
