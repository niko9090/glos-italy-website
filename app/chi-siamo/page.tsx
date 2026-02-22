import { Metadata } from 'next'
import ChiSiamoClient from './ChiSiamoClient'

export const metadata: Metadata = {
  title: 'Chi Siamo | GLOS Italy - Ingegneria Meccanica Made in Italy',
  description: 'Scopri GL.OS: dal 2005 progettiamo e produciamo macchinari di precisione per il settore delle vernici. Oltre 20 anni di innovazione dalla Motor Valley.',
  openGraph: {
    title: 'Chi Siamo | GLOS Italy',
    description: 'Dal cuore della Motor Valley, ingegneria meccanica e innovazione Made in Italy.',
    images: ['/images/glos-blender.jpg'],
  },
}

export default function ChiSiamoPage() {
  return <ChiSiamoClient />
}
