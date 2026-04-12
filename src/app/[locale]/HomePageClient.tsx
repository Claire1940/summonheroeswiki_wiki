'use client'

import { useEffect, useState, Suspense, lazy } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  ClipboardCheck,
  Clock,
  ExternalLink,
  Hammer,
  Home,
  Package,
  Sparkles,
  Star,
  TrendingUp,
} from 'lucide-react'
import Link from 'next/link'
import { useMessages } from 'next-intl'
import { VideoFeature } from '@/components/home/VideoFeature'
import { LatestGuidesAccordion } from '@/components/home/LatestGuidesAccordion'
import { NativeBannerAd, AdBanner } from '@/components/ads'
import { SidebarAd } from '@/components/ads/SidebarAd'
import { scrollToSection } from '@/lib/scrollToSection'
import { DynamicIcon } from '@/components/ui/DynamicIcon'
import type { ContentItemWithType } from '@/lib/getLatestArticles'
import type { ModuleLinkMap } from '@/lib/buildModuleLinkMap'

// Lazy load heavy components
const HeroStats = lazy(() => import('@/components/home/HeroStats'))
const FAQSection = lazy(() => import('@/components/home/FAQSection'))
const CTASection = lazy(() => import('@/components/home/CTASection'))

// Loading placeholder
const LoadingPlaceholder = ({ height = 'h-64' }: { height?: string }) => (
  <div className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`} />
)

// Conditionally render text as a link or plain span
function LinkedTitle({
  linkData,
  children,
  className,
  locale,
}: {
  linkData: { url: string; title: string } | null | undefined
  children: React.ReactNode
  className?: string
  locale: string
}) {
  if (!linkData?.url) {
    return <>{children}</>
  }

  const normalizedUrl = linkData.url.startsWith('/') ? linkData.url : `/${linkData.url}`
  const localizedHref = `/${locale}${normalizedUrl}`

  return (
    <Link
      href={localizedHref}
      className={className ? className : 'hover:text-[hsl(var(--nav-theme-light))] hover:underline underline-offset-4 transition-colors'}
      title={linkData.title}
    >
      {children}
    </Link>
  )
}

interface HomePageClientProps {
  latestArticles: ContentItemWithType[]
  moduleLinkMap: ModuleLinkMap
  locale: string
  videoId: string
  videoTitle: string
  links: {
    officialHub: string
    playOnRoblox: string
    developerGroup: string
    discord: string
    x: string
    youtube: string
  }
}

export default function HomePageClient({
  latestArticles,
  moduleLinkMap,
  locale,
  videoId,
  videoTitle,
  links,
}: HomePageClientProps) {
  const t = useMessages() as any

  // Accordion states
  const [bannerExpanded, setBannerExpanded] = useState<number | null>(null)

  // Scroll reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-reveal-visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('.scroll-reveal').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 左侧广告容器 - Fixed 定位 */}
      <aside
        className="hidden xl:block fixed top-20 w-40 z-10"
        style={{ left: 'calc((100vw - 896px) / 2 - 180px)' }}
      >
        <SidebarAd type="sidebar-160x300" adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X300} />
      </aside>

      {/* 右侧广告容器 - Fixed 定位 */}
      <aside
        className="hidden xl:block fixed top-20 w-40 z-10"
        style={{ right: 'calc((100vw - 896px) / 2 - 180px)' }}
      >
        <SidebarAd type="sidebar-160x600" adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X600} />
      </aside>

      {/* 广告位 1: 移动端横幅 Sticky */}
      {/* <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div> */}

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-6">
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.hero.badge}</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a
                href={links.officialHub}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-lg transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </a>
              <a
                href={links.playOnRoblox}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-lg transition-colors"
              >
                {t.hero.playOnRobloxCTA || t.hero.playOnSteamCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* 广告位 2: 原生横幅 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ''} />

      {/* Video Section */}
      <section className="px-4 py-12">
        <div className="scroll-reveal container mx-auto max-w-4xl">
          <div className="relative rounded-2xl overflow-hidden">
            <VideoFeature
              videoId={videoId}
              title={videoTitle}
              posterImage="/images/hero.webp"
            />
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <LatestGuidesAccordion articles={latestArticles} locale={locale} max={30} />

      {/* 广告位 3: 标准横幅 728×90 */}
      <AdBanner type="banner-728x90" adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90} />

      {/* Tools Grid - 16 Navigation Cards */}
      <section className="px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.tools.title}{' '}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-muted-foreground text-lg">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {t.tools.cards.map((card: any, index: number) => {
              // 映射卡片索引到 section ID
              const sectionIds = [
                'summon-heroes-codes',
                'summon-heroes-tier-list',
                'summon-heroes-beginner-guide',
                'summon-heroes-best-starter-units',
                'summon-heroes-best-team-builds',
                'summon-heroes-leveling-guide',
                'summon-heroes-gems-crystals-farming',
                'summon-heroes-summon-banner-guide',
                'summon-heroes-traits-guide',
                'summon-heroes-pvp-tier-list',
                'summon-heroes-tournament-tier-list',
                'summon-heroes-dungeons-raids-guide',
                'summon-heroes-upgrade-guide',
                'summon-heroes-best-units-by-role',
                'summon-heroes-endgame-progression',
                'summon-heroes-update-log',
              ]
              const sectionId = sectionIds[index]

              return (
                <a
                  key={index}
                  href={`#${sectionId}`}
                  onClick={(event) => {
                    event.preventDefault()
                    scrollToSection(sectionId)
                  }}
                  className="scroll-reveal group p-6 rounded-xl border border-border
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="w-12 h-12 rounded-lg mb-4
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors">
                    <DynamicIcon
                      name={card.icon}
                      className="w-6 h-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="font-semibold mb-2">{card.title}</h3>
                  <p className="text-sm text-muted-foreground">{card.description}</p>
                </a>
              )
            })}
          </div>
        </div>
      </section>

      {/* 广告位 4: 方形广告 300×250 */}
      <AdBanner type="banner-300x250" adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250} />

      {/* Module 1: Beginner Guide */}
      <section id="summon-heroes-codes" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['lucidBlocksBeginnerGuide']} locale={locale}>
                {t.modules.lucidBlocksBeginnerGuide.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.lucidBlocksBeginnerGuide.intro}
            </p>
          </div>

          {/* Steps */}
          <div className="scroll-reveal space-y-4 mb-10">
            {t.modules.lucidBlocksBeginnerGuide.steps.map((step: any, index: number) => (
              <div key={index} className="flex gap-4 p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[hsl(var(--nav-theme)/0.2)] border-2 border-[hsl(var(--nav-theme)/0.5)] flex items-center justify-center">
                  <span className="text-xl font-bold text-[hsl(var(--nav-theme-light))]">{index + 1}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    <LinkedTitle linkData={moduleLinkMap[`lucidBlocksBeginnerGuide::steps::${index}`]} locale={locale}>
                      {step.title}
                    </LinkedTitle>
                  </h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Tips */}
          <div className="scroll-reveal p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold text-lg">Quick Tips</h3>
            </div>
            <ul className="space-y-2">
              {t.modules.lucidBlocksBeginnerGuide.quickTips.map((tip: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 广告位 5: 中型横幅 468×60 */}
      <AdBanner type="banner-468x60" adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60} />

      {/* Module 2: Apotheosis Crafting */}
      <section id="summon-heroes-tier-list" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksApotheosisCrafting']} locale={locale}>{t.modules.lucidBlocksApotheosisCrafting.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksApotheosisCrafting.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {t.modules.lucidBlocksApotheosisCrafting.cards.map((card: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <h3 className="font-bold text-lg mb-2 text-[hsl(var(--nav-theme-light))]">
                  <LinkedTitle linkData={moduleLinkMap[`lucidBlocksApotheosisCrafting::cards::${index}`]} locale={locale}>
                    {card.name}
                  </LinkedTitle>
                </h3>
                <p className="text-muted-foreground text-sm">{card.description}</p>
              </div>
            ))}
          </div>
          <div className="scroll-reveal flex flex-wrap gap-3 justify-center">
            {t.modules.lucidBlocksApotheosisCrafting.milestones.map((m: string, i: number) => (
              <span key={i} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm">
                <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />{m}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Module 3: Tools and Weapons */}
      <section id="summon-heroes-beginner-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksToolsAndWeapons']} locale={locale}>{t.modules.lucidBlocksToolsAndWeapons.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksToolsAndWeapons.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.lucidBlocksToolsAndWeapons.items.map((item: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <Hammer className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">{item.type}</span>
                </div>
                <h3 className="font-bold mb-2">
                  <LinkedTitle linkData={moduleLinkMap[`lucidBlocksToolsAndWeapons::items::${index}`]} locale={locale}>
                    {item.name}
                  </LinkedTitle>
                </h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 4: Storage and Inventory */}
      <section id="summon-heroes-best-starter-units" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksStorageAndInventory']} locale={locale}>{t.modules.lucidBlocksStorageAndInventory.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksStorageAndInventory.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {t.modules.lucidBlocksStorageAndInventory.solutions.map((s: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-bold">
                    <LinkedTitle linkData={moduleLinkMap[`lucidBlocksStorageAndInventory::solutions::${index}`]} locale={locale}>
                      {s.name}
                    </LinkedTitle>
                  </h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">{s.role}</span>
                </div>
                <p className="text-muted-foreground text-sm">{s.description}</p>
              </div>
            ))}
          </div>
          <div className="scroll-reveal p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold">Management Tips</h3>
            </div>
            <ul className="space-y-2">
              {t.modules.lucidBlocksStorageAndInventory.managementTips.map((tip: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Module 5: Qualia and Base Building */}
      <section id="summon-heroes-best-team-builds" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksQualiaAndBaseBuilding']} locale={locale}>{t.modules.lucidBlocksQualiaAndBaseBuilding.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksQualiaAndBaseBuilding.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 lg:grid-cols-2 gap-4">
            {t.modules.lucidBlocksQualiaAndBaseBuilding.items.map((item: any, index: number) => (
              <div
                key={index}
                className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Home className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                    {item.mode}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-3 text-[hsl(var(--nav-theme-light))]">
                  <LinkedTitle linkData={moduleLinkMap[`lucidBlocksQualiaAndBaseBuilding::items::${index}`]} locale={locale}>
                    {item.buildName}
                  </LinkedTitle>
                </h3>
                <p className="text-sm text-muted-foreground mb-4">{item.focus}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.units.map((unit: string, unitIndex: number) => (
                    <span
                      key={unitIndex}
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]"
                    >
                      {unit}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{item.whyItWorks}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 6: World Regions */}
      <section id="summon-heroes-leveling-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksWorldRegions']} locale={locale}>{t.modules.lucidBlocksWorldRegions.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksWorldRegions.intro}</p>
          </div>
          <div className="scroll-reveal space-y-4">
            {t.modules.lucidBlocksWorldRegions.steps.map((step: any, index: number) => (
              <div
                key={index}
                className="flex gap-4 p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[hsl(var(--nav-theme)/0.2)] border-2 border-[hsl(var(--nav-theme)/0.5)] flex items-center justify-center">
                  <span className="text-xl font-bold text-[hsl(var(--nav-theme-light))]">{step.step}</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">
                    <LinkedTitle linkData={moduleLinkMap[`lucidBlocksWorldRegions::steps::${index}`]} locale={locale}>
                      {step.title}
                    </LinkedTitle>
                  </h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 7: Creatures and Enemies */}
      <section id="summon-heroes-gems-crystals-farming" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksCreaturesAndEnemies']} locale={locale}>{t.modules.lucidBlocksCreaturesAndEnemies.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksCreaturesAndEnemies.intro}</p>
          </div>
          <div className="scroll-reveal hidden md:block overflow-hidden rounded-xl border border-border bg-white/5">
            <table className="w-full text-sm">
              <thead className="bg-[hsl(var(--nav-theme)/0.08)]">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Source</th>
                  <th className="text-left px-4 py-3 font-semibold">Reward</th>
                  <th className="text-left px-4 py-3 font-semibold">Best For</th>
                  <th className="text-left px-4 py-3 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody>
                {t.modules.lucidBlocksCreaturesAndEnemies.entries.map((entry: any, index: number) => (
                  <tr key={index} className="border-t border-border/70 hover:bg-[hsl(var(--nav-theme)/0.05)] transition-colors">
                    <td className="px-4 py-3 font-semibold text-[hsl(var(--nav-theme-light))]">
                      <LinkedTitle linkData={moduleLinkMap[`lucidBlocksCreaturesAndEnemies::entries::${index}`]} locale={locale}>
                        {entry.source}
                      </LinkedTitle>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{entry.reward}</td>
                    <td className="px-4 py-3 text-muted-foreground">{entry.bestFor}</td>
                    <td className="px-4 py-3 text-muted-foreground">{entry.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="scroll-reveal grid grid-cols-1 gap-4 md:hidden">
            {t.modules.lucidBlocksCreaturesAndEnemies.entries.map((entry: any, index: number) => (
              <div key={index} className="p-5 bg-white/5 border border-border rounded-xl">
                <h3 className="font-semibold text-[hsl(var(--nav-theme-light))] mb-2">
                  <LinkedTitle linkData={moduleLinkMap[`lucidBlocksCreaturesAndEnemies::entries::${index}`]} locale={locale}>
                    {entry.source}
                  </LinkedTitle>
                </h3>
                <p className="text-sm text-muted-foreground"><span className="font-semibold">Reward:</span> {entry.reward}</p>
                <p className="text-sm text-muted-foreground"><span className="font-semibold">Best For:</span> {entry.bestFor}</p>
                <p className="text-sm text-muted-foreground"><span className="font-semibold">Notes:</span> {entry.notes}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 8: Mobility Gear */}
      <section id="summon-heroes-summon-banner-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksMobilityGear']} locale={locale}>{t.modules.lucidBlocksMobilityGear.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksMobilityGear.intro}</p>
          </div>
          <div className="scroll-reveal space-y-2">
            {t.modules.lucidBlocksMobilityGear.faqs.map((faq: any, index: number) => (
              <div key={index} className="border border-border rounded-xl overflow-hidden bg-white/5">
                <button
                  onClick={() => setBannerExpanded(bannerExpanded === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-[hsl(var(--nav-theme)/0.06)] transition-colors"
                >
                  <span className="font-semibold">
                    <LinkedTitle linkData={moduleLinkMap[`lucidBlocksMobilityGear::faqs::${index}`]} locale={locale}>
                      {faq.question}
                    </LinkedTitle>
                  </span>
                  <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform ${bannerExpanded === index ? "rotate-180" : ""}`} />
                </button>
                {bannerExpanded === index && (
                  <div className="px-5 pb-5 text-muted-foreground text-sm">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 6: 移动端横幅 320×50 */}
      <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />

      {/* Module 9: Traits Guide */}
      <section id="summon-heroes-traits-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-[hsl(var(--nav-theme)/0.12)] border border-[hsl(var(--nav-theme)/0.35)] text-[hsl(var(--nav-theme-light))] mb-4">
              {t.modules.lucidBlocksFarmingAndGrowth.eyebrow}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksFarmingAndGrowth']} locale={locale}>{t.modules.lucidBlocksFarmingAndGrowth.title}</LinkedTitle></h2>
            <p className="text-lg md:text-xl max-w-4xl mx-auto mb-4 text-[hsl(var(--nav-theme-light))]">{t.modules.lucidBlocksFarmingAndGrowth.subtitle}</p>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksFarmingAndGrowth.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.lucidBlocksFarmingAndGrowth.items.map((item: any, index: number) => {
              const icons = [TrendingUp, Sparkles, AlertTriangle, Check]
              const Icon = icons[index % icons.length]

              return (
                <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                    <h3 className="font-bold text-[hsl(var(--nav-theme-light))]">
                      <LinkedTitle linkData={moduleLinkMap[`lucidBlocksFarmingAndGrowth::items::${index}`]} locale={locale}>
                        {item.tier}
                      </LinkedTitle>
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.units.map((unit: string, unitIndex: number) => (
                      <span
                        key={unitIndex}
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]"
                      >
                        {unit}
                      </span>
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Module 10: PvP Tier List */}
      <section id="summon-heroes-pvp-tier-list" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-[hsl(var(--nav-theme)/0.12)] border border-[hsl(var(--nav-theme)/0.35)] text-[hsl(var(--nav-theme-light))] mb-4">
              {t.modules.lucidBlocksBestEarlyUnlocks.eyebrow}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksBestEarlyUnlocks']} locale={locale}>{t.modules.lucidBlocksBestEarlyUnlocks.title}</LinkedTitle></h2>
            <p className="text-lg md:text-xl max-w-4xl mx-auto mb-4 text-[hsl(var(--nav-theme-light))]">{t.modules.lucidBlocksBestEarlyUnlocks.subtitle}</p>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksBestEarlyUnlocks.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.lucidBlocksBestEarlyUnlocks.items.map((item: any, index: number) => {
              const icons = [Star, Hammer, Home, AlertTriangle]
              const Icon = icons[index % icons.length]

              return (
                <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                    <span className={`text-xs px-2 py-1 rounded-full border ${item.tier === 'S Tier' ? 'bg-[hsl(var(--nav-theme)/0.18)] border-[hsl(var(--nav-theme)/0.4)] text-[hsl(var(--nav-theme-light))]' : 'bg-[hsl(var(--nav-theme)/0.1)] border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]'}`}>
                      {item.tier}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.units.map((unit: string, unitIndex: number) => (
                      <span
                        key={unitIndex}
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]"
                      >
                        {unit}
                      </span>
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Module 11: Tournament Tier List */}
      <section id="summon-heroes-tournament-tier-list" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-[hsl(var(--nav-theme)/0.12)] border border-[hsl(var(--nav-theme)/0.35)] text-[hsl(var(--nav-theme-light))] mb-4">
              {t.modules.lucidBlocksAchievementTracker.eyebrow}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksAchievementTracker']} locale={locale}>{t.modules.lucidBlocksAchievementTracker.title}</LinkedTitle></h2>
            <p className="text-lg md:text-xl max-w-4xl mx-auto mb-4 text-[hsl(var(--nav-theme-light))]">{t.modules.lucidBlocksAchievementTracker.subtitle}</p>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksAchievementTracker.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.lucidBlocksAchievementTracker.items.map((item: any, index: number) => {
              const icons = [ClipboardCheck, Star, TrendingUp, Package]
              const Icon = icons[index % icons.length]

              return (
                <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                    <h3 className="font-bold text-[hsl(var(--nav-theme-light))]">
                      <LinkedTitle linkData={moduleLinkMap[`lucidBlocksAchievementTracker::items::${index}`]} locale={locale}>
                        {item.tier}
                      </LinkedTitle>
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.units.map((unit: string, unitIndex: number) => (
                      <span
                        key={unitIndex}
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]"
                      >
                        {unit}
                      </span>
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Module 12: Dungeons and Raids Guide */}
      <section id="summon-heroes-dungeons-raids-guide" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-[hsl(var(--nav-theme)/0.12)] border border-[hsl(var(--nav-theme)/0.35)] text-[hsl(var(--nav-theme-light))] mb-4">
              {t.modules.lucidBlocksSingleplayerAndPlatformFAQ.eyebrow}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksSingleplayerAndPlatformFAQ']} locale={locale}>{t.modules.lucidBlocksSingleplayerAndPlatformFAQ.title}</LinkedTitle></h2>
            <p className="text-lg md:text-xl max-w-4xl mx-auto mb-4 text-[hsl(var(--nav-theme-light))]">{t.modules.lucidBlocksSingleplayerAndPlatformFAQ.subtitle}</p>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksSingleplayerAndPlatformFAQ.intro}</p>
          </div>
          <div className="scroll-reveal space-y-4">
            {t.modules.lucidBlocksSingleplayerAndPlatformFAQ.items.map((item: any, index: number) => {
              const icons = [BookOpen, Check, TrendingUp, Package, Clock, ArrowRight]
              const Icon = icons[index % icons.length]

              return (
                <div
                  key={index}
                  className="flex gap-4 p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[hsl(var(--nav-theme)/0.2)] border-2 border-[hsl(var(--nav-theme)/0.5)] flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-[hsl(var(--nav-theme-light))] mb-1">{item.step}</p>
                    <h3 className="font-bold text-lg mb-2">
                      <LinkedTitle linkData={moduleLinkMap[`lucidBlocksSingleplayerAndPlatformFAQ::items::${index}`]} locale={locale}>
                        {item.title}
                      </LinkedTitle>
                    </h3>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Module 13: Summon Heroes Upgrade Guide */}
      <section id="summon-heroes-upgrade-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-[hsl(var(--nav-theme)/0.12)] border border-[hsl(var(--nav-theme)/0.35)] text-[hsl(var(--nav-theme-light))] mb-4">
              {t.modules.lucidBlocksSteamDeckAndController.eyebrow}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksSteamDeckAndController']} locale={locale}>{t.modules.lucidBlocksSteamDeckAndController.title}</LinkedTitle></h2>
            <p className="text-lg md:text-xl max-w-4xl mx-auto mb-4 text-[hsl(var(--nav-theme-light))]">{t.modules.lucidBlocksSteamDeckAndController.subtitle}</p>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksSteamDeckAndController.intro}</p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 space-y-4">
              {t.modules.lucidBlocksSteamDeckAndController.items.map((item: any, index: number) => {
                const stepIcons = [TrendingUp, Sparkles, Star, Hammer, ClipboardCheck, Package, Clock]
                const StepIcon = stepIcons[index % stepIcons.length]

                return (
                  <article
                    key={index}
                    className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[hsl(var(--nav-theme)/0.2)] border-2 border-[hsl(var(--nav-theme)/0.5)] flex items-center justify-center">
                        <StepIcon className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-wide text-[hsl(var(--nav-theme-light))] mb-1">
                          Step {item.step}
                        </p>
                        <h3 className="text-xl font-bold mb-2">
                          <LinkedTitle linkData={moduleLinkMap[`lucidBlocksSteamDeckAndController::items::${index}`]} locale={locale}>
                            {item.title}
                          </LinkedTitle>
                        </h3>
                        <p className="text-muted-foreground text-sm">{item.description}</p>
                      </div>
                    </div>

                    <ul className="space-y-2">
                      {item.highlights.map((highlight: string, highlightIndex: number) => (
                        <li key={highlightIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 mt-0.5 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                )
              })}
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start p-5 rounded-xl border border-[hsl(var(--nav-theme)/0.35)] bg-[hsl(var(--nav-theme)/0.08)]">
              <h3 className="text-lg font-bold text-[hsl(var(--nav-theme-light))] mb-3">
                Summon Heroes Upgrade Priorities
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 mt-0.5 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                  Keep one core carry and one durable frontline as your first major investment.
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 mt-0.5 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                  Save premium currency for high-impact banner windows instead of scattered pulls.
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 mt-0.5 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                  Delay heavy gear spending until your Epic-tier pieces start to stick.
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 mt-0.5 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                  Push Campaign before AFK claims to increase passive Summon Heroes income.
                </li>
              </ul>
            </aside>
          </div>
        </div>
      </section>

      {/* Module 14: Summon Heroes Best Units by Role */}
      <section id="summon-heroes-best-units-by-role" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-[hsl(var(--nav-theme)/0.12)] border border-[hsl(var(--nav-theme)/0.35)] text-[hsl(var(--nav-theme-light))] mb-4">
              {t.modules.lucidBlocksSettingsAndAccessibility.eyebrow}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksSettingsAndAccessibility']} locale={locale}>{t.modules.lucidBlocksSettingsAndAccessibility.title}</LinkedTitle></h2>
            <p className="text-lg md:text-xl max-w-4xl mx-auto mb-4 text-[hsl(var(--nav-theme-light))]">{t.modules.lucidBlocksSettingsAndAccessibility.subtitle}</p>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksSettingsAndAccessibility.intro}</p>
          </div>

          <div className="scroll-reveal hidden md:block overflow-hidden rounded-xl border border-border bg-white/5">
            <table className="w-full text-sm">
              <thead className="bg-[hsl(var(--nav-theme)/0.08)]">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Role</th>
                  <th className="text-left px-4 py-3 font-semibold">Best Units</th>
                  <th className="text-left px-4 py-3 font-semibold">Why It Works</th>
                  <th className="text-left px-4 py-3 font-semibold">Best Modes</th>
                </tr>
              </thead>
              <tbody>
                {t.modules.lucidBlocksSettingsAndAccessibility.items.map((item: any, index: number) => {
                  const roleIcons = [Star, Sparkles, ClipboardCheck, AlertTriangle, Package, BookOpen, TrendingUp, Home]
                  const RoleIcon = roleIcons[index % roleIcons.length]

                  return (
                    <tr key={index} className="border-t border-border/70 align-top hover:bg-[hsl(var(--nav-theme)/0.05)] transition-colors">
                      <td className="px-4 py-3 font-semibold text-[hsl(var(--nav-theme-light))]">
                        <div className="flex items-center gap-2">
                          <RoleIcon className="w-4 h-4" />
                          <LinkedTitle linkData={moduleLinkMap[`lucidBlocksSettingsAndAccessibility::items::${index}`]} locale={locale}>
                            {item.role}
                          </LinkedTitle>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        <div className="flex flex-wrap gap-1.5">
                          {item.best_units.map((unit: string, unitIndex: number) => (
                            <span
                              key={unitIndex}
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]"
                            >
                              {unit}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{item.why_it_works}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        <div className="flex flex-wrap gap-1.5">
                          {item.best_modes.map((mode: string, modeIndex: number) => (
                            <span
                              key={modeIndex}
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]"
                            >
                              {mode}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="scroll-reveal grid grid-cols-1 gap-4 md:hidden">
            {t.modules.lucidBlocksSettingsAndAccessibility.items.map((item: any, index: number) => {
              const roleIcons = [Star, Sparkles, ClipboardCheck, AlertTriangle, Package, BookOpen, TrendingUp, Home]
              const RoleIcon = roleIcons[index % roleIcons.length]

              return (
                <article key={index} className="p-5 bg-white/5 border border-border rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <RoleIcon className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                    <h3 className="font-bold text-[hsl(var(--nav-theme-light))]">{item.role}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{item.why_it_works}</p>
                  <p className="text-xs uppercase tracking-wide text-[hsl(var(--nav-theme-light))] mb-2">Best Units</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {item.best_units.map((unit: string, unitIndex: number) => (
                      <span
                        key={unitIndex}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]"
                      >
                        {unit}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs uppercase tracking-wide text-[hsl(var(--nav-theme-light))] mb-2">Best Modes</p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.best_modes.map((mode: string, modeIndex: number) => (
                      <span
                        key={modeIndex}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]"
                      >
                        {mode}
                      </span>
                    ))}
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* Module 15: Summon Heroes Endgame Progression */}
      <section id="summon-heroes-endgame-progression" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-[hsl(var(--nav-theme)/0.12)] border border-[hsl(var(--nav-theme)/0.35)] text-[hsl(var(--nav-theme-light))] mb-4">
              {t.modules.lucidBlocksUpdatesAndPatchNotes.eyebrow}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksUpdatesAndPatchNotes']} locale={locale}>{t.modules.lucidBlocksUpdatesAndPatchNotes.title}</LinkedTitle></h2>
            <p className="text-lg md:text-xl max-w-4xl mx-auto mb-4 text-[hsl(var(--nav-theme-light))]">{t.modules.lucidBlocksUpdatesAndPatchNotes.subtitle}</p>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksUpdatesAndPatchNotes.intro}</p>
          </div>

          <div className="scroll-reveal space-y-3">
            {t.modules.lucidBlocksUpdatesAndPatchNotes.items.map((item: any, index: number) => {
              const accordionIcons = [TrendingUp, Package, Clock, Sparkles, Star, ArrowRight, Home, Check]
              const AccordionIcon = accordionIcons[index % accordionIcons.length]

              return (
                <details key={index} className="group border border-border rounded-xl overflow-hidden bg-white/5">
                  <summary className="list-none w-full flex items-center justify-between p-5 cursor-pointer hover:bg-[hsl(var(--nav-theme)/0.06)] transition-colors">
                    <div className="flex items-center gap-3 pr-3">
                      <AccordionIcon className="w-5 h-5 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                      <span className="font-semibold">
                        <LinkedTitle linkData={moduleLinkMap[`lucidBlocksUpdatesAndPatchNotes::items::${index}`]} locale={locale}>
                          {item.question}
                        </LinkedTitle>
                      </span>
                    </div>
                    <ChevronDown className="w-5 h-5 flex-shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="px-5 pb-5 text-sm text-muted-foreground">
                    {item.answer}
                  </div>
                </details>
              )
            })}
          </div>
        </div>
      </section>

      {/* Module 16: Summon Heroes Update Log */}
      <section id="summon-heroes-update-log" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-[hsl(var(--nav-theme)/0.12)] border border-[hsl(var(--nav-theme)/0.35)] text-[hsl(var(--nav-theme-light))] mb-4">
              {t.modules.lucidBlocksCrashFixAndTroubleshooting.eyebrow}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksCrashFixAndTroubleshooting']} locale={locale}>{t.modules.lucidBlocksCrashFixAndTroubleshooting.title}</LinkedTitle></h2>
            <p className="text-lg md:text-xl max-w-4xl mx-auto mb-4 text-[hsl(var(--nav-theme-light))]">{t.modules.lucidBlocksCrashFixAndTroubleshooting.subtitle}</p>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksCrashFixAndTroubleshooting.intro}</p>
          </div>

          <div className="scroll-reveal space-y-3">
            {t.modules.lucidBlocksCrashFixAndTroubleshooting.items.map((item: any, index: number) => {
              const updateIcons = [Clock, Sparkles, Package, ClipboardCheck, TrendingUp, BookOpen, ArrowRight, AlertTriangle]
              const UpdateIcon = updateIcons[index % updateIcons.length]

              return (
                <details key={index} className="group border border-border rounded-xl overflow-hidden bg-white/5">
                  <summary className="list-none w-full flex items-center justify-between p-5 cursor-pointer hover:bg-[hsl(var(--nav-theme)/0.06)] transition-colors">
                    <div className="flex items-center gap-3 pr-3">
                      <UpdateIcon className="w-5 h-5 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                      <span className="font-semibold">
                        <LinkedTitle linkData={moduleLinkMap[`lucidBlocksCrashFixAndTroubleshooting::items::${index}`]} locale={locale}>
                          {item.question}
                        </LinkedTitle>
                      </span>
                    </div>
                    <ChevronDown className="w-5 h-5 flex-shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="px-5 pb-5 text-sm text-muted-foreground">
                    {item.answer}
                  </div>
                </details>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
          communityUrl={links.discord}
          gameUrl={links.playOnRoblox}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner type="banner-728x90" adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90} />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">{t.footer.description}</p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href={links.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href={links.x}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.twitter}
                  </a>
                </li>
                <li>
                  <a
                    href={links.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamCommunity}
                  </a>
                </li>
                <li>
                  <a
                    href={links.officialHub}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamStore}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">{t.footer.copyright}</p>
              <p className="text-xs text-muted-foreground">{t.footer.disclaimer}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
