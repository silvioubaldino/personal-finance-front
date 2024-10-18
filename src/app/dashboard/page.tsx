import React from 'react'
import ApplicationMenu from '../shared/components/menu/UI/ApplicationMenu'
import FilterMonthsMode from "@/app/shared/components/filter/UI/FilterMonthsMode";
import Balance from "@/app/shared/components/balance/ui/balance";
import Wallets from "@/app/shared/components/wallet/ui/wallet";
import styles from './styles/dashboard.module.css'
import Activity from "@/app/shared/components/activity/ui/activity";

const DashboardPage = () => {
    return (
        <div>
            <FilterMonthsMode/>
            <div className={styles.dashboradBody}>
                <Balance/>
                <Wallets/>
            </div>
            <div className={styles.dashboradBody}>
                <Activity/>
            </div>
            <ApplicationMenu/>
        </div>
    )
}

export default DashboardPage