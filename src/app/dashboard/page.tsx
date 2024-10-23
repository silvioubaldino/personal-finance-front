import ApplicationMenu from '../shared/components/menu/UI/ApplicationMenu'
import FilterMonthsMode from "@/app/shared/components/filter/UI/FilterMonthsMode";
import Balance from "@/app/shared/components/balance/ui/balance";
import Wallets from "@/app/shared/components/wallet/ui/wallet";
import styles from './styles/dashboard.module.css'
import Activity from "@/app/shared/components/activity/ui/activity";
import Add from "@/app/shared/components/add/ui/add";
import CategoryPieChart from "@/app/shared/components/graphs/ui/category-pie-chart";
import {DataProvider} from "@/app/shared/components/context/ui/movements-context";
import {MonthProvider} from "@/app/shared/components/context/ui/MonthContext";

const DashboardPage = () => {
    return (
        <DataProvider>
            <MonthProvider>
            <div className={styles.pageContainer}>
                <FilterMonthsMode/>
                <div className={styles.balanceContainer}>
                    <Balance/>
                </div>
                <div className={styles.walletAndChartContainer}>
                    <Wallets/>
                    <div style={{flex: 1}}>
                        <CategoryPieChart/>
                    </div>
                </div>
                <div className={styles.activityContainer}>
                    <Activity/>
                </div>
                <ApplicationMenu/>
                <Add/>
            </div>
            </MonthProvider>
        </DataProvider>
    )
}

export default DashboardPage