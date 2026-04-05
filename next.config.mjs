import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
	async redirects() {
		return [
			{
				source: "/opengraph-image.png",
				destination: "/opengraph-image",
				permanent: false,
			},
		];
	},
};

export default withNextIntl(nextConfig);
