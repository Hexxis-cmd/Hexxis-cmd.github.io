import { useEffect, useState } from 'react'
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
  const [blinking, setBlinking] = useState(false)

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
        role="img"
        aria-label="Hexxis ghost mascot"
      >
        <div className="ghost-body" />
        <img className="ghost-depth" src="/mascot/ghost-rpg.png" alt="" aria-hidden="true" />
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
