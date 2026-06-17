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

export async function deleteEmployee(token, employeeId) {
    const response = await fetch(`${API_BASE_URL}/employees/${employeeId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        }
    })

    const result = await response.json()

    if (!response.ok) {
        const error = new Error(result.error || 'Failed to delete employee')
        error.status = response.status
        throw error
    }

    return result
}

export async function updateEmployee(token, employeeId, data) {
    const response = await fetch(`${API_BASE_URL}/employees/${employeeId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    })

    const text = await response.text()
    console.log('response status:', response.status)
    console.log('response body:', text)
    const result = text ? JSON.parse(text) : {}

    if (!response.ok) {
        const error = new Error(result.error || 'Failed to update employee')
        error.status = response.status
        throw error
    }

    return result
}