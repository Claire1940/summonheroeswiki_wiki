import type { Metadata } from 'next'
import { getLatestArticles } from '@/lib/getLatestArticles'
import { buildModuleLinkMap } from '@/lib/buildModuleLinkMap'
import type { Language } from '@/lib/content'
import { buildLanguageAlternates } from '@/lib/i18n-utils'
import { type Locale } from '@/i18n/routing'
import HomePageClient from './HomePageClient'

interface PageProps {
  params: Promise<{ locale: string }>
}

const OFFICIAL_LINKS = {
  officialHub: 'https://links.twinatlas.com/summonheroes',
  playOnRoblox: 'https://www.roblox.com/games/117381420723145/Summon-Heroes',
  developerGroup: 'https://www.roblox.com/communities/3758531/RedManta-LLC',
  discord: 'https://discord.gg/cAsazb4N4Z',
  x: 'https://x.com/SummonHeroes',
  youtube: 'https://www.youtube.com/@summonheroes',
}

const HOME_VIDEO = {
  videoId: 'h5N2lKTlKvE',
  title: 'Summon Heroes Official Trailer',
}

const HOME_TITLE = 'Summon Heroes Wiki - Codes, Tier List & Roblox Guides'
const HOME_DESCRIPTION =
  'Summon Heroes Wiki with updated codes, tier lists, beginner routes, starter units, banner planning, PvP and Tournament picks, dungeon farming, and endgame progression guides.'

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://summonheroeswiki.wiki'
  const heroImage = new URL('/images/hero.webp', siteUrl).toString()
  const canonicalUrl = locale === 'en' ? siteUrl : `${siteUrl}/${locale}`

  return {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    keywords: [
      'Summon Heroes',
      'Summon Heroes Wiki',
      'Roblox',
      'codes',
      'tier list',
      'starter units',
      'banner guide',
      'dungeons',
      'PvP',
      'Tournament',
      'traits',
    ],
    alternates: buildLanguageAlternates('/', locale as Locale, siteUrl),
    openGraph: {
      type: 'website',
      locale,
      url: canonicalUrl,
      siteName: 'Summon Heroes Wiki',
      title: HOME_TITLE,
      description: HOME_DESCRIPTION,
      images: [
        {
          url: heroImage,
          width: 1920,
          height: 1080,
          alt: 'Summon Heroes Wiki cover image',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: HOME_TITLE,
      description: HOME_DESCRIPTION,
      images: [heroImage],
    },
  }
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://summonheroeswiki.wiki'
  const heroImage = new URL('/images/hero.webp', siteUrl).toString()

  const homepageStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: "Summon Heroes Wiki",
        url: siteUrl,
        description: HOME_DESCRIPTION,
        inLanguage: "en",
        image: heroImage,
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        "name": "Summon Heroes Wiki",
        "url": siteUrl,
        "logo": `${siteUrl}/android-chrome-512x512.png`,
        "image": heroImage,
        sameAs: [
          OFFICIAL_LINKS.officialHub,
          OFFICIAL_LINKS.playOnRoblox,
          OFFICIAL_LINKS.developerGroup,
          OFFICIAL_LINKS.discord,
          OFFICIAL_LINKS.x,
          OFFICIAL_LINKS.youtube,
        ],
      },
      {
        "@type": "VideoGame",
        name: "Summon Heroes",
        gamePlatform: "Roblox",
        applicationCategory: "Game",
        genre: ["RPG", "Action", "PvP"],
        url: OFFICIAL_LINKS.playOnRoblox,
      },
    ],
  }

  // 服务器端获取最新文章数据
  const latestArticles = await getLatestArticles(locale as Language, 30)
  const moduleLinkMap = await buildModuleLinkMap(locale as Language)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageStructuredData) }}
      />
      <HomePageClient
        latestArticles={latestArticles}
        moduleLinkMap={moduleLinkMap}
        locale={locale}
        videoId={HOME_VIDEO.videoId}
        videoTitle={HOME_VIDEO.title}
        links={OFFICIAL_LINKS}
      />
    </>
  )
}
