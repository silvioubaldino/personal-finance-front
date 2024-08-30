'use client'
import React, { useEffect } from 'react'
import MenuMainButton from './MenuMainButton'
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import { FaWallet } from "react-icons/fa";
import home from '../../../../../../public/home.png'
import profile from '../../../../../../public/profile.png'
import wallet from '../../../../../../public/wallet.png'
import users from '../../../../../../public/users.png'
import personalbuddy from '../../../../../../public/personalbuddy.png'

import styles from '../styles/ApplicationMenu.module.css'

const ApplicationMenu = () => {

  const [expanded, setExpanded] = React.useState(false)

  const pathname = usePathname()

  function selectedOption(option: string) {
    if (pathname === option) {
      return styles["selected-option"]
    }
    
    return ''
  }

  useEffect(() => {
    console.log('expanded:', expanded);
    
  }
  , [expanded])

  return (
    <div className={styles.main}>

      <section className={styles.menu}>
        {
          expanded && (
            <div className={styles["group-options"]}>
              <Image src={wallet} alt="home" width={20} height={20} color="#C9AD72" className={[selectedOption('/wallet'), styles.option].join(' ')} />
              <Image src={profile} alt="home" width={20} height={20} color="#C9AD72" className={[selectedOption('/profile'), styles.option].join(' ')} />
              <Image src={home} alt="home" width={20} height={20} color="#C9AD72" className={[selectedOption('/dashboard'), styles.option].join(' ')} />
            </div>
          )
        }

        <MenuMainButton expanded={expanded} setExpanded={setExpanded} />

        {
          expanded && (
            <div className={styles["group-options"]}>
              <Image src={users} alt="home" width={20} height={20} color="#C9AD72" className={[selectedOption('/users'), styles.option].join(' ')} />
              <Image src={personalbuddy} alt="home" width={20} height={20} color="#C9AD72" className={[selectedOption('/personalbuddy'), styles.option].join(' ')} />
            </div>
          )
        }
      </section>

      {/* <div className={expanded ? styles["hr-expanded"] : styles["hr-shrink"]}></div> */}

    </div>
  )
}

export default ApplicationMenu