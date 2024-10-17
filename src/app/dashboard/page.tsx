import React from 'react'
import ApplicationMenu from '../shared/components/menu/UI/ApplicationMenu'
import FilterMonthsMode from "@/app/shared/components/filter/UI/FilterMonthsMode";

const DashboardPage = () => {
    return (
        <div>
            <FilterMonthsMode/>
            <ApplicationMenu/>
        </div>
    )
}

export default DashboardPage