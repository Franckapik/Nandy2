import { Physics } from '@react-three/cannon'
import { HTML, Loader, Sky, Stats, useGLTF } from '@react-three/drei'
import React, { Suspense, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import useStore from './store'
import './styles.css'
import CameraTarget from './Tools/CameraTarget'
import Vehicle from './Tools/Vehicle'
import { Canvas } from 'react-three-fiber'
import ModalBox from './Tools/ModalBox'
import { Hud } from './Tools/Hud'
import { Cube } from './references/Cube'
import { Ground } from './Tools/Ground'
import { Models } from './Tools/Models'



const App = (props) => {
  const [events, setEvents] = useState()
  const domContent = useRef()

  return (
    <>

      <Canvas
        id="canvas"
        shadowMap
        gl={{ alpha: false }}
        onCreated={({ gl, events }) => {
          // Export canvas events, we will put them onto the scroll area
          setEvents(events)
        }}>
        >
        <CameraTarget />
        <hemisphereLight intensity={0.35} />
        <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={2} castShadow />
        <Sky
          distance={3000}
          turbidity={2}
          rayleigh={4}
          mieCoefficient={0.038}
          mieDirectionalG={0.85}
          sunPosition={[Math.PI, -10, 0]}
          exposure={5}
          azimuth={0.5}
        />
        <HTML center portal={domContent}>
          <div style={{ top: '2.55rem', fontSize: '2em', top: '4rem' }} >Hello</div>
        </HTML>
        <Physics>
          <Models />
          <Vehicle position={[-5, 5, 5]} rotation={[0, -Math.PI * 1.2, 0]} angularVelocity={[0, 0.5, 0]} />
          <Ground mode="basic" scale={1} parallaxFactor={-0.2} minLayers={8} maxLayers={30} />
          <Cube />
        </Physics>
      </Canvas>
      <Loader />
      <Suspense fallback="null">
        <ModalBox title={'Bienvenue sur Nature&You'} />
        <div className="frontDiv" {...events} ref={domContent}> 
        <Hud />
      </div>
      </Suspense>

    </>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
