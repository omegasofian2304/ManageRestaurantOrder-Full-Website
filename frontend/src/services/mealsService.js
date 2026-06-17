const API_BASE_URL = 'http://localhost:3000';

export async function fetchAllMealsService(token) {
    const response = await fetch(`${API_BASE_URL}/meals`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const error = new Error('Failed to fetch meals');
        error.status = response.status;
        throw error;
    }

    return await response.json();
}