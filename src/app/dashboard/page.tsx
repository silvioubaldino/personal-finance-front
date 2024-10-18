import React from 'react'
import ApplicationMenu from '../shared/components/menu/UI/ApplicationMenu'
import FilterMonthsMode from "@/app/shared/components/filter/UI/FilterMonthsMode";
import Balance from "@/app/shared/components/balance/ui/balance";

const DashboardPage = () => {
    return (
        <div>
            <FilterMonthsMode/>
            <Balance />
            <ApplicationMenu/>
        </div>
    )
}

export default DashboardPage