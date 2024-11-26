'use client'

import Image from 'next/image'

export default function Header() {
  return (
    <header className="relative w-full">
      <div className="w-full h-48 sm:h-64 md:h-80 lg:h-96 relative">
        <Image
          src="/images/christmas-lights-4string.png"
          alt="Christmas Lights"
          fill
          sizes="100vw"
          quality={75}
          priority
          loading="eager"
          className="object-cover w-full"
          style={{
            objectFit: 'cover',
          }}
        />
      </div>
      <div className="relative w-full -mt-12 sm:-mt-16 md:-mt-20 lg:-mt-24">
        <h1 className="text-4xl font-bold sm:text-6xl md:text-7xl font-great-vibes text-center text-burgundy tracking-wide animate-fade-in">
          Swanky Cocktail Party
        </h1>
        <p className="text-center font-bold mt-4 text-emerald font-playfair text-md sm:text-base md:text-lg tracking-widest uppercase">
          A Night of Holiday Cheer
        </p>
      </div>
    </header>
  )
}
