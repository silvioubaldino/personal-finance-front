'use client';

import React, { useEffect, useState } from 'react';
import styles from '../styles/estimateList.module.css';
import { LuArrowDown, LuArrowUp, LuPenSquare } from "react-icons/lu";
import ModalForm from '@/app/shared/components/addestimate/ui/modal-add-estimate';
import { useData } from "@/app/shared/components/context/ui/movements-context";
import { useMonth } from "@/app/shared/components/context/ui/MonthContext";
import { getEstimate, getMovements } from '@/services/api';
import { extractMonthAndYear } from "@/app/shared/components/filter/UI/FilterMonthsMode";

interface SubCategory {
    id: string;
    sub_category_name: string;
    amount: number;
}

const createCategoryMap = (movements: any[]): { [key: string]: number } => {
    return movements.reduce((acc, movement) => {
        const category = movement.category;
        const amount = movement.amount;

        if (!acc[category]) {
            acc[category] = 0;
        }

        acc[category] += amount;
        return acc;
    }, {} as { [key: string]: number });
};
const createSubCategoryMap = (movements: any[]): { [key: string]: number } => {
    return movements.reduce((acc, movement) => {
        const subCategory = movement.sub_category;
        const amount = movement.amount;

        if (subCategory) {
            if (!acc[subCategory]) {
                acc[subCategory] = 0;
            }

            acc[subCategory] += amount;
        }
        return acc;
    }, {} as { [key: string]: number });
};

const EstimateList = () => {
    const { data: movements, setData } = useData();
    const { currentMonth } = useMonth();
    const [estimates, setEstimates] = useState<any[]>([]);
    const [realized, setRealized] = useState<{ [key: string]: number }>({});
    const [subCategoriesRealized, setSubCategoriesRealized] = useState<{ [key: string]: number }>({});
    const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchMovementsAndEstimates = async () => {
            try {
                if (currentMonth.from && currentMonth.to) {
                    const movements = await getMovements(currentMonth.from, currentMonth.to);
                    setData(movements);
                    const { month, year } = extractMonthAndYear(currentMonth.from);
                    const estimatesData = await getEstimate(month, year);
                    setEstimates(estimatesData);
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };

        fetchMovementsAndEstimates();
    }, [currentMonth]);

    useEffect(() => {
        const categoryMap = createCategoryMap(movements);
        setRealized(categoryMap);
        const subCategoryMap = createSubCategoryMap(movements);
        setSubCategoriesRealized(subCategoryMap);
    }, [movements]);

    const toggleExpand = (id: string) => {
        setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleEdit = (id: string) => {
        console.log(`Edit item with id: ${id}`);
    };

    const handleAddNew = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div></div>
                <div className={styles.categoryName}>Categoria</div>
                <div className={styles.amount}>Planejado</div>
                <div className={styles.realized}>Gasto</div>
                <div className={styles.result}>Resultado</div>
            </div>
            {estimates.map((estimate) => {
                const realizedAmount = realized[estimate.category_name] || 0;
                const result = estimate.amount - realizedAmount;
                const isExpanded = expanded[estimate.id];
                const hasSubCategories = !!estimate.estimates_sub_categories;

                return (
                    <div key={estimate.id} className={`${styles.estimate} ${isExpanded ? styles.estimateExpanded : ''}`}>
                        <div className={styles.row}>
                            <button
                                className={`${styles.button} ${!hasSubCategories ? styles.buttonDisabled : ''}`}
                                onClick={() => hasSubCategories && toggleExpand(estimate.id)}
                                disabled={!hasSubCategories}
                            >
                                {isExpanded ? <LuArrowUp /> : <LuArrowDown />}
                            </button>
                            <div className={styles.categoryName}>{estimate.category_name}</div>
                            <div className={styles.amount}>{estimate.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                            <div className={styles.realized}>{realizedAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                            <div className={styles.result}>{result.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                            <button className={styles.buttonEdit} onClick={() => handleEdit(estimate.id)}>
                                <LuPenSquare />
                            </button>
                        </div>
                        {isExpanded && hasSubCategories && (
                            <div className={styles.subCategories}>
                                {estimate.estimates_sub_categories.map((sub: SubCategory) => {
                                    const subRealizedAmount = subCategoriesRealized[sub.sub_category_name] || 0;
                                    const subResult = sub.amount - subRealizedAmount;

                                    return (
                                        <div key={sub.id} className={styles.row}>
                                            <div></div>
                                            <div className={styles.categoryName}>{sub.sub_category_name}</div>
                                            <div className={styles.amount}>{sub.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                                            <div className={styles.realized}>{subRealizedAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                                            <div className={styles.result}>{subResult.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                                            <button className={styles.buttonEdit} onClick={() => handleEdit(sub.id)}>
                                                <LuPenSquare />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
            <div className={styles.addNewRow}>
                <button className={styles.addButton} onClick={handleAddNew}>
                    Adicionar novo planejamento
                </button>
            </div>
            <ModalForm isOpen={isModalOpen} onClose={handleCloseModal} />
        </div>
    );
};

export default EstimateList;