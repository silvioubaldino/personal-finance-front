'use client'
import React, { useEffect } from 'react'
import { monsthsPortuguese } from '../service/constants'
import styles from '../styles/FilterMonthsMode.module.css'

const FilterMonthsMode = () => {

  const [currentMonth, setCurrentMonth] = React.useState(
    monsthsPortuguese[new Date().getMonth()]
  )

  function scrollItemtoCenter() {
    const container = document.getElementById('month-name-container');
    const item = document.getElementById(currentMonth.toLowerCase());
  
    if (container && item) {
      const containerCenter = container.offsetWidth / 2;
      const itemCenter = item.offsetWidth / 2;
      
      container.scrollTo({
        left: item.offsetLeft - container.offsetLeft - containerCenter + itemCenter,
        behavior: 'smooth'
      });
    }
  }

  useEffect(() => {
    scrollItemtoCenter()
  }, [currentMonth])

  return (
    <section className={styles.mainsection}>

      <h2 className={styles["mode-text"]}>período</h2>

      <div className={styles["month-filter-wrapper"]}>
        <button onClick={() => setCurrentMonth(monsthsPortuguese[monsthsPortuguese.findIndex(e => e.toLowerCase() === currentMonth.toLowerCase()) - 1])} className={styles["next-prev-button"]}>{"<<"}</button>
        <div id="month-name-container" className={styles["month-name-container"]}>
          {monsthsPortuguese.map((month, index) => (
              <div onClick={() => setCurrentMonth(month)} id={month.toLowerCase()} key={index} className={currentMonth === month ? styles["month-name-selected"]: styles["month-name"]}>
                {month}
              </div>
          ))}
        </div>
        <button onClick={() => setCurrentMonth(monsthsPortuguese[monsthsPortuguese.findIndex(e => e.toLowerCase() === currentMonth.toLowerCase()) + 1])} className={styles["next-prev-button"]}>{">>"}</button>
      </div>

    </section>
  )
}

export default FilterMonthsMode