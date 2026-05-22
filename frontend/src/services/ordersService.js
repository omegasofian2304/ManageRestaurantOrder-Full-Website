const API_BASE_URL = 'http://localhost:3000';

export async function fetchAllOrdersService(token) {
    const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const error = new Error('Failed to fetch orders');
        error.status = response.status;
        throw error;
    }

    return await response.json();
}
export async function getOrderDetailService(token, orderId) {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const error = new Error('Failed to fetch order');
        error.status = response.status;
        throw error;
    }

    return await response.json();
}