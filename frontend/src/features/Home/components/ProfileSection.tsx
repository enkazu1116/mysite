import { Card, Typography } from "@heroui/react";
import type { Profile } from "../types/profile";

type Props = {
  profile: Pick<Profile, "name" | "title" | "avatarSrc" | "avatarAlt" | "bio">;
};

export function ProfileSection({ profile }: Props) {
  return (
    <Card className="text-left">
      <Card.Content className="flex flex-col items-center gap-4 p-6 sm:flex-row sm:items-start">
        <img
          src={profile.avatarSrc}
          alt={profile.avatarAlt}
          className="h-36 w-36 shrink-0 rounded-full border-2 border-gray-200 object-cover dark:border-gray-700"
        />
        <div className="flex-1">
          <Typography.Heading level={2} className="mb-1">
            {profile.name}
          </Typography.Heading>
          <Typography type="body-sm" color="muted" className="mb-4">
            {profile.title}
          </Typography>
          <Typography.Heading level={3} className="mb-3 text-base">
            自己紹介
          </Typography.Heading>
          <div className="space-y-3">
            {profile.bio.map((paragraph, index) => (
              <Typography.Paragraph key={index} className="text-left leading-relaxed">
                {paragraph}
              </Typography.Paragraph>
            ))}
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}
