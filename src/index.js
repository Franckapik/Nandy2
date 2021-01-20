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
import { createRef } from 'react'
import useStore from './store'

const App = () => {
  const [events, setEvents] = useState()
  const [debug, setDebug] = useState(false)
  const domContent = useRef()
  const scrollArea = useRef()
  const state = {
    sections: 5,
    pages: 3,
    zoom: 1,
    top: createRef()
  }
  // no space-bar pageDown
  window.onkeydown=function(e){
    if(e.keyCode==32){
     return false;
    }
  };

  const onScroll = (e) => (
    useStore.getState().top = e.target.scrollTop,
console.log(useStore.getState().top)
    )
  useEffect(() => {
    void onScroll({ target: scrollArea.current })
    console.log(state);
  }, [])

  useEffect(() => {
    if (window.location.pathname === '/debug') {
      setDebug(true)
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
          {/*             <Light /> */}
          <ambientLight intensity={0.05} />
        </Controls.Canvas>
        <Suspense fallback="null">
          <ModalBox title={'Bienvenue sur Nature&You'} startup={false} />

          <div className="scrollArea" ref={scrollArea} onScroll={onScroll} {...events}>
            <div className="frontDiv" ref={domContent}>
              <Hud />
            </div>
            <div style={{ height: `${state.pages * 100}vh`}} />
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
