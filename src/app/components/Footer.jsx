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
          sizes="100vw"
          quality={75}
          loading="lazy"
          className="object-cover"
          style={{
            objectFit: 'cover',
          }}
        />
      </div>
    </footer>
  );
}
