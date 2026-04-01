const api = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 5000,
});
let isRefreshing = false;
let queue = [];

api.interceptors.response.use(
    res => res,
    async err => {

        const original = err.config;

        if (err.response?.status === 401 && !original._retry) {

            original._retry = true;

            if (isRefreshing) return new Promise(resolve => {
                queue.push(() => resolve(api(original)));
            });

            isRefreshing = true;

            try {

                await axios.post("/api/auth/refresh");
                queue.forEach(cb => cb());
                queue = [];

                return api(original);

            } finally {

                isRefreshing = false;
            }
        }

        return Promise.reject(err);
    }
);

export const apiRequest = async ({ method, url, params, data }) =>{

    try {

        const response = await api({ method, url, params, data });

        return response;

    } catch (error) {

        throw error;
    }
}