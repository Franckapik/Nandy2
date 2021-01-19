import { Physics } from '@react-three/cannon'
import { Loader, Stats } from '@react-three/drei'
import React, { Suspense, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { Controls } from 'react-three-gui'
import { Cube } from './references/Cube'
import './styles.css'
import CameraTarget from './Tools/CameraTarget'
import { Ground } from './Tools/Ground'
import { Hud } from './Tools/Hud'
import ModalBox from './Tools/ModalBox'
import { Models } from './Tools/Models'
import Vehicle from './Tools/Vehicle'
import {Light} from './Tools/Light'

const App = () => {
  const [events, setEvents] = useState()
  const [debug, setDebug] = useState(false)
  const domContent = useRef()

  useEffect(()=> {
    if (window.location.pathname === '/debug') {
      setDebug(true);
    }
  })

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

            <Models />
            <Vehicle position={[-5, 5, 5]} />
            <Ground mode="basic" scale={1} parallaxFactor={-0.2} minLayers={8} maxLayers={30} />
            <Cube name="box1" />
            
          </Physics>

        </Controls.Canvas>
        <Suspense fallback="null">
          <ModalBox title={'Bienvenue sur Nature&You'} startup={false} />
          <div className="frontDiv" {...events} ref={domContent}>
            <Hud />
          </div>
        </Suspense>
        <Loader />
        {debug && (
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
