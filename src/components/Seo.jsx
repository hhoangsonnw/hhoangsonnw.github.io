import { Helmet } from 'react-helmet-async';

const defaultTitle = 'HHOANGSONNW';
const defaultDescription = 'Personal cybersecurity portfolio with CTF write-ups, research notes, and reproducible labs.';

export default function Seo({ title, description = defaultDescription, image, type = 'website', url }) {
  const pageTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      {url ? <meta property="og:url" content={url} /> : null}
      {image ? <meta property="og:image" content={image} /> : null}
      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
    </Helmet>
  );
}
