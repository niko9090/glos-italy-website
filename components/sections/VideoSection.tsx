// Video Section Component
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import { isValidImage, safeImageUrl } from '@/lib/sanity/client'
import { useLanguage } from '@/lib/context/LanguageContext'
import RichText from '@/components/RichText'

interface VideoSectionProps {
  data: {
    title?: unknown
    subtitle?: unknown
    description?: unknown
    videoType?: string
    youtubeUrl?: string
    vimeoUrl?: string
    videoFile?: { asset?: { url?: string } }
    poster?: any
    autoplay?: boolean
    loop?: boolean
    controls?: boolean
    layout?: string
    textPosition?: string
    aspectRatio?: string
    rounded?: boolean
    shadow?: boolean
    backgroundColor?: string
  }
}

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
  return match ? match[1] : null
}

function getVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/)
  return match ? match[1] : null
}

const bgClasses: Record<string, string> = {
  white: 'bg-white',
  gray: 'bg-gray-50',
  dark: 'bg-gray-900',
}

export default function VideoSection({ data }: VideoSectionProps) {
  const [isPlaying, setIsPlaying] = useState(data.autoplay || false)

  const bgClass = bgClasses[data.backgroundColor || 'white']
  const textColor = data.backgroundColor?.includes('dark') ? 'text-white' : 'text-gray-900'
  const aspectRatio = data.aspectRatio?.replace('/', ' / ') || '16 / 9'

  const renderVideo = () => {
    if (data.videoType?.includes('youtube') && data.youtubeUrl) {
      const videoId = getYouTubeId(data.youtubeUrl)
      if (!videoId) return null

      return (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=${isPlaying ? 1 : 0}&loop=${data.loop ? 1 : 0}&controls=${data.controls ? 1 : 0}&rel=0`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      )
    }

    if (data.videoType?.includes('vimeo') && data.vimeoUrl) {
      const videoId = getVimeoId(data.vimeoUrl)
      if (!videoId) return null

      return (
        <iframe
          src={`https://player.vimeo.com/video/${videoId}?autoplay=${isPlaying ? 1 : 0}&loop=${data.loop ? 1 : 0}&controls=${data.controls ? 1 : 0}`}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      )
    }

    if (data.videoType?.includes('file') && data.videoFile?.asset?.url) {
      return (
        <video
          src={data.videoFile.asset.url}
          autoPlay={isPlaying}
          loop={data.loop}
          controls={data.controls}
          muted={data.autoplay}
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      )
    }

    return null
  }

  const videoContent = (
    <div
      className={`relative overflow-hidden ${data.rounded ? 'rounded-2xl' : ''} ${data.shadow ? 'shadow-2xl' : ''}`}
      style={{ aspectRatio }}
    >
      {!isPlaying && isValidImage(data.poster) ? (
        <>
          <Image
            src={safeImageUrl(data.poster, 1280, 720)!}
            alt=""
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsPlaying(true)}
              className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-xl"
            >
              <Play className="w-10 h-10 text-primary ml-1" fill="currentColor" />
            </motion.button>
          </div>
        </>
      ) : (
        renderVideo()
      )}
    </div>
  )

  const textContent = (data.title || data.subtitle || data.description) ? (
    <div className={textColor}>
      {data.title ? (
        <h2 className="section-title mb-4">
          <RichText value={data.title} />
        </h2>
      ) : null}
      {data.subtitle ? (
        <div className="section-subtitle mb-4">
          <RichText value={data.subtitle} />
        </div>
      ) : null}
      {data.description ? (
        <div className="prose prose-lg max-w-none">
          <RichText value={data.description} />
        </div>
      ) : null}
    </div>
  ) : null

  if (data.layout?.includes('side-text')) {
    return (
      <section className={`section ${bgClass}`}>
        <div className="container-glos">
          <div className={`grid lg:grid-cols-2 gap-12 items-center ${data.textPosition?.includes('right') ? '' : 'lg:grid-flow-dense'}`}>
            <div className={data.textPosition?.includes('right') ? 'lg:order-2' : ''}>
              {textContent}
            </div>
            <div className={data.textPosition?.includes('right') ? 'lg:order-1' : ''}>
              {videoContent}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={`section ${bgClass}`}>
      <div className={data.layout?.includes('full-width') ? '' : 'container-glos'}>
        {textContent && (
          <div className="text-center mb-12 max-w-3xl mx-auto px-4">
            {textContent}
          </div>
        )}
        <div className={data.layout?.includes('full-width') ? '' : 'max-w-5xl mx-auto'}>
          {videoContent}
        </div>
      </div>
    </section>
  )
}
