'use client';
import React, {useEffect, useState} from 'react';
import {getCategories} from '@/services/api';
import CategoryList from "@/app/categories/components/category-list";
import SubCategoryList from "@/app/categories/components/subcategory-list";
import styles from './styles/categories.module.css';

type Category = {
    id: number;
    description: string;
    sub_categories: SubCategory[];
};

type SubCategory = {
    id: number;
    description: string;
};

const CategoriesPage = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedSubCategories, setSelectedSubCategories] = useState<SubCategory[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoriesData = await getCategories();
                setCategories(categoriesData);
            } catch (error) {
                console.error('Error fetching categories', error);
            }
        };

        fetchCategories();
    }, []);

    const handleSelectCategory = (categoryId: number) => {
        const selectedCategory = categories.find(category => category.id === categoryId);
        if (selectedCategory) {
            setSelectedSubCategories(selectedCategory.sub_categories);
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.categoriesContainer}>
                <div className={styles.categoryList}>
                    <CategoryList categories={categories} onSelectCategory={handleSelectCategory}/>
                </div>
                <div className={styles.subcategoryList}>
                    <SubCategoryList subCategories={selectedSubCategories}/>
                </div>
            </div>
        </div>
    );
};

export default CategoriesPage;