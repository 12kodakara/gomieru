import type { Metadata } from "next";
import { BIZ_UDPGothic } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";

// 自治体の生活情報冊子のような可読性・信頼感を優先し、UDフォントを採用。
// このフォントは400/700しか提供されないため、見出しもfont-boldまでに留める。
//
// preload: false の理由(パフォーマンス改善 第1回)。
// BIZ UDPGothicはGoogle Fonts側の subset 区分が "latin" しかなく、
// この1subsetの中に日本語ではほぼ使われないCJK拡張漢字まで含む
// 全Unicode-rangeが124ファイル×2ウェイト(計248ファイル)に分割されている。
// next/font/googleは既定(preload: true)だと、そのうち実際のページ内容に
// 関係なく大半のファイル(検証時点で122ファイル・約2MB)を毎回preloadしてしまう。
// preload: false にしても@font-face自体は残るため、
// 実際に画面上で使われる文字のUnicode-rangeに一致するファイルだけが
// 通常の優先度でオンデマンドに読み込まれるようになり、日本語表示・
// display:"swap"によるフォールバック挙動・レイアウトは変わらない。
const bizUDPGothic = BIZ_UDPGothic({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-biz-udp",
});

const DEFAULT_TITLE = `${SITE_TAGLINE}｜${SITE_NAME}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s｜${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`h-full ${bizUDPGothic.variable}`}>
      <body className="flex min-h-full flex-col bg-white font-sans text-gray-900 antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
