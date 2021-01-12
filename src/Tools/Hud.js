import React from 'react'
import useStore from '../store'
import useEmpty from '../hooks/useEmpty'

export const Hud = ({ name }) => {
  const changeVehiclePos = useStore((state) => state.changeVehiclePos)
  const pos2 = useEmpty('origin2Game')
  const pos3 = useEmpty('origin3Cinema')
  const pos4 = useEmpty('origin4Garden')
  const pos5 = useEmpty('origin5Foodtruck')
  const pos6 = useEmpty('origin6Techno')
  const pos7 = useEmpty('origin7Inconnu')
  const pos8 = useEmpty('origin8Idea')
  const pos9 = useEmpty('origin9Ecology')

  return (
    <div className="hud">
      <ul>
{/*         <li
          onPointerDown={() => {
            changeVehiclePos(pos2)
          }}
          onPointerUp={() => {
            changeVehiclePos(0)
          }}>
          {' '}
          Actualité{' '}
        </li>
        <li
          onPointerDown={() => {
            changeVehiclePos(pos3)
          }}
          onPointerUp={() => {
            changeVehiclePos(0)
          }}>
          {' '}
          Journal{' '}
        </li>
        <li
          onPointerDown={() => {
            changeVehiclePos(pos4)
          }}
          onPointerUp={() => {
            changeVehiclePos(0)
          }}>
          {' '}
          Galleries{' '}
        </li>
        <li
          onPointerDown={() => {
            changeVehiclePos(pos5)
          }}
          onPointerUp={() => {
            changeVehiclePos(0)
          }}>
          {' '}
          Rencontre{' '}
        </li>
        <li
          onPointerDown={() => {
            changeVehiclePos(pos6)
          }}
          onPointerUp={() => {
            changeVehiclePos(0)
          }}>
          {' '}
          Boite à mots{' '}
        </li>
        <li
          onPointerDown={() => {
            changeVehiclePos(pos7)
          }}
          onPointerUp={() => {
            changeVehiclePos(0)
          }}>
          {' '}
          Un autre lien{' '}
        </li>
        <li
          onPointerDown={() => {
            changeVehiclePos(pos8)
          }}
          onPointerUp={() => {
            changeVehiclePos(0)
          }}>
          {' '}
          Et encore un autre{' '}
        </li>
        <li
          onPointerDown={() => {
            changeVehiclePos(pos9)
          }}
          onPointerUp={() => {
            changeVehiclePos(0)
          }}>
          {' '}
          et voici le dernier lien{' '}
        </li> */}
      </ul>
    </div>
  )
}
