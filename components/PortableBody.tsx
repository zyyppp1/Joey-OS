import {
  PortableText,
  type PortableTextComponents,
} from "@portabletext/react";
import { urlFor } from "@/lib/sanity/image";

/* eslint-disable @typescript-eslint/no-explicit-any */
const components: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h2 className="mt-10 text-2xl font-semibold tracking-tight">{children}</h2>
    ),
    h2: ({ children }) => (
      <h2 className="mt-8 text-xl font-semibold tracking-tight">{children}</h2>
    ),
    h3: ({ children }) => <h3 className="mt-6 text-lg font-medium">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="mt-4 border-l-2 border-border pl-4 text-muted">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => <p className="mt-4 leading-[1.7]">{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className="mt-4 space-y-1.5">{children}</ul>,
    number: ({ children }) => (
      <ol className="mt-4 list-decimal space-y-1.5 pl-5">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="flex gap-2">
        <span className="text-muted">—</span>
        <span>{children}</span>
      </li>
    ),
    number: ({ children }) => <li>{children}</li>,
  },
  marks: {
    code: ({ children }) => (
      <code className="rounded bg-fg/[0.06] px-1 py-0.5 font-mono text-[0.9em]">
        {children}
      </code>
    ),
    link: ({ children, value }: any) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent underline"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }: any) =>
      value?.asset ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={urlFor(value).width(1200).fit("max").auto("format").url()}
          alt={value.alt || ""}
          className="mt-6 w-full rounded-xl border border-border"
        />
      ) : null,
  },
};

export function PortableBody({ value }: { value: any[] }) {
  return (
    <div className="text-[17px] text-fg/90">
      <PortableText value={value} components={components} />
    </div>
  );
}
