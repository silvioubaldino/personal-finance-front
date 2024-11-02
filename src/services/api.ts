import axios from 'axios';
import Cookies from "js-cookie";

const baseUrl = process.env.BASE_URL || 'http://localhost:8080';

type Balance = {
    expense: number;
    income: number;
    period_balance: number;
}

export type Wallets = {
    id: number
    description: string;
    balance: number;
}

export type Movement = {
    id: string;
    description: string;
    category: string;
    sub_category?: string;
    date: string;
    is_paid: boolean;
    amount: number;
    wallet: string;
};

type SubCategory = {
    id: string;
    description: string;
};

type Category = {
    id: string;
    description: string;
    is_income: boolean;
    user_id: string;
    sub_categories: SubCategory[];
};

export type AddMovement = {
    description: string;
    amount: number;
    date: string;
    is_paid: boolean;
    wallet_id: number;
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

const toWallets = (response: any): Wallets[] => {
    return response.map((wallet: any) => ({
        id: wallet.id,
        description: wallet.description,
        balance: wallet.balance
    }));
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

const toMovements = (response: any): Movement[] => {
    return response.map((movement: any) => ({
        id: movement.id,
        description: movement.description,
        category: movement.category.description,
        sub_category: movement.sub_category?.description,
        date: movement.date,
        is_paid: movement.is_paid,
        amount: movement.amount,
        wallet: movement.wallet.description
    }));
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
    return response.map((category: any) => ({
        id: category.id,
        description: category.description,
        user_id: category.user_id,
        is_income: category.is_income,
        sub_categories: category.sub_categories? category.sub_categories.map((sub: any) => ({
            id: sub.id,
            description: sub.description
        })) : []
    }));
};

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
    sub_category_id: string;
    category_name: string;
    estimate_category_id: string;
    month: number;
    year: number;
    amount: number;
};

export const createSubEstimate = async (subEstimate: SubEstimate) => {
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
        const response = await api.put(`/estimate/${id}`, { amount });
        return response.data;
    } catch (error) {
        console.error(`Error updating estimate with id ${id}`, error);
        throw error;
    }
};

export const updateSubEstimate = async (id: string, amount: number) => {
    try {
        const response = await api.put(`/sub-estimate/${id}`, { amount });
        return response.data;
    } catch (error) {
        console.error(`Error updating estimate with id ${id}`, error);
        throw error;
    }
};