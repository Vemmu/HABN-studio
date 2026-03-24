"use client";

import { ExternalLink } from "lucide-react";

const ZOOM = 18;

interface Branch {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone?: string | null;
  email?: string | null;
}

function getEmbedUrl(lat: number, lng: number): string {
  return `https://maps.google.com/maps?q=${lat},${lng}&z=${ZOOM}&output=embed`;
}

function getDirectionsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

export default function MapCard({ branch }: { branch: Branch }) {
  return (
    <div className="bg-white rounded-3xl border border-stone-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-primary-100 transition-all duration-500">
      <div className="p-5 border-b border-stone-100 flex flex-wrap items-center justify-between gap-4">
        <h3 className="font-display font-semibold text-stone-800">
          {branch.name}
        </h3>
        <a
          href={getDirectionsUrl(branch.lat, branch.lng)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 text-white text-sm font-medium rounded-xl hover:bg-stone-800 transition-colors"
        >
          Get directions
          <ExternalLink size={16} />
        </a>
      </div>
      <div className="relative aspect-square min-h-[350px] bg-stone-100">
        <iframe
          src={getEmbedUrl(branch.lat, branch.lng)}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`${branch.name} - Branch Location`}
          className="absolute inset-0 w-full h-full"
        />
      </div>
      <p className="p-3 text-xs text-stone-500 text-center bg-stone-50/80">
        {branch.address}
      </p>
    </div>
  );
}
