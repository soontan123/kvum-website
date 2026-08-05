'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

type Partner = { id: number; name: string };
type PartnersData = { generations?: string[] } & Record<string, unknown>;

const ASSET_VERSION = process.env.NEXT_PUBLIC_ASSET_VERSION ?? '';

function LogoGroup({
  partners,
  generation,
  ariaHidden,
  eager,
}: {
  partners: Partner[];
  generation: string;
  ariaHidden?: boolean;
  eager?: boolean;
}) {
  return (
    <div className="ticker__group" aria-hidden={ariaHidden}>
      {partners.map(p => (
        <Image
          key={p.id}
          src={`/images/partners/${generation}/${p.id}.png?v=${ASSET_VERSION}`}
          alt=""
          className="ticker__logo"
          width={220}
          height={48}
          loading={eager ? 'eager' : 'lazy'}
        />
      ))}
    </div>
  );
}

export function LogoTicker() {
  const sectionRef = useRef<HTMLElement>(null);
  const [generation, setGeneration] = useState('');
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    fetch('/data/partners.json')
      .then(res => res.json())
      .then((json: PartnersData) => {
        const gens = json.generations ?? [];
        const latest = gens[gens.length - 1];
        if (!latest) return;
        setGeneration(latest);
        setPartners((json[latest] as Partner[]) ?? []);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || partners.length === 0) return;

    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => {
        section.classList.add('is-ready');
      });
      return () => cancelAnimationFrame(raf2);
    });
    return () => cancelAnimationFrame(raf1);
  }, [partners]);

  return (
    <section ref={sectionRef} className="ticker ticker--logos" id="next-event" aria-label="Partners">
      <div className="ticker__track">
        <LogoGroup partners={partners} generation={generation} eager />
        <LogoGroup partners={partners} generation={generation} ariaHidden />
      </div>
    </section>
  );
}
