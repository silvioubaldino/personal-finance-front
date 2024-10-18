import axios from 'axios';

const baseUrl = process.env.BASE_URL || 'http://localhost:8080';

type Balance = {
    expense: number;
    income: number;
    period_balance: number;
}

export type Wallets = {
    description: string;
    balance: number;
}

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
