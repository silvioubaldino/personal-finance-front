import React, { useState } from 'react';
import styles from '../styles/categories.module.css';

type Category = {
    id: string;
    description: string;
};

type CategoryListProps = {
    categories: Category[];
    onSelectCategory: (categoryId: string) => void;
};

const CategoryList: React.FC<CategoryListProps> = ({ categories, onSelectCategory }) => {
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

    const handleCategoryClick = (categoryId: string) => {
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