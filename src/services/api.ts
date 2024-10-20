import axios from 'axios';

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
    id?: string;
    description: string;
    category: string;
    sub_category?: string;
    date: string;
    amount: number;
    wallet: string;
};

type SubCategory = {
    id: number;
    description: string;
};

type Category = {
    id: number;
    description: string;
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
    category_id: number;
    sub_category_id: number;
};

// TODO alterar chamadas para 'fetch' considerando usar cache do next
const api = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

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