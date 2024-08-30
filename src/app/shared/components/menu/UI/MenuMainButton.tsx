import React from 'react'
import { CgMenuGridO } from 'react-icons/cg'
import { LuShrink } from "react-icons/lu";

import styles from '../styles/MenuMainButton.module.css'


interface MenuMainButtonProps {
  expanded: boolean
  setExpanded: (expanded: boolean) => void
}

const MenuMainButton = ({expanded, setExpanded}: MenuMainButtonProps) => {

  return (
    <button className={styles.button} onClick={() => setExpanded(!expanded)}>
      {expanded ? <LuShrink size={20} color="#C9AD72" /> : <CgMenuGridO size={30} color="#C9AD72"/>}
    </button>
  )
}

export default MenuMainButton