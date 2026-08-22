import {
  GithubIcon,
  LinkedinIcon,
  TelegramIcon,
} from "@/components/shared/brand-icons";
import { Avatar, Card } from "@/components/ui";
import type { Person } from "@/types";

const SOCIAL_LABELS = {
  github: "گیت‌هاب",
  linkedin: "لینکدین",
  telegram: "تلگرام",
} as const;

export function PersonCard({ person }: { person: Person }) {
  const links = [
    { key: "github", href: person.socials.github },
    { key: "linkedin", href: person.socials.linkedin },
    { key: "telegram", href: person.socials.telegram },
  ] as const;

  return (
    <Card className="p-5">
      <div className="flex items-center gap-4">
        <Avatar name={person.name} src={person.avatar || undefined} size="lg" />
        <div>
          <p className="font-bold">{person.name}</p>
          <p className="text-muted text-sm">{person.role}</p>
        </div>
      </div>

      <p className="text-muted mt-4 text-sm">{person.bio}</p>

      <ul className="mt-4 flex items-center gap-2">
        {links.map((link) =>
          link.href ? (
            <li key={link.key}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${person.name} در ${SOCIAL_LABELS[link.key]}`}
                className="border-border text-muted hover:border-primary hover:text-primary focus-visible:outline-ring flex size-9 items-center justify-center rounded-xl border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                {link.key === "github" && <GithubIcon className="size-4" />}
                {link.key === "linkedin" && <LinkedinIcon className="size-4" />}
                {link.key === "telegram" && <TelegramIcon className="size-4" />}
              </a>
            </li>
          ) : null,
        )}
      </ul>
    </Card>
  );
}
