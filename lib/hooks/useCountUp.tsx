// Hook for animated count-up numbers
'use client'

import { useState, useEffect, useRef } from 'react'

interface UseCountUpOptions {
  start?: number
  end: number
  duration?: number
  decimals?: number
  prefix?: string
  suffix?: string
}

export function useCountUp({
  start = 0,
  end,
  duration = 2000,
  decimals = 0,
  prefix = '',
  suffix = '',
}: UseCountUpOptions) {
  const [count, setCount] = useState(start)
  const [isInView, setIsInView] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLElement>(null)

  // Intersection Observer to detect when element is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsInView(true)
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [hasAnimated])

  // Animation logic
  useEffect(() => {
    if (!isInView || hasAnimated) return

    setHasAnimated(true)
    const startTime = Date.now()
    const difference = end - start

    const tick = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentValue = start + difference * easeOut

      setCount(currentValue)

      if (progress < 1) {
        requestAnimationFrame(tick)
      } else {
        setCount(end)
      }
    }

    requestAnimationFrame(tick)
  }, [isInView, hasAnimated, start, end, duration])

  const formattedValue = `${prefix}${count.toFixed(decimals)}${suffix}`

  return { ref, count, formattedValue, isInView }
}

// Simple component for count-up display
export function CountUp({
  end,
  duration = 2000,
  suffix = '',
  prefix = '',
  className = '',
}: {
  end: number
  duration?: number
  suffix?: string
  prefix?: string
  className?: string
}) {
  const { ref, formattedValue } = useCountUp({
    end,
    duration,
    suffix,
    prefix,
  })

  return (
    <span ref={ref as React.RefObject<HTMLSpanElement>} className={className}>
      {formattedValue}
    </span>
  )
}
