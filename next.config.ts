import type { NextConfig } from "next";

// GitHub Pagesのプロジェクトサイトは https://<user>.github.io/<repo>/ のように
// サブパス配下で配信されるため、GitHub Actions側で GITHUB_PAGES=true を渡したときだけ
// basePath/assetPrefix を有効にする。
// 独自ドメイン(gomieru.jp)へ切り替える際は、この環境変数を設定しない（外す）だけでよい。
const isGithubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGithubPages ? "/gomieru" : "";

const nextConfig: NextConfig = {
  trailingSlash: true,
  output: "export",
  ...(basePath ? { basePath, assetPrefix: `${basePath}/` } : {}),
};

export default nextConfig;
