import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { Header } from '../components/Header.jsx'
import { getRecipeById, likeRecipe } from '../api/recipes.js'
import { useAuth } from '../contexts/AuthContext.jsx'

// Recipe Detail page
export function RecipeDetail() {
    const { id } = useParams()
    const [token] = useAuth()
    const queryClient = useQueryClient()
    const likeMutation = useMutation({
        mutationFn: () => likeRecipe(token, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recipe', id] })
            queryClient.invalidateQueries({ queryKey: ['recipes'] })
        },
    })
    // Get the Query Client
    const recipeQuery = useQuery({
        queryKey: ['recipe', id],
        queryFn: () => getRecipeById(id),
    })

    if (recipeQuery.isPending) {
        return <p>Loading recipe...</p>
    }

    if (recipeQuery.isError) {
        return <p role="alert">Could not load recipe.</p>
    }

    const recipe = recipeQuery.data

    // Display the header and Back to Home link
    return (
        <div style={{ padding: 16 }}>
            <Header />
            <Link
                to="/"
                style={{
                    display: 'inline-block',
                    marginTop: 20,
                    marginBottom: 12,
                }}
            >
                Back to Home
            </Link>

            {/* Display recipe information */}
            <h1>{recipe.title}</h1>
            <p>Created by: {recipe.author?.username ?? 'Unknown user'}</p>
            <p style={{ marginBottom: 12 }}>
                Likes: {recipe.likesCount ?? 0}

            </p>

            {/* Display the Like Recipe button */}
            {token ? (
                <button
                    onClick={() => likeMutation.mutate()}
                    disabled={likeMutation.isPending}
                    style={{
                        marginTop: 20,
                        marginBottom: 20,
                    }}
                >
                    {likeMutation.isPending ? 'Liking...' : 'Like Recipe'}
                </button>
            ) : (
                <p>Please log in to like this recipe.</p>
            )}

            {likeMutation.isError && (
                <p role="alert">{likeMutation.error.message}</p>
            )}

            <img
                src={recipe.imageUrl}
                alt={recipe.title}
                style={{ width: '100%', maxWidth: 500 }}
            />

            <h2>Ingredients</h2>
            <ul>
                {recipe.ingredients.map((ingredient, index) => (
                    <li key={`${ingredient}-${index}`}>{ingredient}</li>
                ))}
            </ul>
        </div>
    )
}