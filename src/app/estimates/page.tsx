import styles from './styles/estimate.module.css'
import LogoutButton from "@/app/shared/components/logout/ui/logout-button";
import FilterMonthsMode from "@/app/shared/components/filter/UI/FilterMonthsMode";
import Balance from "@/app/shared/components/balance/ui/balance";
import EstimateList from "@/app/shared/components/estimate/ui/estimateList";

const EstimatePage = () => {
    return (
        <div className={styles.pageContainer}>
            <LogoutButton/>
            <FilterMonthsMode/>
            <div className={styles.balanceContainer}>
                <Balance/>
            </div>
            <EstimateList/>
        </div>
    );
}

export default EstimatePage