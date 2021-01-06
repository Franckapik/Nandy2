import { Physics } from '@react-three/cannon'
import { Html, HTML, Loader, Stars, Stats } from '@react-three/drei'
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
import useStore from './store'

const Flower= (props) => {
const visible = useStore(state => state.visible);
const bulleOpacity = useStore((state) => state.bulleOpacity);
console.log(bulleOpacity);
  return (
    <group position={[-58, 2, 71]}>
                <Cube name="box1" position={[-10,0,0]}  />
{          visible &&      <HTML scaleFactor={30}  center >
        <div className="bulle" style={bulleOpacity} >
          Pont solitaire <br/>
il s’est trouvé un ami<br/>
le vent vagabond</div>
        </HTML>}
    </group>

  )

}

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
        <CameraTarget />
        <Physics>
          <IA />
          <Flower/>
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
