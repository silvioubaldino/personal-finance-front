'use client';
import React, {useLayoutEffect, useMemo, useRef} from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import styles from '../styles/category-pie-chart.module.css';
import {useData} from "@/app/shared/components/context/ui/movements-context";
import TotalExpenses from "@/app/shared/components/totalexpenses/ui/total-expenses";
import {Category} from "@/services/api";

interface DataItem {
    category: Category;
    category_amount: string;
    sub_category?: {
        description: string;
    };
    amount: number;
}

const CategoryPieChart = () => {
    const chartRef = useRef<HTMLDivElement>(null);
    const {data} = useData();

    const groupedData = useMemo(() => {
        const categories = data.filter((cat) => cat.amount < 0).reduce<{
            category: string;
            value: number;
        }[]>((acc, item: DataItem) => {
            const category = acc.find((c) => c.category === item.category.description) || {
                category: item.category.description,
                value: 0
            };
            category.value += item.amount;
            if (!acc.includes(category)) acc.push(category);
            return acc;
        }, []).sort((a, b) => b.value - a.value);

        const subcategories = data.filter((cat) => cat.amount < 0).reduce<{
            category: string;
            category_amount: number;
            sub_category: string;
            value: number;
        }[]>((acc, item: DataItem) => {
            const category = categories.find((c) => c.category === item.category.description);
            const subcategory = acc.find((c) => c.category === item.category.description && c.sub_category === item.sub_category?.description) || {
                category: item.category.description,
                category_amount: category ? category.value : 0,
                sub_category: item.sub_category?.description || item.category.description,
                value: 0,
            };
            subcategory.value += item.amount;
            if (!acc.includes(subcategory)) acc.push(subcategory);
            return acc;
        }, []).sort((a, b) => b.category_amount - a.category_amount);

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

        series1.data.setAll(groupedData.categories);
        series2.data.setAll(groupedData.subcategories);

        series1.slices.template.set("tooltipText", "{category}: R$ {value.formatNumber('#,###.##')}({valuePercentTotal.formatNumber('0.00')}%[/])");
        series2.slices.template.set("tooltipText", "{sub_category}: R$ {value.formatNumber('#,###.##')}({valuePercentTotal.formatNumber('0.00')}%[/])");

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