import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../contexts/AuthContext.jsx'
import { createRecipe } from '../api/recipes.js'

export function CreateRecipe() {
    const [token] = useAuth()
    const queryClient = useQueryClient()

    const [title, setTitle] = useState('')
    const [ingredients, setIngredients] = useState('')
    const [imageUrl, setImageUrl] = useState('')

    const createRecipeMutation = useMutation({
        mutationFn: (recipeData) => createRecipe(token, recipeData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recipes'] })
            setTitle('')
            setIngredients('')
            setImageUrl('')
        },
    })

    function handleSubmit(event) {
        event.preventDefault()

        const recipeData = {
            title: title.trim(),
            ingredients: ingredients
                .split('\n')
                .map((ingredient) => ingredient.trim())
                .filter(Boolean),
            imageUrl: imageUrl.trim(),
        }

        createRecipeMutation.mutate(recipeData)
    }

    if (!token) {
        return null
    }

    return (
        <section>
            <h2>Share a Recipe</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="recipe-title">Recipe title</label>
                    <br />
                    <input
                        id="recipe-title"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        required
                    />
                </div>

                <br />

                <div>
                    <label htmlFor="recipe-ingredients">
                        Ingredients (enter one ingredient per line)
                    </label>
                    <br />
                    <textarea
                        id="recipe-ingredients"
                        value={ingredients}
                        onChange={(event) => setIngredients(event.target.value)}
                        rows={5}
                        required
                    />
                </div>

                <br />

                <div>
                    <label htmlFor="recipe-image">Image URL</label>
                    <br />
                    <input
                        id="recipe-image"
                        type="url"
                        value={imageUrl}
                        onChange={(event) => setImageUrl(event.target.value)}
                        placeholder="https://example.com/recipe.jpg"
                        required
                    />
                </div>

                <br />

                <button type="submit" disabled={createRecipeMutation.isPending}>
                    {createRecipeMutation.isPending ? 'Saving...' : 'Share Recipe'}
                </button>
            </form>

            {createRecipeMutation.isError && (
                <p role="alert">
                    Could not create recipe: {createRecipeMutation.error.message}
                </p>
            )}

            {createRecipeMutation.isSuccess && (
                <p role="status">Recipe created successfully!</p>
            )}
        </section>
    )
}