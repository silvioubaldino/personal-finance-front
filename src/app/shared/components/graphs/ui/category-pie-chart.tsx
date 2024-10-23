'use client';
import React, {useLayoutEffect, useMemo, useRef} from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import styles from '../styles/category-pie-chart.module.css';
import {useData} from "@/app/shared/components/context/ui/movements-context";
import TotalExpenses from "@/app/shared/components/totalexpenses/ui/total-expenses";

interface DataItem {
    category: string;
    sub_category: string;
    amount: number;
}

const CategoryPieChart = () => {
    const chartRef = useRef<HTMLDivElement>(null);
    const {data} = useData();

    const groupedData = useMemo(() => {
        const categories = data.reduce<{ category: string; value: number }[]>((acc, item: DataItem) => {
            const category = acc.find((c) => c.category === item.category) || {category: item.category, value: 0};
            category.value += item.amount;
            if (!acc.includes(category)) acc.push(category);
            return acc;
        }, []);

        const subcategories = data.reduce<{
            category: string;
            sub_category: string;
            value: number
        }[]>((acc, item: DataItem) => {
            const subcategory = acc.find((c) => c.category === item.category && c.sub_category === item.sub_category) || {
                category: item.category,
                sub_category: item.sub_category,
                value: 0
            };
            subcategory.value += item.amount;
            if (!acc.includes(subcategory)) acc.push(subcategory);
            return acc;
        }, []);

        return {categories, subcategories};
    }, [data]);

    useLayoutEffect(() => {
        const root = am5.Root.new(chartRef.current!);

        root.setThemes([am5themes_Animated.new(root)]);

        const chart = root.container.children.push(
            am5percent.PieChart.new(root, {
                layout: root.verticalLayout,
                innerRadius: am5.percent(50)
            })
        );

        const series1 = chart.series.push(
            am5percent.PieSeries.new(root, {
                valueField: 'value',
                categoryField: 'category',
                radius: am5.percent(10),
                innerRadius: am5.percent(40)
            })
        );

        const series2 = chart.series.push(
            am5percent.PieSeries.new(root, {
                valueField: 'value',
                categoryField: 'sub_category',
                radius: am5.percent(50),
                innerRadius: am5.percent(80)
            })
        );

        console.log(groupedData);
        series1.data.setAll(groupedData.categories);
        series2.data.setAll(groupedData.subcategories);

        series1.slices.template.set("tooltipText", "{category}: R$ {value.formatNumber('#,###.##')}"); /*({value.percent.formatNumber('#.0')}%)*/
        series2.slices.template.set("tooltipText", "{sub_category}: R$ {value.formatNumber('#,###.##')}"); /*({value.percent.formatNumber('#.0')}%)*/

        // Link the two series
        series1.slices.template.on("active", function (active, target) {
            if (active && target && target.dataItem) {
                const category = (target.dataItem.dataContext as DataItem).category;
                series2.dataItems.forEach(function (dataItem) {
                    if ((dataItem.dataContext as DataItem).category === category) {
                        dataItem.show();
                    } else {
                        dataItem.hide();
                    }
                });
            } else {
                series2.dataItems.forEach(function (dataItem) {
                    dataItem.show();
                });
            }
        });

        series1.labels.template.set("visible", false);
        series1.ticks.template.set("visible", false);
        series2.labels.template.set("visible", false);
        series2.ticks.template.set("visible", false);

        return () => {
            root.dispose();
        };
    }, [groupedData]);

    return <div className={styles.chartContainer}>
        <TotalExpenses/>
        <div ref={chartRef} className={styles.pieChartContainer}></div>
    </div>;
};

export default CategoryPieChart;