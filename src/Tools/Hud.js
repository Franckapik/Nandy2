import React from 'react'
import useStore from '../store'
import useEmpty from '../hooks/useEmpty'
import { slide as Menu } from 'react-burger-menu'

export const Hud = ({ name }) => {
  const changeVehiclePos = useStore((state) => state.changeVehiclePos)
  const toggleControls = useStore(state => state.toggleControls)
  const pos2 = useEmpty('origin2Game')
  const pos3 = useEmpty('origin3Cinema')
  const pos4 = useEmpty('origin4Garden')
  const pos5 = useEmpty('origin5Foodtruck')
  const pos6 = useEmpty('origin6Techno')
  const pos7 = useEmpty('origin7Inconnu')
  const pos8 = useEmpty('origin8Idea')
  const pos9 = useEmpty('origin9Ecology')

  return (
    <Menu>
      <a id="home" className="menu-item" href="/">Home</a>
      <a id="debug" className="menu-item" href="/debug">Debug</a>
      <a onPointerDown={() => { changeVehiclePos(pos2) }} onPointerUp={() => { changeVehiclePos(0) }} className="menu-item--small">Zone2</a>
      <a onPointerDown={() => { changeVehiclePos(pos3) }} onPointerUp={() => { changeVehiclePos(0) }} className="menu-item--small">Zone3</a>
      <a onPointerDown={() => { changeVehiclePos(pos4) }} onPointerUp={() => { changeVehiclePos(0) }} className="menu-item--small">Zone4</a>
      <a onPointerDown={() => { changeVehiclePos(pos5) }} onPointerUp={() => { changeVehiclePos(0) }} className="menu-item--small">Zone5</a>
      <a onPointerDown={() => { changeVehiclePos(pos6) }} onPointerUp={() => { changeVehiclePos(0) }} className="menu-item--small">Zone6</a>
{/*       <a onPointerDown={() => { changeVehiclePos(pos7) }} onPointerUp={() => { changeVehiclePos(0) }} className="menu-item--small">Zone7</a>
      <a onPointerDown={() => { changeVehiclePos(pos8) }} onPointerUp={() => { changeVehiclePos(0) }} className="menu-item--small">Zone8</a>
      <a onPointerDown={() => { changeVehiclePos(pos9) }} onPointerUp={() => { changeVehiclePos(0) }} className="menu-item--small">Zone9</a>
 */}
    </Menu>
  );
}
