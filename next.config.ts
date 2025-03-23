import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      // News sites
      'platform.theverge.com',
      'image.cnbcfm.com',
      'techcrunch.com',
      'www.theverge.com',
      'cdn.vox-cdn.com',
      'media.wired.com',
      'static01.nyt.com',
      'www.reuters.com',
      'www.bloomberg.com',
      'www.newsbtc.com',
      'images.cointelegraph.com',
      'img.etimg.com',
      'c.ndtvimg.com',
      'cdn.mos.cms.futurecdn.net',
      'ichef.bbci.co.uk',
      'www.deccanherald.com',
      'media-cldnry.s-nbcnews.com',
      's.yimg.com',
      'media.npr.org',
      'media.cnn.com',
      'a57.foxnews.com',
      'assets.bwbx.io',
      'nypost.com',
      'www.washingtonpost.com',
      'www.aljazeera.com',
      's.abcnews.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
