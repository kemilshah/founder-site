import { useSeo } from '../lib/useSeo.js';
import { useCmsPage, useCmsList } from '../lib/useCms.js';
import { getLifestyleImages, mediaUrl } from '../lib/cms.js';

const FALLBACK = {
  eyebrow: 'Lifestyle',
  heading: 'Beyond the boardroom.',
  intro: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  secondaryHeading: '[CONTENT TO BE PROVIDED — feature headline]',
  secondaryBody: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  seoTitle: 'Lifestyle — Kemil Shah',
  seoDescription: '[CONTENT TO BE PROVIDED — lifestyle page meta description]',
};

const FALLBACK_IMAGES = [1, 2, 3, 4, 5, 6].map((n) => ({ id: n, caption: `[LIFESTYLE IMAGE ${n}]` }));

export default function Lifestyle() {
  const content = useCmsPage('lifestyle', FALLBACK);
  const images = useCmsList(getLifestyleImages, FALLBACK_IMAGES);

  useSeo({ title: content.seoTitle, description: content.seoDescription });

  return (
    <div>
      <section className="section">
        <div className="container">
          <div className="eyebrow">{content.eyebrow}</div>
          <h1 style={{ marginTop: 16, maxWidth: 800 }}>{content.heading}</h1>
          <p style={{ marginTop: 16, maxWidth: 560 }}>{content.intro}</p>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <div className="grid-3">
            {images.map((img) =>
              mediaUrl(img.image) ? (
                <img key={img.id} src={mediaUrl(img.image)} alt={img.caption || ''} className="figure" style={{ objectFit: 'cover' }} />
              ) : (
                <div className="figure" key={img.id}>{img.caption || '[LIFESTYLE IMAGE]'}</div>
              )
            )}
          </div>
        </div>
      </section>

      <section className="section-tight dark">
        <div className="container grid-2" style={{ alignItems: 'center' }}>
          <div className="figure wide">[FEATURE IMAGE]</div>
          <div>
            <div className="eyebrow">Off Duty</div>
            <h2 style={{ marginTop: 16 }}>{content.secondaryHeading}</h2>
            <p style={{ marginTop: 16 }}>{content.secondaryBody}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
