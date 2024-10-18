import axios from 'axios';

const baseUrl = process.env.BASE_URL || 'http://localhost:8080';

type Balance = {
    expense: number;
    income: number;
    period_balance: number;
}

const api = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
        // 'user_token': 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjhkOWJlZmQzZWZmY2JiYzgyYzgzYWQwYzk3MmM4ZWE5NzhmNmYxMzciLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcGVyc29uYWwtZmluYW5jZS1kZDJlMiIsImF1ZCI6InBlcnNvbmFsLWZpbmFuY2UtZGQyZTIiLCJhdXRoX3RpbWUiOjE3MjkyMDAzMTYsInVzZXJfaWQiOiJlM01VclpBZGp3ZzUwTUNkSE9lTDRtMVJpc1YyIiwic3ViIjoiZTNNVXJaQWRqd2c1ME1DZEhPZUw0bTFSaXNWMiIsImlhdCI6MTcyOTIwMDMxNiwiZXhwIjoxNzI5MjAzOTE2LCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsidGVzdEB0ZXN0LmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.A0U1XFP0m1-pRFs3e4TdfNdPRutrl6j74rXaYa2Az72fm3ARa6NbFr2m3-6b6sro4tYpDqu4geQpEftfo91bPplgWhJ0dtGgL_XzI6XARmQ6N1WxTycxOj0yI4tL8AK85CZJ2TmQfKI7TmXkp59dSqKe5U7I3UT5twDC-HtF8Qui4vG6hh-UmlrJ88gH81BrGJUOTLC3PYanhnHw-5587zNK36a_Ev9dixnZmPcaqiJSxWy44M8AmYDQKathyor_9fyno8Ah1eXcWMggbEq86WxMmjxaEjK5cXcERtapMmM_MTWg9HZeXNTiL0ezuAKo-a3Z_5cRtJCCFcffwQx7xw'
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