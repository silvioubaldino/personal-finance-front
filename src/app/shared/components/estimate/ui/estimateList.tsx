'use client';
import React, {useEffect, useState} from 'react';
import styles from '../styles/estimateList.module.css';
import {LuArrowDown, LuArrowUp, LuPenSquare, LuSend} from "react-icons/lu";
import AddEstimateForm from '@/app/shared/components/addestimate/ui/add-estimate-form';
import {useData} from "@/app/shared/components/context/ui/movements-context";
import {useMonth} from "@/app/shared/components/context/ui/MonthContext";
import {Estimate, getEstimate, getMovements, SubEstimate, updateEstimate, updateSubEstimate} from '@/services/api';
import {extractMonthAndYear} from "@/app/shared/components/filter/UI/FilterMonthsMode";
import Modal from "@/app/shared/components/add/ui/modal";
import AddSubEstimateForm from "@/app/shared/components/addestimate/ui/add-sub-estimate-form";

interface SubCategory {
    id: string;
    sub_category_name: string;
    amount: number;
}

const createCategoryMap = (movements: any[]): { [key: string]: number } => {
    return movements.reduce((acc, movement) => {
        const categoryID = movement.category.id;
        const amount = movement.amount;

        if (!acc[categoryID]) {
            acc[categoryID] = 0;
        }

        acc[categoryID] += amount;
        return acc;
    }, {} as { [key: string]: number });
};

const createSubCategoryMap = (movements: any[]): { [key: string]: number } => {
    return movements.reduce((acc, movement) => {
        const subCategoryID = movement.sub_category.id;
        const amount = movement.amount;

        if (subCategoryID) {
            if (!acc[subCategoryID]) {
                acc[subCategoryID] = 0;
            }

            acc[subCategoryID] += amount;
        }
        return acc;
    }, {} as { [key: string]: number });
};

const EstimateList = () => {
    const {data: movements, setData} = useData();
    const {currentMonth} = useMonth();
    const [estimates, setEstimates] = useState<any[]>([]);
    const [realized, setRealized] = useState<{ [key: string]: number }>({});
    const [subCategoriesRealized, setSubCategoriesRealized] = useState<{ [key: string]: number }>({});
    const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState<'estimate' | 'subEstimate'>('estimate');
    const [selectedEstimateCategory, setSelectedEstimateCategory] = useState<Estimate>();
    const [isEditing, setIsEditing] = useState<{ [key: string]: boolean }>({});
    const [editableAmount, setEditableAmount] = useState<{ [key: string]: number }>({});
    const [isEditingSub, setIsEditingSub] = useState<{ [key: string]: boolean }>({});
    const [editableSubAmount, setEditableSubAmount] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        const fetchMovementsAndEstimates = async () => {
            try {
                if (currentMonth.from && currentMonth.to) {
                    const movements = await getMovements(currentMonth.from, currentMonth.to);
                    setData(movements);
                    const {month, year} = extractMonthAndYear(currentMonth.from);
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
        setExpanded(prev => ({...prev, [id]: !prev[id]}));
    };

    const handleAddNew = () => {
        setModalContent('estimate');
        setIsModalOpen(true);
    };

    const handleAddSubEstimate = (estimate: Estimate) => {
        setSelectedEstimateCategory(estimate);
        setModalContent('subEstimate');
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleEstimateEdit = (id: string, amount: number) => {
        setIsEditing(prev => ({...prev, [id]: true}));
        setEditableAmount(prev => ({...prev, [id]: amount}));
    };

    const handleSubEstimateEdit = (id: string, amount: number) => {
        setIsEditingSub(prev => ({...prev, [id]: true}));
        setEditableSubAmount(prev => ({...prev, [id]: amount}));
    };

   const handleSave = async (id: string) => {
    try {
        const estimate = estimates.find(est => est.id === id);
        if (estimate) {
            let amountValue = editableAmount[id];

            if (estimate.is_category_income && amountValue < 0) {
                amountValue = -amountValue;
            }

            if (!estimate.is_category_income && amountValue > 0) {
                amountValue = -amountValue;
            }

            await updateEstimate(id, amountValue);
            setIsEditing(prev => ({ ...prev, [id]: false }));
        }
    } catch (error) {
        console.error('Failed to update estimate:', error);
    }
};

const handleSubSave = async (id: string) => {
    try {
        const parentEstimate = estimates.find(est => est?.estimates_sub_categories?.some((sub: SubCategory) => sub && sub.id === id));
        const subEstimate = parentEstimate?.estimates_sub_categories.find((sub: SubCategory) => sub && sub.id === id);

        if (subEstimate && parentEstimate) {
            let amountValue = editableSubAmount[id];

            if (parentEstimate.is_category_income && amountValue < 0) {
                amountValue = -amountValue;
            }

            if (!parentEstimate.is_category_income && amountValue > 0) {
                amountValue = -amountValue;
            }

            await updateSubEstimate(id, amountValue);
            setIsEditingSub(prev => ({ ...prev, [id]: false }));
        }
    } catch (error) {
        console.error('Failed to update sub-estimate:', error);
    }
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
                const realizedAmount = realized[estimate.category_id] || 0;
                const result = (estimate.amount - realizedAmount) * -1;
                const isExpanded = expanded[estimate.id];
                const isEditingCategory = isEditing[estimate.id];

                return (
                    <div key={estimate.id}
                         className={`${styles.estimate} ${isExpanded ? styles.estimateExpanded : ''}`}>
                        <div className={styles.row}>
                            <button
                                className={styles.button}
                                onClick={() => toggleExpand(estimate.id)}
                            >
                                {isExpanded ? <LuArrowUp/> : <LuArrowDown/>}
                            </button>
                            <div className={styles.categoryName}>{estimate.category_name}</div>
                            <div className={styles.amount}>
                                {isEditingCategory ? (
                                    <input
                                        className={styles.amountEdit}
                                        type="number"
                                        value={editableAmount[estimate.id]}
                                        onChange={(e) => setEditableAmount(prev => ({
                                            ...prev,
                                            [estimate.id]: parseFloat(e.target.value)
                                        }))}
                                    />
                                ) : (
                                    estimate.amount.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})
                                )}
                            </div>
                            <div className={styles.realized}>{realizedAmount.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                            })}</div>
                            <div className={styles.result}>{result.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                            })}</div>
                            {isEditingCategory ? (
                                <button className={styles.buttonEdit} onClick={() => handleSave(estimate.id)}>
                                    <LuSend/>
                                </button>
                            ) : (
                                <button className={styles.buttonEdit}
                                        onClick={() => handleEstimateEdit(estimate.id, estimate.amount)}>
                                    <LuPenSquare/>
                                </button>
                            )}
                        </div>
                        {isExpanded && (
                            <>
                                <div className={styles.subCategories}>
                                    {estimate.estimates_sub_categories && estimate.estimates_sub_categories.map((sub: SubEstimate) => {
                                        const subRealizedAmount = subCategoriesRealized[sub.sub_category_id] || 0;
                                        const subResult = (sub.amount - subRealizedAmount) * -1;
                                        const isEditingSubCategory = isEditingSub[sub.id];

                                        return (
                                            <div key={sub.id} className={styles.row}>
                                                <div></div>
                                                <div className={styles.categoryName}>{sub.sub_category_name}</div>
                                                <div className={styles.amount}>
                                                    {isEditingSubCategory ? (
                                                        <input
                                                            className={styles.amountEdit}
                                                            type="number"
                                                            value={editableSubAmount[sub.id]}
                                                            onChange={(e) => setEditableSubAmount(prev => ({
                                                                ...prev,
                                                                [sub.id]: parseFloat(e.target.value)
                                                            }))}
                                                        />
                                                    ) : (
                                                        sub.amount.toLocaleString('pt-BR', {
                                                            style: 'currency',
                                                            currency: 'BRL'
                                                        })
                                                    )}
                                                </div>
                                                <div
                                                    className={styles.realized}>{subRealizedAmount.toLocaleString('pt-BR', {
                                                    style: 'currency',
                                                    currency: 'BRL'
                                                })}</div>
                                                <div className={styles.result}>{subResult.toLocaleString('pt-BR', {
                                                    style: 'currency',
                                                    currency: 'BRL'
                                                })}</div>
                                                {isEditingSubCategory ? (
                                                    <>
                                                        <button className={styles.buttonEdit}
                                                                onClick={() => handleSubSave(sub.id)}>
                                                            <LuSend/>
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button className={styles.buttonEdit}
                                                            onClick={() => handleSubEstimateEdit(sub.id, sub.amount)}>
                                                        <LuPenSquare/>
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className={styles.addSubCategoryRow}>
                                    <button className={styles.addButton}
                                            onClick={() => handleAddSubEstimate(estimate)}>
                                        Adicionar Subcategoria
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                );
            })}
            <div className={styles.addNewRow}>
                <button className={styles.addButton} onClick={handleAddNew}>
                    Adicionar novo planejamento
                </button>
            </div>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                {modalContent === 'estimate' ? (
                    <AddEstimateForm currentMonth={currentMonth} onClose={handleCloseModal}/>
                ) : (
                    selectedEstimateCategory && (
                        <AddSubEstimateForm
                        currentMonth={currentMonth}
                        estimateCategory={selectedEstimateCategory}
                        onClose={handleCloseModal}/>
                    )
                )}
            </Modal>
        </div>
    );
};

export default EstimateList;