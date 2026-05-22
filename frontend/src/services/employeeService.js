/*
Author : Jason Edmonds, Sofian Hussein, Léo del Duca, Milo Soupper, Rodrigo Silva Riço
Date : 13.05.2026 - 20.05.2026
Title : employeeService.js
Desc : all API calls for employees
*/

const API_BASE_URL = 'http://localhost:3000'


export async function getAllEmployeesService(token) {
    const response = await fetch(`${API_BASE_URL}/employees`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })

    const result = await response.json()

    if (!response.ok) {
        const error = new Error(result.error || 'Failed to fetch employees')
        error.status = response.status
        throw error
    }

    return result
}


export async function createEmployeeService(token, data) {
    const response = await fetch(`${API_BASE_URL}/employees`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
        const error = new Error(result.error || 'Failed to create employee')
        error.status = response.status
        throw error
    }

    return result
}