import { Physics } from '@react-three/cannon'
import { Html, Loader, Stars, Stats } from '@react-three/drei'
import React, { Suspense, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { Canvas, extend } from 'react-three-fiber'
import { Light } from './Tools/Light'
import { Cube } from './references/Cube'
import './styles.css'
import CameraTarget from './Tools/CameraTarget'
import { Ground } from './Tools/Ground'
import { Hud } from './Tools/Hud'
import { IA } from './Tools/IA'
import ModalBox from './Tools/ModalBox'
import { Models } from './Tools/Models'
import { NavMeshRandom } from './Tools/NavMeshRandom'
import Vehicle from './Tools/Vehicle'
import { Bubble } from './Tools/Bubble'

const App = () => {
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
        <CameraTarget />
        <Physics>
          <IA />
          <Bubble position={[-65, 2, 65]} scale={30} Text={['Pont solitaire', <br />, 'il s’est trouvé un ami', <br />, 'le vent vagabond']}>
            <Cube name="box1" position={[8, 0, 3]} />
          </Bubble>
          <NavMeshRandom urlnav={'/navmesh_applied.glb'} urlGltf={'./traversant.glb'} max={1000} nameMesh={'Herb'} />
          <Models />
          <Vehicle position={[-5, 5, 5]} angularVelocity={[0, 0.5, 0]} />
          <Ground mode="basic" scale={1} parallaxFactor={-0.2} minLayers={8} maxLayers={30} />
          <Light />
        </Physics>
      </Canvas>

      <Stats showPanel={2} />
      <Loader />
      <Suspense fallback="null">
        <ModalBox title={'Bienvenue sur Nature&You'} startup={false} />
        <div className="frontDiv" {...events} ref={domContent}>
          <Hud />
        </div>
      </Suspense>
    </>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
