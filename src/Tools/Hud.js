import React from 'react'
import { slide as Menu } from 'react-burger-menu'
import useEmpty from '../hooks/useEmpty'
import useStore from '../store'

export const Hud = ({ name }) => {
  const changeVehiclePos = useStore((state) => state.changeVehiclePos)
/*   const toggleControls = useStore((state) => state.toggleControls)
 */  const pos2 = useEmpty('origin2Game')
  const pos3 = useEmpty('origin3Cinema')
  const pos4 = useEmpty('origin4Garden')
  const pos5 = useEmpty('origin5Foodtruck')
  const pos6 = useEmpty('origin6Techno')
/*   const pos7 = useEmpty('origin7Inconnu')
  const pos8 = useEmpty('origin8Idea')
  const pos9 = useEmpty('origin9Ecology') */
  const cameraTarget = useStore((state) => state.cameraTarget)
  const changeTarget = useStore((state) => state.changeTarget)
  const nbFlower = useStore((state) => state.nbFlowers)
  const zone = useStore((state) => state.zone)

  return (
    <div>
      <Menu>
        <li id="home" className="menu-item" href="/">
          Home
        </li>
        <li id="debug" className="menu-item" href="/debug">
          Debug
        </li>
        <li
          onPointerDown={() => {
            changeVehiclePos(pos2)
          }}
          onPointerUp={() => {
            changeVehiclePos(0)
          }}
          className="menu-item--small">
          Zone2
        </li>
        <li
          onPointerDown={() => {
            changeVehiclePos(pos3)
          }}
          onPointerUp={() => {
            changeVehiclePos(0)
          }}
          className="menu-item--small">
          Zone3
        </li>
        <li
          onPointerDown={() => {
            changeVehiclePos(pos4)
          }}
          onPointerUp={() => {
            changeVehiclePos(0)
          }}
          className="menu-item--small">
          Zone4
        </li>
        <li
          onPointerDown={() => {
            changeVehiclePos(pos5)
          }}
          onPointerUp={() => {
            changeVehiclePos(0)
          }}
          className="menu-item--small">
          Zone5
        </li>
        <li
          onPointerDown={() => {
            changeVehiclePos(pos6)
          }}
          onPointerUp={() => {
            changeVehiclePos(0)
          }}
          className="menu-item--small">
          Zone6
        </li>
        {/*       <li onPointerDown={() => { changeVehiclePos(pos7) }} onPointerUp={() => { changeVehiclePos(0) }} className="menu-item--small">Zone7</li>
      <li onPointerDown={() => { changeVehiclePos(pos8) }} onPointerUp={() => { changeVehiclePos(0) }} className="menu-item--small">Zone8</li>
      <li onPointerDown={() => { changeVehiclePos(pos9) }} onPointerUp={() => { changeVehiclePos(0) }} className="menu-item--small">Zone9</li>
 */}
      </Menu>
      <div className="hud">
      <div className="flowerCount">Flower : {nbFlower}</div> 
      <div className="zoneName">Zone : {zone}</div> 
      <div className="hud_title">
        {cameraTarget.position && (
          <div>
            <li onClick={() => changeTarget({})}>{cameraTarget.name}</li>
          </div>
        )}
      </div>
      </div>

    </div>
  )
}
