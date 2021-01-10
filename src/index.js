import { Physics } from '@react-three/cannon'
import { Html, Loader, Stars, Stats, useGLTF } from '@react-three/drei'
import React, { Suspense, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { Canvas, extend, useFrame } from 'react-three-fiber'
import { Light } from './Tools/Light'
import { Cube } from './references/Cube'
import './styles.css'
import CameraTarget from './Tools/CameraTarget'
import { Ground } from './Tools/Ground'
import { Hud } from './Tools/Hud'
import { IA } from './Tools/IA'
import ModalBox from './Tools/ModalBox'
import { Models } from './Tools/Models'
import Vehicle from './Tools/Vehicle'
import { Controls, useControl } from 'react-three-gui'
import useStore from './store'
import { Bubble } from './Tools/Bubble'
import { InstanciateMesh } from './Tools/InstanciateMesh'
import { useRandomFromNavmesh } from './hooks/useRandomFromNavmesh'
import * as THREE from 'three'

const App = () => {
  const [events, setEvents] = useState()
  const domContent = useRef()
  const isControlsOpen = useStore((state) => state.isControlsOpen)
  const randomPositions = useRandomFromNavmesh('/navmesh_applied.glb', 1000, 3);
  return (
    <>
      <Controls.Provider>
        <Controls.Canvas
          id="canvas"
          shadowMap
          gl={{ alpha: false }}
          onCreated={({ gl, events }) => {
            // Export canvas events, we will put them onto the scroll area
            setEvents(events)
          }}>
          <CameraTarget />
          <Physics gravity={[0, -10, 0]}>
            {/*<IA />*/}
            <Bubble position={[-65, 2, 65]} scale={30} Text={['Pont solitaire', <br />, 'il s’est trouvé un ami', <br />, 'le vent vagabond']}>
              <Cube name="box1" position={[8, 0, 3]} />
            </Bubble>
            <InstanciateMesh arrayOfPositions={randomPositions} meshUrl={'./traversant.glb'} nameMesh={'Herb'} maxNumber={1000} />
            <Models />
            <Vehicle position={[-5, 5, 5]} />
            <Ground mode="basic" scale={1} parallaxFactor={-0.2} minLayers={8} maxLayers={30} />
{/*             <Light />

 */}
       <ambientLight intensity={0.05} />

           </Physics>
        </Controls.Canvas>
        <Loader />
        <Suspense fallback="null">
          <ModalBox title={'Bienvenue sur Nature&You'} startup={false} />
          <div className="frontDiv" {...events} ref={domContent}>
            <Hud />
          </div>
        </Suspense>
        {isControlsOpen && (
          <>
            <Controls title="Controls du véhicule" collapsed={false} />
            <Stats showPanel={2} />{' '}
          </>
        )}
      </Controls.Provider>
    </>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
