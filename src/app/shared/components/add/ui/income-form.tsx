import React, {useEffect, useState} from 'react';
import styles from '../styles/form.module.css';
import {AddMovement, createMovement, Movement, updateMovement} from "@/services/api";
import {format} from "date-fns";
import {useData} from "@/app/shared/components/context/ui/common-data-context";

type SubCategory = {
    id: string;
    description: string;
};

const mockTypePayment = [
    {id: 3, description: 'Pix'},
    {id: 4, description: 'Débito'}
];

type IncomeFormProps = {
    isEditing: boolean;
    movement?: Movement;
    onUpdateTransactions: () => void;
};

const IncomeForm: React.FC<IncomeFormProps> = ({isEditing, movement, onUpdateTransactions}) => {
    const {wallets, categories} = useData();
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const today = new Date().toISOString().split('T')[0];
    const [formData, setFormData] = useState<AddMovement>({
        description: '',
        amount: 0,
        date: today,
        is_paid: false,
        is_recurrent: false,
        wallet_id: '',
        type_payment_id: 4,
        category_id: '',
        sub_category_id: ''
    });

    useEffect(() => {
        if (movement) {
            setFormData(
                {
                    description: movement.description,
                    amount: movement.amount,
                    date: movement.date.split('T')[0],
                    is_paid: movement.is_paid,
                    is_recurrent: movement.is_recurrent,
                    wallet_id: movement.wallet.id,
                    type_payment_id: movement.type_payment_id,
                    category_id: movement.category.id,
                    sub_category_id: movement.sub_category?.id || ''
                }
            );
            setSelectedCategory(movement.category.id);
        }
    }, [movement]);

    useEffect(() => {
        if (selectedCategory !== null) {
            const category = categories.find(cat => cat.id === selectedCategory);
            if (category) {
                setSubCategories(category.sub_categories);
            } else {
                setSubCategories([]);
            }
        } else {
            setSubCategories([]);
        }
    }, [selectedCategory, categories]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value, type} = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : name === 'amount' ? parseFloat(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let adjustedAmount = Number(formData.amount);
        if (adjustedAmount <= 0) {
            adjustedAmount = -adjustedAmount;
        }
        try {
            const [year, month, day] = formData.date.split('-').map(Number);
            const dateWithNoTimezone = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));

            const formattedData = {
                ...formData,
                amount: adjustedAmount,
                date: format(dateWithNoTimezone, "yyyy-MM-dd'T'HH:mm:ssXXX"),
                category_id: formData.category_id,
                sub_category_id: formData.sub_category_id,
                type_payment_id: Number(formData.type_payment_id),
                wallet_id: formData.wallet_id
            };

            if (!formData.sub_category_id) {
                delete formattedData.sub_category_id;
            }

            if (isEditing && movement && movement) {
                await updateMovement(movement.id, formattedData);
            } else {
                await createMovement(formattedData);
            }

            onUpdateTransactions();
        } catch (error) {
            console.error('Error creating or updating movement:', error);
        }
    };

    return (
        <div>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="description">Rendimento</label>
                    <input type="text" id="description" name="description" value={formData.description}
                           onChange={handleChange}/>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="amount">Valor</label>
                    <input type="number" step="0.01" id="amount" name="amount" value={formData.amount}
                           onChange={handleChange}/>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="date">Data</label>
                    <input type="date" id="date" name="date" value={formData.date} onChange={handleChange}/>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="is_paid">Pago</label>
                    <input type="checkbox" id="is_paid" name="is_paid" checked={formData.is_paid}
                           onChange={handleChange}/>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="is_recurrent">Recorrente</label>
                    <input type="checkbox" id="is_recurrent" name="is_recurrent" checked={formData.is_recurrent}
                           onChange={handleChange}/>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="wallet_id">Carteira</label>
                    <select id="wallet_id" name="wallet_id" value={formData.wallet_id} onChange={handleChange}>
                        <option key="" value="">Selecione uma Carteira</option>
                        {wallets.map(wallet => (
                            <option key={wallet.id} value={wallet.id}>{wallet.description}</option>
                        ))}
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="category_id">Categoria</label>
                    <select id="category_id" name="category_id" value={formData.category_id} onChange={(e) => {
                        handleChange(e);
                        setSelectedCategory(e.target.value);
                    }}>
                        <option key="" value="">Selecione uma categoria</option>
                        {categories.filter(category => category.is_income).map(category => (
                            <option key={category.id} value={category.id}>{category.description}</option>
                        ))}
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="sub_category_id">Subcategoria</label>
                    <select id="sub_category_id" name="sub_category_id" value={formData.sub_category_id}
                            onChange={handleChange}>
                        <option key="" value="">Selecione uma subcategoria</option>
                        {subCategories.map(subcategory => (
                            <option key={subcategory.id} value={subcategory.id}>{subcategory.description}</option>
                        ))}
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="type_payment_id">Forma de Pagamento</label>
                    <select id="type_payment_id" name="type_payment_id" value={formData.type_payment_id}
                            onChange={handleChange}>
                        <option key="" value="">Selecione</option>
                        {mockTypePayment.map(type => (
                            <option key={type.id} value={type.id}>{type.description}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" className={styles.submitButton}>{isEditing ? 'Atualizar' : 'Adicionar'}</button>
            </form>
        </div>
    );
};

export default IncomeForm;