// Video Section Component
'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react'
import { isValidImage, safeImageUrl } from '@/lib/sanity/client'
import RichText from '@/components/RichText'
import {
  MOTION,
  fadeInUp,
  scaleIn,
  staggerContainer,
  staggerItem
} from '@/lib/animations/config'

interface VideoSectionProps {
  documentId?: string
  sectionKey?: string
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
    muted?: boolean
    controls?: boolean
    layout?: string
    textPosition?: string
    aspectRatio?: string
    rounded?: boolean
    shadow?: boolean
    backgroundColor?: string
    showPlayButton?: boolean
    playButtonSize?: 'small' | 'medium' | 'large'
    playButtonStyle?: 'solid' | 'outline' | 'glass'
    overlayColor?: string
    overlayOpacity?: number
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

// Animazione pulse per il pulsante play
const pulseAnimation = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.08, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

// Animazione pulse per il ring esterno
const ringPulseAnimation = {
  initial: { scale: 1, opacity: 0.5 },
  animate: {
    scale: [1, 1.4, 1.8],
    opacity: [0.5, 0.25, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeOut',
    },
  },
}

// Animazione fade-in + scale per il video player
const videoPlayerAnimation = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: MOTION.DURATION.SLOW,
      ease: MOTION.EASE.OUT,
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: MOTION.DURATION.FAST,
    }
  },
}

// Dimensioni pulsante play
const playButtonSizes = {
  small: { button: 'w-14 h-14', icon: 'w-6 h-6' },
  medium: { button: 'w-20 h-20', icon: 'w-10 h-10' },
  large: { button: 'w-28 h-28', icon: 'w-14 h-14' },
}

// Stili pulsante play
const playButtonStyles = {
  solid: 'bg-white text-primary',
  outline: 'bg-transparent border-4 border-white text-white',
  glass: 'bg-white/20 backdrop-blur-md text-white border border-white/30',
}

export default function VideoSection({ data, documentId, sectionKey }: VideoSectionProps) {
  const [isPlaying, setIsPlaying] = useState(data.autoplay || false)
  const [isMuted, setIsMuted] = useState(data.muted || data.autoplay || false)
  const [showControls, setShowControls] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const bgClass = bgClasses[data.backgroundColor || 'white']
  const textColor = data.backgroundColor?.includes('dark') ? 'text-white' : 'text-gray-900'
  const aspectRatio = data.aspectRatio?.replace('/', ' / ') || '16 / 9'

  const buttonSize = playButtonSizes[data.playButtonSize || 'medium']
  const buttonStyle = playButtonStyles[data.playButtonStyle || 'solid']
  const overlayOpacity = data.overlayOpacity ?? 30

  // Gestisce play/pause per video locali
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play()
      } else {
        videoRef.current.pause()
      }
    }
  }, [isPlaying])

  // Gestisce mute per video locali
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted
    }
  }, [isMuted])

  const handlePlayClick = () => {
    setIsPlaying(true)
  }

  const handleVideoClick = () => {
    if (data.videoType?.includes('file')) {
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMuted(!isMuted)
  }

  const handleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen()
      }
    }
  }

  const renderVideo = () => {
    if (data.videoType?.includes('youtube') && data.youtubeUrl) {
      const videoId = getYouTubeId(data.youtubeUrl)
      if (!videoId) return null

      const muteParam = isMuted ? '&mute=1' : ''
      return (
        <motion.iframe
          {...videoPlayerAnimation}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=${isPlaying ? 1 : 0}&loop=${data.loop ? 1 : 0}&controls=${data.controls !== false ? 1 : 0}&rel=0${muteParam}${data.loop ? `&playlist=${videoId}` : ''}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      )
    }

    if (data.videoType?.includes('vimeo') && data.vimeoUrl) {
      const videoId = getVimeoId(data.vimeoUrl)
      if (!videoId) return null

      const muteParam = isMuted ? '&muted=1' : ''
      return (
        <motion.iframe
          {...videoPlayerAnimation}
          src={`https://player.vimeo.com/video/${videoId}?autoplay=${isPlaying ? 1 : 0}&loop=${data.loop ? 1 : 0}&controls=${data.controls !== false ? 1 : 0}${muteParam}`}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      )
    }

    if (data.videoType?.includes('file') && data.videoFile?.asset?.url) {
      return (
        <motion.div
          {...videoPlayerAnimation}
          className="absolute inset-0 w-full h-full"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          <video
            ref={videoRef}
            src={data.videoFile.asset.url}
            autoPlay={isPlaying}
            loop={data.loop}
            muted={isMuted}
            playsInline
            onClick={handleVideoClick}
            className="absolute inset-0 w-full h-full object-cover cursor-pointer"
          />

          {/* Custom Controls Overlay per video locali */}
          <AnimatePresence>
            {(showControls || !isPlaying) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"
              >
                {/* Bottom Controls */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying) }}
                      className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5 ml-0.5" />
                      )}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={toggleMute}
                      className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </motion.button>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleFullscreen}
                    className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                  >
                    <Maximize className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )
    }

    return null
  }

  const videoContent = (
    <motion.div
      variants={scaleIn}
      initial="initial"
      whileInView="animate"
      viewport={MOTION.VIEWPORT.ONCE}
      transition={{ duration: MOTION.DURATION.SLOW, ease: MOTION.EASE.OUT }}
      className={`relative overflow-hidden ${data.rounded ? 'rounded-2xl' : ''} ${data.shadow ? 'shadow-2xl' : ''}`}
      style={{ aspectRatio }}
    >
      <AnimatePresence mode="wait">
        {!isPlaying && (data.showPlayButton !== false) ? (
          <motion.div
            key="poster"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: MOTION.DURATION.NORMAL }}
            className="absolute inset-0"
          >
            {isValidImage(data.poster) && (
              <Image
                src={safeImageUrl(data.poster, 1280, 720)!}
                alt=""
                fill
                className="object-cover"
              />
            )}

            {/* Overlay con colore e opacita personalizzabili */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                backgroundColor: data.overlayColor
                  ? `${data.overlayColor}${Math.round(overlayOpacity * 2.55).toString(16).padStart(2, '0')}`
                  : `rgba(0, 0, 0, ${overlayOpacity / 100})`
              }}
            >
              {/* Pulsante Play con animazione pulse */}
              <div className="relative">
                {/* Ring animato esterno */}
                <motion.div
                  {...ringPulseAnimation}
                  className={`absolute inset-0 ${buttonSize.button} rounded-full ${
                    data.playButtonStyle === 'outline'
                      ? 'border-4 border-white'
                      : data.playButtonStyle === 'glass'
                        ? 'bg-white/10'
                        : 'bg-white/30'
                  }`}
                />

                {/* Pulsante principale */}
                <motion.button
                  variants={pulseAnimation}
                  initial="initial"
                  animate="animate"
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePlayClick}
                  className={`relative ${buttonSize.button} ${buttonStyle} rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:shadow-2xl`}
                >
                  <Play className={`${buttonSize.icon} ml-1`} fill="currentColor" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="video"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0"
          >
            {renderVideo()}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )

  const textContent = (data.title || data.subtitle || data.description) ? (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={MOTION.VIEWPORT.ONCE}
      className={textColor}
    >
      {data.title ? (
        <motion.h2
          variants={staggerItem}
          className="section-title mb-4"
        >
          <RichText value={data.title} />
        </motion.h2>
      ) : null}
      {data.subtitle ? (
        <motion.div
          variants={staggerItem}
          className="section-subtitle mb-4"
        >
          <RichText value={data.subtitle} />
        </motion.div>
      ) : null}
      {data.description ? (
        <motion.div
          variants={staggerItem}
          className="prose prose-lg max-w-none"
        >
          <RichText value={data.description} />
        </motion.div>
      ) : null}
    </motion.div>
  ) : null

  if (data.layout?.includes('side-text')) {
    return (
      <section data-sanity-edit-target className={`section ${bgClass}`}>
        <div className="container-glos">
          <div className={`grid lg:grid-cols-2 gap-12 items-center ${data.textPosition?.includes('right') ? '' : 'lg:grid-flow-dense'}`}>
            <motion.div
              className={data.textPosition?.includes('right') ? 'lg:order-2' : ''}
              variants={data.textPosition?.includes('right') ? fadeInUp : fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={MOTION.VIEWPORT.ONCE}
              transition={{ duration: MOTION.DURATION.SLOW, ease: MOTION.EASE.OUT }}
            >
              {textContent}
            </motion.div>
            <div className={data.textPosition?.includes('right') ? 'lg:order-1' : ''}>
              {videoContent}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section data-sanity-edit-target className={`section ${bgClass}`}>
      <div className={data.layout?.includes('full-width') ? '' : 'container-glos'}>
        {textContent && (
          <motion.div
            className="text-center mb-12 max-w-3xl mx-auto px-4"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={MOTION.VIEWPORT.ONCE}
            transition={{ duration: MOTION.DURATION.SLOW, ease: MOTION.EASE.OUT }}
          >
            {textContent}
          </motion.div>
        )}
        <div className={data.layout?.includes('full-width') ? '' : 'max-w-5xl mx-auto'}>
          {videoContent}
        </div>
      </div>
    </section>
  )
}
