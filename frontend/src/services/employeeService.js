/*
Author : Jason Edmonds, Sofian Hussein, Milo Soupper, Rodrigo Silva Riço
Date : 13.05.2026 - 20.05.2026
Title : employeeService.js
Desc : Service for employee API calls
*/
const API_BASE_URL = 'http://localhost:3000';

export async function createEmployeeService(token, data) {
    const response = await fetch(`${API_BASE_URL}/employees`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
        const error = new Error(result.error || 'Failed to create employee');
        error.status = response.status;
        throw error;
    }

    return result;
}