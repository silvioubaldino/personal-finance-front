import React, { useState, useEffect } from 'react';
import { getCategories, createEstimate } from '@/services/api';
import { extractMonthAndYear } from '@/app/shared/components/filter/UI/FilterMonthsMode';
import styles from '../styles/modal-add-estimate.module.css';

interface Category {
    id: string;
    description: string;
    is_income: boolean;
}

interface AddEstimateFormProps {
    currentMonth: { from: string; to: string };
    onClose: () => void;
}

const AddEstimateForm: React.FC<AddEstimateFormProps> = ({ currentMonth, onClose }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const selectedCategoryObj = categories.find(cat => cat.id === selectedCategory);
    if (selectedCategoryObj) {
        const { month, year } = extractMonthAndYear(currentMonth.from);
        let amountValue = parseFloat(amount);

        if (!selectedCategoryObj.is_income && amountValue > 0) {
            amountValue = -amountValue;
        }

        if (selectedCategoryObj.is_income && amountValue < 0) {
            amountValue = -amountValue;
        }

        const estimate = {
            category_id: selectedCategoryObj.id,
            category_name: selectedCategoryObj.description,
            is_category_income: selectedCategoryObj.is_income,
            month,
            year,
            amount: amountValue,
        };

        try {
            await createEstimate(estimate);
            onClose();
        } catch (error) {
            console.error('Error creating estimate:', error);
        }
    }
};

    return (
        <form onSubmit={handleSubmit} className={styles.wideForm}>
            <div className={styles.formGroup}>
                <label htmlFor="category">Categoria</label>
                <select
                    id="category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="">Selecione uma categoria</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.description}
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

export default AddEstimateForm;