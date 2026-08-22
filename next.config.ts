import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    /* هر کیفیتی که در کد استفاده می‌شود باید اینجا اعلام شود؛
       از Next 16 کیفیت‌های اعلام‌نشده اخطار می‌دهند. */
    qualities: [75, 90],
  },
};

export default nextConfig;
