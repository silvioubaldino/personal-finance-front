import React from 'react';

type SubCategory = {
    id: string;
    description: string;
};

type SubCategoryListProps = {
    subCategories: SubCategory[];
};

const SubCategoryList: React.FC<SubCategoryListProps> = ({ subCategories }) => {
    return (
        <div>
            <h2>Subcategories</h2>
            <ul>
                {subCategories.map(subCategory => (
                    <li key={subCategory.id}>
                        {subCategory.description}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SubCategoryList;