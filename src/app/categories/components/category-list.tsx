import React, { useState } from 'react';
import styles from '../styles/categories.module.css';

type Category = {
    id: number;
    description: string;
};

type CategoryListProps = {
    categories: Category[];
    onSelectCategory: (categoryId: number) => void;
};

const CategoryList: React.FC<CategoryListProps> = ({ categories, onSelectCategory }) => {
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

    const handleCategoryClick = (categoryId: number) => {
        setSelectedCategoryId(categoryId);
        onSelectCategory(categoryId);
    };

    return (
        <div>
            <h2>Categories</h2>
            <ul>
                {categories.map(category => (
                    <li
                        key={category.id}
                        onClick={() => handleCategoryClick(category.id)}
                        className={selectedCategoryId === category.id ? styles.selected : ''}
                    >
                        {category.description}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryList;