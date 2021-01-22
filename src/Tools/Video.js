import React, { useEffect, useMemo } from 'react'
import { useUpdate } from 'react-three-fiber'
import useSound from '../hooks/useSound'
import useStore from '../store'

const Video = React.memo((props) => {
  // Use memo to create persistent, memoized objects
  // In this case: create a new texture only when the url changes
  const changeTarget = useStore((state) => state.changeTarget)
  const playFlute = useSound('/flute.mp3')

  const video = useMemo(() => {
    const video = document.createElement('video')
    video.loop = true
    video.autoplay = true
    video.playsinline = true
    video.crossOrigin = 'anonymous'
    video.muted = true
    video.setAttribute('playsinline', '')
    video.setAttribute('webkit-playsinline', '')
    video.style = 'display: none'
    video.src = props.url
    return video
  }, [props.url])

  // video.play is a side-effect, this should be an effect
  useEffect(() => void video.play(), [props.url, video])

  // This effect scales meshes once (on mount)
  const geom = useUpdate((ref) => ref.scale(-1, 1, 1), [])

  return (
    <mesh {...props} onClick={(e) => { changeTarget(e.eventObject) }} onClick={() => playFlute.play()}>
      <planeBufferGeometry attach="geometry" ref={geom} args={[10, 5]} />
      <meshStandardMaterial attach="material">
        <videoTexture attach="map" args={[video]} />
      </meshStandardMaterial>
    </mesh>
  )
})

export default Video
