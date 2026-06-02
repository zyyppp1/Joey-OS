import { Section } from "../ui/Section";
import { profile } from "@/data/profile";

export function Contact() {
  return (
    <Section id="contact" eyebrow="say hi" title="Get in touch">
      <p className="max-w-xl text-muted">
        Open to backend / cloud engineering roles. The fastest way to reach me is
        the live chat (bottom-right) — it pings my phone directly. Or find me here:
      </p>
      <div className="mt-6 flex flex-wrap gap-4">
        <a
          href={profile.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-border px-5 py-2.5 text-sm transition-colors hover:border-fg"
        >
          GitHub
        </a>
        <a
          href={profile.links.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-border px-5 py-2.5 text-sm transition-colors hover:border-fg"
        >
          LinkedIn
        </a>
        {profile.links.email && (
          <a
            href={`mailto:${profile.links.email}`}
            className="rounded-full border border-border px-5 py-2.5 text-sm transition-colors hover:border-fg"
          >
            Email
          </a>
        )}
      </div>
    </Section>
  );
}
