import React from "react";
import { Container } from "./Container";

export function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 border-t border-border py-20 first:border-t-0 sm:py-28"
    >
      <Container>
        {eyebrow && (
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-terminal">
            {eyebrow}
          </p>
        )}
        {title && (
          <h2 className="mb-10 text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h2>
        )}
        {children}
      </Container>
    </section>
  );
}
