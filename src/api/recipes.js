const API_URL = import.meta.env.VITE_BACKEND_URL

export async function getRecipes(sortBy = 'newest') {
    const response = await fetch(`${API_URL}/recipes?sortBy=${sortBy}`)

    if (!response.ok) {
        throw new Error('Failed to fetch recipes')
    }

    return await response.json()
}

export async function createRecipe(token, recipeData) {
    const response = await fetch(`${API_URL}/recipes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(recipeData),
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || 'Failed to create recipe')
    }

    return await response.json()
}
// Sends a POST request to the backend with the user's JWT token and recipe ID
export async function likeRecipe(token, recipeId) {
    const response = await fetch(`${API_URL}/recipes/${recipeId}/likes`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || 'Failed to like recipe')
    }

    return await response.json()
}

export async function unlikeRecipe(token, recipeId) {
    const response = await fetch(`${API_URL}/recipes/${recipeId}/likes`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || 'Failed to unlike recipe')
    }
}
export async function getRecipeById(recipeId) {
    const response = await fetch(`${API_URL}/recipes/${recipeId}`)

    if (!response.ok) {
        throw new Error('Failed to fetch recipe')
    }

    return await response.json()
}
