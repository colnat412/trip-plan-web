'use client';

import { useTranslations } from 'next-intl';

export type InstallStep = 'share' | 'home' | 'confirm';

// Reconstructed Safari iOS 18 light-mode panels, not device screenshots.
// Fixed colors belong to the illustrated OS interface, not the surrounding app.
const SafariInstallIllustration = ({ step }: { step: InstallStep }) => {
  const t = useTranslations('pwa.guide');
  return (
    <svg viewBox="0 0 360 260" width="100%" role="img" aria-label={t(`${step}.alt`)} style={{ display: 'block', fontFamily: '-apple-system, BlinkMacSystemFont, Arial, sans-serif', colorScheme: 'light' }}>
      <rect width="360" height="260" fill="#f2f2f7" />
      {step === 'share' ? (
        <>
          <rect width="360" height="155" fill="#fff" />
          <image href="/icon.svg" x="20" y="20" width="40" height="40" />
          <text x="72" y="47" fontSize="20" fontWeight="600" fill="#17213b">Vi Vu</text>
          <rect x="20" y="78" width="320" height="57" rx="12" fill="#f2f5fa" />
          <path d="M36 96h130 M36 116h204" stroke="#d5dce7" strokeWidth="6" strokeLinecap="round" />
          <path d="M0 155h360" stroke="#d1d1d6" strokeWidth=".5" />
          <rect x="15" y="165" width="330" height="40" rx="12" fill="#e3e3e8" />
          <text x="29" y="190" fontSize="15" fill="#1c1c1e">aA</text>
          <text x="180" y="190" textAnchor="middle" fontSize="14" fill="#1c1c1e">Vi Vu</text>
          <path d="M320 180a7 7 0 1 0 2 9m-1-12v6h-6" stroke="#1c1c1e" fill="none" strokeWidth="1.5" />
          <g fill="none" stroke="#007aff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M31 217l-7 7 7 7" /><path d="M100 217l7 7-7 7" stroke="#aeaeb2" />
            <path d="M172 222v12h16v-12m-8 4v-15m-5 5 5-5 5 5" />
            <path d="M249 215v18m0-16q-8-5-13-2v16q7-3 13 2 7-5 13-2v-16q-6-3-13 2" />
            <rect x="318" y="216" width="17" height="18" rx="3" /><path d="M314 228v-16h15" />
          </g>
          <rect x="157" y="207" width="46" height="33" rx="9" fill="none" stroke="#ef4444" strokeWidth="2.5" />
          <path d="M216 183l-24 22m0-8v8h8" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
        </>
      ) : step === 'home' ? (
        <>
          <rect width="360" height="260" fill="#d1d1d6" />
          <rect x="0" y="10" width="360" height="250" rx="15" fill="#f2f2f7" />
          <rect x="164" y="16" width="32" height="4" rx="2" fill="#c7c7cc" />
          <image href="/icon.svg" x="16" y="31" width="36" height="36" />
          <text x="63" y="47" fontSize="14" fontWeight="600" fill="#1c1c1e">Vi Vu</text>
          <text x="63" y="63" fontSize="11" fill="#8e8e93">Safari</text>
          <circle cx="330" cy="47" r="13" fill="#e5e5ea" />
          <path d="M326 43l8 8m0-8-8 8" stroke="#8e8e93" strokeWidth="2" />
          <rect x="16" y="81" width="328" height="145" rx="11" fill="#fff" />
          {[117,153,189].map(y => <path key={y} d={`M30 ${y}h314`} stroke="#e5e5ea" strokeWidth=".7" />)}
          <g fill="#1c1c1e" fontSize="14">
            <text x="30" y="105">{t('safari.copy')}</text>
            <text x="30" y="141">{t('safari.bookmark')}</text>
            <text x="30" y="177">{t('safari.readingList')}</text>
            <text x="30" y="213">{t('home.action')}</text>
          </g>
          <g fill="none" stroke="#1c1c1e" strokeWidth="1.5" strokeLinejoin="round">
            <rect x="313" y="91" width="12" height="15" rx="2" /><path d="M310 102h-2V88h12v2" />
            <path d="M309 127h14v17l-7-4-7 4z" />
            <circle cx="310" cy="171" r="5" /><circle cx="324" cy="171" r="5" /><path d="M315 170h4" />
            <rect x="308" y="198" width="17" height="17" rx="3" /><path d="M312 206.5h9m-4.5-4.5v9" />
          </g>
          <rect x="19" y="191" width="322" height="33" rx="7" fill="none" stroke="#ef4444" strokeWidth="2.5" />
        </>
      ) : (
        <>
          <rect width="360" height="260" fill="#d1d1d6" />
          <rect y="10" width="360" height="250" rx="15" fill="#f2f2f7" />
          <path d="M0 67h360" stroke="#c7c7cc" strokeWidth=".5" />
          <text x="16" y="44" fontSize="15" fill="#007aff">{t('safari.cancel')}</text>
          <text x="180" y="43" textAnchor="middle" fontSize="12" fontWeight="600" fill="#1c1c1e">{t('home.action')}</text>
          <text x="329" y="44" textAnchor="middle" fontSize="15" fontWeight="600" fill="#007aff">{t('confirm.action')}</text>
          <rect x="302" y="23" width="53" height="34" rx="9" fill="none" stroke="#ef4444" strokeWidth="2.5" />
          <image href="/icon.svg" x="20" y="88" width="57" height="57" />
          <rect x="92" y="87" width="250" height="67" rx="10" fill="#fff" />
          <text x="105" y="111" fontSize="16" fill="#1c1c1e">Vi Vu</text>
          <path d="M104 121h238" stroke="#e5e5ea" />
          <text x="105" y="142" fontSize="12" fill="#8e8e93">{t('safari.website')}</text>
          <text x="20" y="184" fontSize="12" fill="#6c6c70">{t('safari.confirmHint')}</text>
          <path d="M297 79l22-20m-8 0h8v8" stroke="#ef4444" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
      )}
      <rect x="120" y="249" width="120" height="4" rx="2" fill="#1c1c1e" />
    </svg>
  );
};

export default SafariInstallIllustration;
