const API_URL = import.meta.env.VITE_BACKEND_URL

export async function getRecipes() {
    const response = await fetch(`${API_URL}/recipes`)

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