import axios from 'axios';
import Cookies from "js-cookie";

const baseUrl = process.env.BASE_URL || 'http://localhost:8080';

type Balance = {
    expense: number;
    income: number;
    period_balance: number;
}

export type Wallet = {
    id: string
    description: string;
    balance: number;
    initial_balance: number;
    initial_date: string;
}

export type Movement = {
    id: string;
    description: string;
    amount: number;
    date: string;
    is_paid: boolean;
    is_recurrent: boolean;
    wallet: Wallet;
    type_payment_id: number;
    category: Category
    sub_category?: SubCategory
};

type SubCategory = {
    id: string;
    description: string;
};

export type Category = {
    id: string;
    description: string;
    is_income: boolean;
    user_id: string;
    sub_categories: SubCategory[];
};

export type AddMovement = {
    id?: string;
    description: string;
    amount: number;
    date: string;
    is_paid: boolean;
    wallet_id: string;
    type_payment_id: number;
    category_id: string;
    sub_category_id?: string;
};

// TODO alterar chamadas para 'fetch' considerando usar cache do next
const api = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = Cookies.get('user_token');
        if (token) {
            config.headers['user_token'] = `${token}`;
        } else {
            return Promise.reject(new Error('Token não encontrado, redirecionando para a tela de login.'));
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            Cookies.remove('user_token');
            window.location.reload();
        }
        return Promise.reject(error);
    }
);

export const getBalance = async (from: string, to: string) => {
    try {
        const response = await api.get('/balance/estimate/period', {
            params: {
                from,
                to
            }
        });
        return toBalance(response.data);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const toBalance = (response: any): Balance => {
    return {
        expense: response.expense,
        income: response.income,
        period_balance: response.period_balance
    }
}

const toWallets = (response: any): Wallet[] => {
    return response.map((wallet: any) => (toWallet(wallet)));
}

const toWallet = (wallet: any): Wallet => {
    return {
        id: wallet.id,
        description: wallet.description,
        balance: wallet.balance,
        initial_balance: wallet.initial_balance,
        initial_date: wallet.initial_date
    };
}

export const getWallets = async () => {
    try {
        const response = await api.get('/wallets');
        return toWallets(response.data);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const addWallet = async (description: string, initial_balance: number, initial_date: string) => {
    try {
        const response = await api.post('/wallets', {
            description,
            initial_balance,
            initial_date
        });
        return response.data;
    } catch (error) {
        console.error('Error creating wallet', error);
        throw error;
    }
}

export const updateWallet = async (id: string, initial_balance: number, initial_date: string, description: string) => {
    try {
        const response = await api.put(`/wallets/${id}`, {
            description,
            initial_balance,
            initial_date
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating wallet with id ${id}`, error);
        throw error;
    }
};

const toMovements = (response: any): Movement[] => {
    return response.map((movement: any): Movement => {
        const sub = toSubCategory(movement.sub_category);
        return {
            id: movement.id,
            description: movement.description,
            amount: movement.amount,
            date: movement.date,
            is_paid: movement.is_paid,
            is_recurrent: movement.is_recurrent,
            wallet: toWallet(movement.wallet),
            type_payment_id: movement.type_payment_id,
            category: toCategory(movement.category),
            sub_category: sub
        };
    });
}

export const getMovements = async (from: string, to: string): Promise<Movement[]> => {
    try {
        const response = await api.get('/movements/period', {
            params: {
                from,
                to
            }
        });
        return toMovements(response.data);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const toCategories = (response: any): Category[] => {
    return response.map((category: any) => (toCategory(category)))
}

const toCategory = (category: any): Category => {
    const sub = category.sub_categories ? category.sub_categories.map((sub: any) => ({
        id: sub.id,
        description: sub.description
    })) : [];

    return {
        id: category.id,
        description: category.description,
        user_id: category.user_id,
        is_income: category.is_income,
        sub_categories: sub
    };
}

const toSubCategory = (subCategory: any): SubCategory => {
    if (!subCategory) {
        return {
            id: '',
            description: ''
        };
    }
    return {
        id: subCategory.id,
        description: subCategory.description
    };
}

export const getCategories = async (): Promise<Category[]> => {
    try {
        const response = await api.get('/categories');
        return toCategories(response.data);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const createMovement = async (movement: AddMovement) => {
    try {
        const response = await api.post('/movements/simple', movement);
        return response.data;
    } catch (error) {
        console.error('Error creating movement', error);
        throw error;
    }
};

export const updateMovement = async (id: string, movement: AddMovement) => {
    try {
        const response = await api.put(`/movements/${id}`, movement);
        return response.data;
    } catch (error) {
        console.error(`Error updating movement with id ${id}`, error);
        throw error;
    }
};

export const deleteMovement = async (id: string) => {
    try {
        const response = await api.delete(`/movements/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting movement with id ${id}`, error);
        throw error;
    }
};

export const payMovement = async (id: string) => {
    try {
        const response = await api.post(`/movements/${id}/pay`);
        return response.data;
    } catch (error) {
        console.error(`Error paying movement with id ${id}`, error);
        throw error;
    }
};

export const revertPayMovement = async (id: string) => {
    try {
        const response = await api.post(`/movements/${id}/pay/revert`);
        return response.data;
    } catch (error) {
        console.error(`Error reverting pay movement with id ${id}`, error);
        throw error;
    }
};

export const getEstimate = async (month: number, year: number) => {
    try {
        const response = await api.get('/estimate', {
            params: {
                month,
                year
            }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch estimate:', error);
        throw error;
    }
};

export type Estimate = {
    id?: string;
    category_id: string;
    category_name: string;
    is_category_income: boolean;
    month: number;
    year: number;
    amount: number;
};

export const createEstimate = async (estimate: Estimate) => {
    try {
        const response = await api.post('/estimate', estimate);
        return response.data;
    } catch (error) {
        console.error('Error creating estimate', error);
        throw error;
    }
};

export type SubEstimate = {
    id: string;
    sub_category_id: string;
    sub_category_name: string;
    estimate_category_id: string;
    month: number;
    year: number;
    amount: number;
};

export type AddSubEstimateDTO = {
    sub_category_id: string;
    sub_category_name: string;
    estimate_category_id: string;
    month: number;
    year: number;
    amount: number;
};

export const createSubEstimate = async (subEstimate: AddSubEstimateDTO) => {
    try {
        const response = await api.post('/sub-estimate', subEstimate);
        return response.data;
    } catch (error) {
        console.error('Error creating sub-estimate', error);
        throw error;
    }
};

export const updateEstimate = async (id: string, amount: number) => {
    try {
        const response = await api.put(`/estimate/${id}`, {amount});
        return response.data;
    } catch (error) {
        console.error(`Error updating estimate with id ${id}`, error);
        throw error;
    }
};

export const updateSubEstimate = async (id: string, amount: number) => {
    try {
        const response = await api.put(`/sub-estimate/${id}`, {amount});
        return response.data;
    } catch (error) {
        console.error(`Error updating estimate with id ${id}`, error);
        throw error;
    }
};