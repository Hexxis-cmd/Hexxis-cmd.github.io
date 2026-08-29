import { useEffect, useRef, useState } from 'react'
import { useHolidayTheme } from '../hooks/useHolidayTheme'

function accessoryPosition(index) {
  if (index < 0) return undefined
  const column = index % 4
  const row = Math.floor(index / 4)
  const steps = ['0%', '33.333%', '66.667%', '100%']
  return { backgroundPosition: `${steps[column]} ${steps[row]}` }
}

export default function Ghost() {
  const theme = useHolidayTheme()
  const stageRef = useRef(null)
  const [blinking, setBlinking] = useState(false)

  useEffect(() => {
    let frame
    const track = (event) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const stage = stageRef.current
        if (!stage) return
        const box = stage.getBoundingClientRect()
        const angle = Math.atan2(event.clientY - (box.top + box.height / 2), event.clientX - (box.left + box.width / 2))
        stage.style.setProperty('--eye-x', `${Math.cos(angle) * 5}px`)
        stage.style.setProperty('--eye-y', `${Math.sin(angle) * 5}px`)
      })
    }
    document.addEventListener('mousemove', track, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('mousemove', track)
    }
  }, [])

  useEffect(() => {
    let blinkTimer
    let openTimer
    const schedule = () => {
      blinkTimer = window.setTimeout(() => {
        setBlinking(true)
        openTimer = window.setTimeout(() => {
          setBlinking(false)
          schedule()
        }, 145)
      }, 2600 + Math.random() * 4200)
    }
    schedule()
    return () => {
      clearTimeout(blinkTimer)
      clearTimeout(openTimer)
    }
  }, [])

  return (
    <div className={`ghost-wrap ghost-${theme.id}`}>
      <div
        className="ghost-stage"
        data-effect={theme.effect}
        ref={stageRef}
        role="img"
        aria-label="Hexxis ghost mascot"
      >
        <div className="ghost-body" />
        <img className="ghost-depth" src="/mascot/ghost-detailed.png" alt="" aria-hidden="true" />
        <div className={`ghost-eyes${blinking ? ' is-blinking' : ''}`} aria-hidden="true">
          <span /><span />
        </div>
        <div className="ghost-mouth" aria-hidden="true" />
        {theme.accessory >= 0 && <div className="ghost-accessory" style={accessoryPosition(theme.accessory)} aria-hidden="true" />}
        {theme.effect && <div className="ghost-particles" aria-hidden="true">{Array.from({ length: 8 }, (_, index) => <i key={index} />)}</div>}
      </div>
    </div>
  )
}
