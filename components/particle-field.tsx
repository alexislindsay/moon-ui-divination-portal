"use client"
import { useEffect, useRef } from "react"

export default function ParticleField() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext("2d")!
    let anim: number
    const DPR = window.devicePixelRatio || 1
    const resize = () => {
      canvas.width = window.innerWidth * DPR
      canvas.height = window.innerHeight * DPR
    }
    resize()
    window.addEventListener("resize", resize)

    const dots = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
    }))

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = "rgba(255,255,255,0.7)"
      dots.forEach((d) => {
        d.x += d.vx
        d.y += d.vy
        if (d.x < 0 || d.x > canvas.width) d.vx *= -1
        if (d.y < 0 || d.y > canvas.height) d.vy *= -1
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fill()
      })
      anim = requestAnimationFrame(loop)
    }
    anim = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(anim)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return <canvas ref={ref} className="fixed inset-0 -z-10 opacity-60" aria-hidden />
}
