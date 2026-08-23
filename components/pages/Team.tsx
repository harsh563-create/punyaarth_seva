'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import PageHero from '@/components/ui/PageHero';
import FadeIn from '@/components/ui/FadeIn';
import Modal from '@/components/ui/Modal';
import { useLanguage } from '@/i18n/useLanguage';
import { memberBrand, SocialIcon } from '@/data/social';
import type { MemberCategory, TeamMember } from '@/types';

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

/** Consistent rounded photo with a warm initials fallback. */
function Avatar({
  member,
  className = 'h-36 w-36 rounded-3xl',
}: {
  member: TeamMember;
  className?: string;
}) {
  if (member.photo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={member.photo}
        alt={member.name}
        loading="lazy"
        className={`${className} shrink-0 border border-beige-dark object-cover`}
      />
    );
  }
  return (
    <div
      className={`${className} flex shrink-0 select-none items-center justify-center border border-beige-dark bg-gradient-to-br from-saffron-light via-cream to-forest-muted font-serif font-semibold text-forest`}
      aria-hidden="true"
    >
      <span className={className.includes('rounded-full') ? 'text-xl' : 'text-3xl'}>
        {initialsOf(member.name)}
      </span>
    </div>
  );
}

const SOCIAL_BUTTON =
  'flex h-9 w-9 items-center justify-center rounded-full border border-beige-dark bg-white text-earth-dark transition-all duration-300 hover:-translate-y-0.5 hover:border-saffron hover:bg-saffron hover:text-white';

function SocialRow({ urls }: { urls: string[] }) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {urls.map((url) => {
        const brand = memberBrand(url);
        return (
          <a
            key={url}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={brand?.label ?? 'Profile link'}
            title={brand?.label ?? url}
            className={SOCIAL_BUTTON}
          >
            {brand ? (
              <SocialIcon pathD={brand.pathD} className="h-4 w-4" />
            ) : (
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M10 14a5 5 0 0 0 7.07 0l3.18-3.18a5 5 0 0 0-7.07-7.07L11.5 5.43" />
                <path d="M14 10a5 5 0 0 0-7.07 0L3.75 13.18a5 5 0 0 0 7.07 7.07l1.68-1.68" />
              </svg>
            )}
          </a>
        );
      })}
    </div>
  );
}

function CategoryHeading({
  eyebrow,
  subtitle,
}: {
  eyebrow: string;
  subtitle: string;
}) {
  return (
    <FadeIn className="mb-10 text-center">
      <p className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-saffron-dark">
        {eyebrow}
      </p>
      <h3 className="mt-2 font-serif text-2xl md:text-3xl font-semibold text-forest">
        {subtitle}
      </h3>
      <div className="mx-auto mt-4 h-1 w-12 rounded-full bg-saffron" />
    </FadeIn>
  );
}

interface TeamProps {
  members: TeamMember[];
}

export default function Team({ members }: TeamProps) {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<TeamMember | null>(null);

  const groups = useMemo<Record<MemberCategory, TeamMember[]>>(
    () => ({
      leadership: members.filter((m) => m.category === 'leadership'),
      core: members.filter((m) => m.category === 'core'),
      volunteer: members.filter((m) => m.category === 'volunteer'),
    }),
    [members]
  );

  const leadership = groups.leadership;

  return (
    <>
      <PageHero
        title={t('teamPage.heroTitle')}
        subtitle={t('teamPage.heroSubtitle')}
      />

      <main className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          {/* ------------------------------------------------ leadership */}
          {leadership.length > 0 && (
            <section>
              <CategoryHeading
                eyebrow={t('teamPage.leadershipEyebrow')}
                subtitle={t('teamPage.leadershipSubtitle')}
              />
              <div className="grid gap-6 md:grid-cols-2">
                {leadership.map((member, index) => (
                  <FadeIn key={member.id} delay={index * 100}>
                    <article className="group flex h-full flex-col items-center gap-6 rounded-3xl border border-beige-dark bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-saffron/50 hover:shadow-lg sm:flex-row sm:text-left">
                      <Avatar
                        member={member}
                        className="h-36 w-36 rounded-3xl ring-2 ring-saffron/40 ring-offset-4 ring-offset-white"
                      />
                      <div className="min-w-0">
                        <h4 className="font-serif text-xl font-semibold text-text">
                          {member.name}
                        </h4>
                        <p className="mt-1 font-sans text-sm font-semibold uppercase tracking-wide text-saffron-dark">
                          {member.designation.en || member.designation.hi}
                        </p>
                        {member.bio.en && (
                          <p className="mt-3 line-clamp-3 font-sans text-sm leading-relaxed text-text-muted">
                            {member.bio.en}
                          </p>
                        )}
                        {(member.socials.length > 0 || (member.showPhone && member.phone)) && (
                          <button
                            onClick={() => setSelected(member)}
                            className="mt-4 inline-flex items-center gap-1.5 rounded-full border-2 border-forest px-4 py-1.5 font-sans text-xs font-medium text-forest transition-colors hover:bg-forest hover:text-white cursor-pointer"
                          >
                            {t('teamPage.viewProfile')}
                          </button>
                        )}
                      </div>
                    </article>
                  </FadeIn>
                ))}
              </div>
            </section>
          )}

          {/* -------------------------------------------------- core team */}
          {groups.core.length > 0 && (
            <section className={leadership.length ? 'mt-20' : ''}>
              <CategoryHeading
                eyebrow={t('teamPage.coreEyebrow')}
                subtitle={t('teamPage.coreSubtitle')}
              />
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {groups.core.map((member, index) => (
                  <FadeIn key={member.id} delay={index * 80}>
                    <article className="flex h-full flex-col items-center rounded-3xl border border-beige-dark bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-saffron/50 hover:shadow-lg">
                      <Avatar member={member} className="h-28 w-28 rounded-full" />
                      <h4 className="mt-4 font-serif text-lg font-semibold text-text">
                        {member.name}
                      </h4>
                      <p className="mt-1 font-sans text-sm font-semibold text-saffron-dark">
                        {member.designation.en || member.designation.hi}
                      </p>
                      {member.bio.en && (
                        <p className="mt-3 line-clamp-3 font-sans text-sm leading-relaxed text-text-muted">
                          {member.bio.en}
                        </p>
                      )}
                      {(member.socials.length > 0 || (member.showPhone && member.phone)) && (
                        <button
                          onClick={() => setSelected(member)}
                          className="mt-4 inline-flex items-center gap-1.5 rounded-full border-2 border-forest px-4 py-1.5 font-sans text-xs font-medium text-forest transition-colors hover:bg-forest hover:text-white cursor-pointer"
                        >
                          {t('teamPage.viewProfile')}
                        </button>
                      )}
                    </article>
                  </FadeIn>
                ))}
              </div>
            </section>
          )}

          {/* ---------------------------------------------- volunteers */}
          {groups.volunteer.length > 0 && (
            <section className={leadership.length || groups.core.length ? 'mt-20' : ''}>
              <CategoryHeading
                eyebrow={t('teamPage.volunteersEyebrow')}
                subtitle={t('teamPage.volunteersSubtitle')}
              />
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {groups.volunteer.map((member, index) => (
                  <FadeIn key={member.id} delay={(index % 5) * 60}>
                    <article className="flex h-full flex-col items-center rounded-2xl border border-beige bg-cream-light/40 p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-saffron/50 hover:bg-white hover:shadow-md">
                      <Avatar member={member} className="h-20 w-20 rounded-full" />
                      <h4 className="mt-3 line-clamp-2 font-serif text-base font-semibold text-text">
                        {member.name}
                      </h4>
                      <p className="mt-0.5 font-sans text-xs font-medium text-earth-dark">
                        {member.designation.en || member.designation.hi}
                      </p>
                    </article>
                  </FadeIn>
                ))}
              </div>
            </section>
          )}

          {/* -------------------------------------------- join mission */}
          <FadeIn className="mt-24">
            <section className="relative overflow-hidden rounded-[2.5rem] border border-saffron/40 bg-gradient-to-br from-saffron-light/60 via-cream to-forest-muted/25 px-8 py-14 text-center md:px-16">
              <div
                className="pointer-events-none absolute -top-16 -right-10 h-48 w-48 rounded-full bg-saffron/15 blur-3xl"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-forest/10 blur-3xl"
                aria-hidden="true"
              />
              <h3 className="relative font-serif text-2xl md:text-4xl font-semibold text-forest">
                {t('teamPage.joinMissionTitle')}
              </h3>
              <p className="relative mx-auto mt-4 max-w-2xl font-sans text-base leading-relaxed text-text-muted md:text-lg">
                {t('teamPage.joinMissionText')}
              </p>
              <Link
                href="/join"
                className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-forest px-8 py-3 font-sans text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-forest-light hover:shadow-lg cursor-pointer"
              >
                {t('teamPage.joinButton')}
              </Link>
            </section>
          </FadeIn>
        </div>
      </main>

      {/* ----------------------------------------------- profile modal */}
      <Modal isOpen={selected !== null} onClose={() => setSelected(null)}>
        {selected && (
          <div className="p-8 sm:p-10">
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
              <Avatar
                member={selected}
                className="h-40 w-40 rounded-3xl ring-2 ring-saffron/40 ring-offset-4 ring-offset-white"
              />
              <div className="min-w-0 text-center sm:text-left">
                <h3 className="font-serif text-2xl font-semibold text-text">
                  {selected.name}
                </h3>
                <p className="mt-1 font-sans text-sm font-semibold uppercase tracking-wide text-saffron-dark">
                  {selected.designation.en || selected.designation.hi}
                </p>
                {selected.bio.en && (
                  <p className="mt-4 font-sans text-sm leading-relaxed text-text-muted">
                    {selected.bio.en}
                  </p>
                )}
                {selected.showPhone && selected.phone && (
                  <p className="mt-4 font-sans text-sm text-text">
                    <span className="font-semibold">{t('teamPage.phoneLabel')}:</span>{' '}
                    <a
                      href={`tel:+91${selected.phone.replace(/\D/g, '').slice(-10)}`}
                      className="text-forest underline decoration-saffron underline-offset-4 hover:text-saffron-dark"
                    >
                      +91 {selected.phone}
                    </a>
                  </p>
                )}
              </div>
            </div>
            {selected.socials.length > 0 && <SocialRow urls={selected.socials} />}
          </div>
        )}
      </Modal>
    </>
  );
}
