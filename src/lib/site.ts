import type { Metadata } from "next";

export const SITE_NAME = "ごみえる";

export const SITE_TAGLINE = "ごみ分別・捨て方検索";

export const SITE_DESCRIPTION =
  "自治体ごとのごみの分別・リサイクル・捨て方を検索できるサイトです。あなたの街のごみの捨て方をすぐに調べられます。";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gomieru.jp";

/**
 * ページ個別のopenGraphを指定すると、Next.jsはレイアウト側のopenGraph
 * (siteName/locale/type)を継承せず丸ごと上書きしてしまう。そのため各ページの
 * generateMetadataでは、必ずこのヘルパー経由でopenGraphを組み立てる。
 */
export function buildOpenGraph(title: string, description: string): Metadata["openGraph"] {
  return {
    type: "website",
    locale: "ja_JP",
    siteName: SITE_NAME,
    title,
    description,
  };
}

export const DISCLAIMER_TEXT =
  "ごみの分別・回収方法は変更される場合があります。最終的な判断は自治体公式情報をご確認ください。";

/**
 * お問い合わせ窓口（Googleフォームの回答用URL）。個人メールアドレスは公開しない方針のため、
 * 問い合わせはこのフォームに一本化している。共有ダイアログが付与する ?usp=publish-editor は
 * 公開には不要な計測用パラメータなので付けない。
 */
export const CONTACT_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScGWA5gztNpJL-jh9lPikP6Wm3S6aOoDP40rYrec_QgHU_bOg/viewform";
