interface SeoProps {
  title: string;
  description: string;
  path?: string;
  schema?: object;
}

export const Seo = ({ title, description, path = "/", schema }: SeoProps) => {
  void title;
  void description;
  void path;

  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
