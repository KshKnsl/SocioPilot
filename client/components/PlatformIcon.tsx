"use client";

import { TwitterLogo, FacebookLogo, InstagramLogo, LinkedinLogo, Globe } from "@phosphor-icons/react";

interface PlatformIconProps {
  platform?: string | null;
  size?: number;
  className?: string;
}

export default function PlatformIcon({ platform, size = 16, className = "" }: PlatformIconProps) {
  if (!platform) return null;
  const key = platform.toLowerCase();

  switch (key) {
    case 'twitter':
    case 'x':
      return <TwitterLogo size={size} weight="bold" className={className} />;
    case 'facebook':
      return <FacebookLogo size={size} weight="bold" className={className} />;
    case 'instagram':
      return <InstagramLogo size={size} weight="bold" className={className} />;
    case 'linkedin':
    case 'linkedincompany':
      return <LinkedinLogo size={size} weight="bold" className={className} />;
    default:
      return <Globe size={size} weight="bold" className={className} />;
  }
}