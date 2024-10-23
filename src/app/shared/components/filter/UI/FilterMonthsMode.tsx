'use client'
import React, { useEffect } from 'react';
import { monsthsPortuguese } from '../service/constants';
import styles from '../styles/FilterMonthsMode.module.css';
import { useMonth } from '@/app/shared/components/context/ui/MonthContext';

const FilterMonthsMode = () => {
  const { currentMonth, setCurrentMonth } = useMonth();

  useEffect(() => {
    if (currentMonth.from === '' && currentMonth.to === '') {
      const now = new Date();
      const currentMonthName = monsthsPortuguese[now.getMonth()];
      setCurrentMonth(currentMonthName);
    }
  }, [currentMonth, setCurrentMonth]);

  useEffect(() => {
    if (currentMonth.from) {
      scrollItemtoCenter();
    }
  }, [currentMonth]);

  function scrollItemtoCenter() {
    const container = document.getElementById('month-name-container');
    const item = document.getElementById(monsthsPortuguese[new Date(currentMonth.to).getMonth()].toLowerCase());

    if (container && item) {
      const containerCenter = container.offsetWidth / 2;
      const itemCenter = item.offsetWidth / 2;

      container.scrollTo({
        left: item.offsetLeft - container.offsetLeft - containerCenter + itemCenter,
        behavior: 'smooth'
      });
    }
  }

  return (
    <section className={styles.mainsection}>
      <div className={styles["month-filter-wrapper"]}>
        <button onClick={() => setCurrentMonth(monsthsPortuguese[monsthsPortuguese.findIndex(e => e.toLowerCase() === monsthsPortuguese[new Date(currentMonth.to).getMonth()].toLowerCase()) - 1])} className={styles["next-prev-button"]}>{"<<"}</button>
        <div id="month-name-container" className={styles["month-name-container"]}>
          {monsthsPortuguese.map((month, index) => (
            <div onClick={() => setCurrentMonth(month)} id={month.toLowerCase()} key={index} className={new Date(currentMonth.from).getMonth() === index - 1 ? styles["month-name-selected"] : styles["month-name"]}>
              {month}
            </div>
          ))}
        </div>
        <button onClick={() => setCurrentMonth(monsthsPortuguese[monsthsPortuguese.findIndex(e => e.toLowerCase() === monsthsPortuguese[new Date(currentMonth.to).getMonth()].toLowerCase()) + 1])} className={styles["next-prev-button"]}>{">>"}</button>
      </div>
    </section>
  );
};

export default FilterMonthsMode;