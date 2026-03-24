import React from 'react';

export const HaircutIllustration = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Blue Comb */}
    <path d="M75 15 L85 25 L50 60 L40 50 Z" fill="#3B82F6" />
    <path d="M75 15 L78 20 L43 55 L40 50 Z" fill="#2563EB" /> {/* Shadow */}
    {/* Comb Teeth */}
    <path d="M72 18 L68 22 M67 23 L63 27 M62 28 L58 32 M57 33 L53 37 M52 38 L48 42 M47 43 L43 47" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
    
    {/* Scissors Handle Red */}
    <circle cx="30" cy="70" r="8" stroke="#EF4444" strokeWidth="4" />
    <circle cx="50" cy="80" r="8" stroke="#EF4444" strokeWidth="4" />
    
    {/* Scissors Blades Silver */}
    <path d="M36 64 L75 35" stroke="#9CA3AF" strokeWidth="4" strokeLinecap="round" />
    <path d="M46 73 L70 45" stroke="#9CA3AF" strokeWidth="4" strokeLinecap="round" />
    {/* Screw */}
    <circle cx="53" cy="51" r="2" fill="#4B5563" />
  </svg>
);

export const HairColorIllustration = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Bottle Body */}
    <rect x="35" y="30" width="30" height="50" rx="4" fill="#E76F51" />
    <rect x="35" y="30" width="10" height="50" rx="4" fill="#F4A261" />
    <rect x="45" y="30" width="10" height="50" fill="#E76F51" />
    {/* Label */}
    <rect x="40" y="50" width="20" height="20" rx="2" fill="#FFFFFF" />
    <circle cx="50" cy="60" r="6" fill="#264653" />
    {/* Cap */}
    <path d="M40 30 L40 20 C40 18 45 15 50 15 C55 15 60 18 60 20 L60 30 Z" fill="#2A9D8F" />
    <rect x="40" y="27" width="20" height="3" fill="#264653" />
    <path d="M50 15 L50 8 C50 6 52 4 55 4 L65 4" stroke="#264653" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

export const FacialIllustration = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Face Base */}
    <circle cx="50" cy="50" r="35" fill="#FFD1B3" />
    {/* Mask Base (Green) */}
    <path d="M15 50 C15 30 30 15 50 15 C70 15 85 30 85 50 C85 62 80 72 70 78 C65 80 60 81 50 81 C40 81 35 80 30 78 C20 72 15 62 15 50 Z" fill="#A7F3D0" />
    {/* Hair Towel */}
    <path d="M20 30 C30 10 70 10 80 30 C85 20 60 -5 40 5 C25 15 15 20 20 30 Z" fill="#FFFFFF" />
    <circle cx="50" cy="15" r="10" fill="#F3F4F6" />
    {/* Cucumber Eyes */}
    <circle cx="35" cy="45" r="10" fill="#34D399" />
    <circle cx="35" cy="45" r="6" fill="#10B981" />
    <circle cx="65" cy="45" r="10" fill="#34D399" />
    <circle cx="65" cy="45" r="6" fill="#10B981" />
    {/* Nose and Mouth */}
    <path d="M50 55 C52 55 53 58 50 60" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
    <path d="M45 68 C45 68 50 72 55 68" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const EyebrowIllustration = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Eye Shape */}
    <path d="M20 60 C35 40 65 40 80 60 C65 80 35 80 20 60 Z" fill="#FFFFFF" />
    {/* Iris & Pupil */}
    <circle cx="50" cy="60" r="12" fill="#8B5CF6" />
    <circle cx="50" cy="60" r="5" fill="#1F2937" />
    <circle cx="47" cy="57" r="3" fill="#FFFFFF" />
    {/* Lashes */}
    <path d="M25 55 L20 48 M35 48 L32 40 M50 45 L50 35 M65 48 L68 40 M75 55 L80 48" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" />
    {/* Perfect Eyebrow */}
    <path d="M15 35 C40 15 65 20 85 45" stroke="#4B5563" strokeWidth="6" strokeLinecap="round" />
    {/* Thread */}
    <path d="M10 10 L45 25 L90 15" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" />
    <circle cx="45" cy="25" r="4" fill="#3B82F6" />
  </svg>
);

export const CleanupIllustration = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Face/Splash Base */}
    <circle cx="50" cy="55" r="30" fill="#FFD1B3" />
    <path d="M50 25 C30 25 20 40 20 55 C20 71.5 33.5 85 50 85 C66.5 85 80 71.5 80 55 C80 40 70 25 50 25 Z" fill="#FFE0C2" />
    
    {/* Water Splash Overlays */}
    <path d="M10 50 C20 40 30 50 35 60 C40 70 20 80 10 60 C0 40 10 50 10 50 Z" fill="#60A5FA" opacity="0.8" />
    <path d="M90 40 C80 30 70 40 65 50 C60 60 80 70 90 50 C100 30 90 40 90 40 Z" fill="#3B82F6" opacity="0.8" />
    {/* Bubbles */}
    <circle cx="80" cy="25" r="6" fill="#93C5FD" opacity="0.8" />
    <circle cx="85" cy="15" r="3" fill="#BFDBFE" opacity="0.8" />
    <circle cx="20" cy="20" r="8" fill="#93C5FD" opacity="0.8" />
    {/* Subtle Eyes closed */}
    <path d="M35 50 C40 52 45 50 45 50" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
    <path d="M55 50 C55 50 60 52 65 50" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const GroomingIllustration = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Mustache */}
    <path d="M50 40 C30 40 10 55 15 65 C20 75 35 60 50 60 C65 60 80 75 85 65 C90 55 70 40 50 40 Z" fill="#451A03" />
    <path d="M50 45 C30 45 20 55 20 60 C25 65 35 55 50 55 C65 55 75 65 80 60 C80 55 70 45 50 45 Z" fill="#78350F" />
    {/* Shaving Brush */}
    <rect x="35" y="15" width="10" height="20" rx="2" fill="#9CA3AF" />
    <path d="M35 15 L30 5 L50 5 L45 15 Z" fill="#FCD34D" />
    {/* Classic Razor */}
    <path d="M75 10 L65 20 L75 30 L85 20 Z" fill="#D1D5DB" />
    <path d="M70 15 L80 25" stroke="#4B5563" strokeWidth="2" />
    <rect x="75" y="30" width="4" height="25" rx="2" fill="#1F2937" transform="rotate(-45 75 30)" />
  </svg>
);

export const SpaIllustration = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Massage Stones */}
    <ellipse cx="40" cy="70" rx="25" ry="15" fill="#4B5563" />
    <ellipse cx="65" cy="75" rx="20" ry="12" fill="#6B7280" />
    <ellipse cx="50" cy="60" rx="22" ry="14" fill="#374151" />
    {/* Pink Lotus */}
    <path d="M50 50 C40 30 20 30 20 30 C20 30 30 50 50 50 Z" fill="#F9A8D4" />
    <path d="M50 50 C60 30 80 30 80 30 C80 30 70 50 50 50 Z" fill="#F9A8D4" />
    <path d="M50 50 C50 20 60 10 60 10 C60 10 40 20 50 50 Z" fill="#F472B6" />
    <path d="M50 50 C50 20 40 10 40 10 C40 10 60 20 50 50 Z" fill="#F472B6" />
    {/* Center Flame/glow */}
    <path d="M50 50 C45 40 50 30 50 30 C50 30 55 40 50 50 Z" fill="#FCD34D" />
  </svg>
);

export const BleachIllustration = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Mixing Bowl (Silver/Cyan) */}
    <path d="M20 45 L80 45 C75 75 60 85 50 85 C40 85 25 75 20 45 Z" fill="#9CA3AF" />
    <path d="M25 45 L75 45 C70 65 60 75 50 75 C40 75 30 65 25 45 Z" fill="#D1D5DB" />
    {/* Bleach Cream inside */}
    <ellipse cx="50" cy="45" rx="30" ry="10" fill="#FEF08A" />
    <ellipse cx="50" cy="45" rx="25" ry="7" fill="#FEF9C3" />
    {/* Mixing Brush */}
    <path d="M45 45 L35 15 L45 10 L55 45 Z" fill="#1F2937" />
    <path d="M40 15 L50 15 L55 5 L35 5 Z" fill="#6366F1" />
    {/* Sparkles */}
    <path d="M75 20 L80 10 L85 20 L95 25 L85 30 L80 40 L75 30 L65 25 Z" fill="#FBBF24" />
    <circle cx="20" cy="20" r="4" fill="#FCD34D" />
  </svg>
);
