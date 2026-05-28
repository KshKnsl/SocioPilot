"use client";

import { TwitterLogoIcon, FacebookLogoIcon, InstagramLogoIcon, LinkedinLogoIcon, GlobeIcon } from "@phosphor-icons/react";
import { PlatformIconProps } from "@/lib/types";

export default function PlatformIcon({ platform, size = 16, className = "" }: PlatformIconProps) {
  if (!platform) return null;
  const key = platform.toLowerCase();

  switch (key) {
    case 'twitter':
    case 'x':
      return <TwitterLogoIcon size={size} weight="bold" className={className} />;
    case 'facebook':
      return <FacebookLogoIcon size={size} weight="bold" className={className} />;
    case 'instagram':
      return <InstagramLogoIcon size={size} weight="bold" className={className} />;
    case 'linkedin':
      return <LinkedinLogoIcon size={size} weight="bold" className={className} />;
    default:
      return <GlobeIcon size={size} weight="bold" className={className} />;
  }
}