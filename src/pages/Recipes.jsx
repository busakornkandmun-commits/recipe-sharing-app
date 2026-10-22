import { useQuery } from '@tanstack/react-query'
import { Header } from '../components/Header.jsx'
import { CreateRecipe } from '../components/CreateRecipe.jsx'
import { getRecipes } from '../api/recipes.js'

export function Recipes() {
    const recipesQuery = useQuery({
        queryKey: ['recipes'],
        queryFn: getRecipes,
    })

    const recipes = recipesQuery.data ?? []

    return (
        <div style={{ padding: 16 }}>
            <Header />


            <CreateRecipe />

            <hr />

            <h2>Explore Recipes</h2>

            {recipesQuery.isPending && <p>Loading recipes...</p>}

            {recipesQuery.isError && (
                <p role="alert">
                    Sorry, we couldn't load recipes. Please try again.
                </p>
            )}

            {!recipesQuery.isPending &&
                !recipesQuery.isError &&
                recipes.length === 0 && (
                    <p>No recipes yet. Be the first to share a recipe!</p>
                )}

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: 20,
                }}
            >
                {recipes.map((recipe) => (
                    <article
                        key={recipe._id}
                        style={{
                            border: '1px solid #ddd',
                            borderRadius: 8,
                            padding: 16,
                        }}
                    >
                        <img
                            src={recipe.imageUrl}
                            alt={recipe.title}
                            style={{
                                width: '100%',
                                height: 180,
                                objectFit: 'cover',
                                borderRadius: 6,
                            }}
                        />

                        <h2>{recipe.title}</h2>
                        <p>
                            Created by: {recipe.author?.username ?? 'Unknown user'}
                        </p>

                        <h3>Ingredients</h3>
                        <ul>
                            {recipe.ingredients.map((ingredient, index) => (
                                <li key={`${ingredient}-${index}`}>{ingredient}</li>
                            ))}
                        </ul>
                    </article>
                ))}
            </div>
        </div>
    )
}