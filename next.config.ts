import type { NextConfig } from "next";

// 独自ドメイン https://gomieru.jp をルート("/")から配信する構成。
// GitHub Pagesのプロジェクトサイト(https://<user>.github.io/<repo>/)を
// 使っていた際はbasePath/assetPrefixで/gomieruを付与していたが、
// 独自ドメイン移行後は不要になったため削除した。
const nextConfig: NextConfig = {
  trailingSlash: true,
  output: "export",
};

export default nextConfig;
