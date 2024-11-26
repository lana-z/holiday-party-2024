'use client'

import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="relative">
      <div className="w-full h-48 sm:h-64 md:h-80 lg:h-96 relative">
        <Image
          src="/images/greenery.png"
          alt="Holiday Greenery"
          fill
          className="object-cover"
          priority
        />
      </div>
    </footer>
  );
}
