import { Section } from "../ui/Section";
import { experience, education, certifications, skills } from "@/data/resume";
import { Reveal } from "../fx/Reveal";

export function Experience() {
  return (
    <Section id="experience" eyebrow="career" title="Experience">
      <div className="space-y-12">
        {experience.map((job, i) => (
          <Reveal key={job.company} delay={i * 80}>
            <div className="grid gap-2 sm:grid-cols-[8rem_1fr]">
              <p className="font-mono text-xs text-muted sm:pt-1">{job.period}</p>
              <div>
                <h3 className="text-lg font-medium">
                  {job.role} · {job.company}
                </h3>
                {job.summary && (
                  <p className="mt-1 text-sm text-muted">{job.summary}</p>
                )}
                <ul className="mt-3 space-y-1.5 text-sm leading-relaxed">
                  {job.highlights.map((h, j) => (
                    <li key={j} className="flex gap-2">
                      <span className="text-muted">—</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
                {job.stack && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {job.stack.map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-border px-2.5 py-0.5 font-mono text-xs text-muted"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-16">
        <div className="grid gap-10 sm:grid-cols-2">
          <div>
            <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-muted">
              Education
            </h3>
            <div className="space-y-4">
              {education.map((e) => (
                <div key={e.school}>
                  <p className="font-medium">{e.school}</p>
                  <p className="text-sm text-muted">
                    {e.degree} · {e.period}
                  </p>
                  {e.note && <p className="mt-1 text-sm text-muted">{e.note}</p>}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-muted">
              Certifications
            </h3>
            <ul className="space-y-2 text-sm">
              {certifications.map((c) => (
                <li key={c.name}>{c.name}</li>
              ))}
            </ul>
            <h3 className="mt-8 mb-4 font-mono text-xs uppercase tracking-widest text-muted">
              Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
