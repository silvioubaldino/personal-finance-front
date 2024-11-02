import React, {useEffect, useState} from 'react';
import {createSubEstimate, Estimate, getCategories} from '@/services/api';
import {extractMonthAndYear} from '@/app/shared/components/filter/UI/FilterMonthsMode';
import styles from '../styles/modal-add-estimate.module.css';

interface Category {
    id: string;
    description: string;
    sub_categories: SubCategory[];
}

interface SubCategory {
    id: string;
    description: string;
}

interface AddSubEstimateFormProps {
    currentMonth: { from: string; to: string };
    estimateCategory: Estimate;
    onClose: () => void;
}

const AddSubEstimateForm: React.FC<AddSubEstimateFormProps> = ({currentMonth, estimateCategory, onClose}) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
    const [amount, setAmount] = useState<string>('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categories = await getCategories();
                setCategories(categories);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        if (estimateCategory.category_name) {
            const category = categories.find(cat => cat.description === estimateCategory.category_name);
            if (category) {
                setSubCategories(category.sub_categories);
            }
        } else {
            setSubCategories([]);
        }
    }, [estimateCategory.category_name, categories]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const selectedSubCategoryObj = subCategories.find(sub => sub.id === selectedSubCategory);
        if (selectedSubCategoryObj) {
            const {month, year} = extractMonthAndYear(currentMonth.from);
            let amountValue = parseFloat(amount);

            if (!estimateCategory.is_category_income && amountValue > 0) {
                amountValue = -amountValue;
            }

            if (estimateCategory.is_category_income && amountValue < 0) {
                amountValue = -amountValue;
            }

            console.log(estimateCategory)
            const subEstimate = {
                sub_category_id: selectedSubCategoryObj.id,
                category_name: selectedSubCategoryObj.description,
                estimate_category_id: estimateCategory.id,
                month,
                year,
                amount: amountValue,
            };
            try {
                await createSubEstimate(subEstimate);
                onClose();
            } catch (error) {
                console.error('Error creating sub-estimate:', error);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.wideForm}>
            <div className={styles.formGroup}>
                <label htmlFor="category">Categoria</label>
                <select
                    id="category"
                    value={estimateCategory.category_name}
                    disabled
                >
                    <option value="">{estimateCategory.category_name}</option>
                </select>
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="subCategory">Subcategoria</label>
                <select
                    id="subCategory"
                    value={selectedSubCategory}
                    onChange={(e) => setSelectedSubCategory(e.target.value)}
                >
                    <option value="">Selecione uma subcategoria</option>
                    {subCategories.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                            {sub.description}
                        </option>
                    ))}
                </select>
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="amount">Valor</label>
                <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
            </div>
            <div className={styles.formActions}>
                <button type="submit">Adicionar</button>
            </div>
        </form>
    );
};

export default AddSubEstimateForm;