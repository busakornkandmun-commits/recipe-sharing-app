import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Header } from '../components/Header.jsx'
import { CreateRecipe } from '../components/CreateRecipe.jsx'
import { getRecipes } from '../api/recipes.js'
import { Link } from 'react-router-dom'

export function Recipes() {
    const [sortBy, setSortBy] = useState('newest')

    const recipesQuery = useQuery({
        queryKey: ['recipes', sortBy],
        queryFn: () => getRecipes(sortBy),
    })


    const recipes = recipesQuery.data ?? []

    return (
        <div style={{ padding: 16 }}>
            <Header />


            <CreateRecipe />

            <hr />

            <h2>Explore Recipes</h2>


            {/* Sort Recipes */}
            <label htmlFor="sort-recipes">Sort recipes: </label>
            <select
                id="sort-recipes"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
            >
                <option value="newest">Newest first</option>
                <option value="least-liked">Least liked first</option>
            </select>

            {recipesQuery.isPending && <p>Loading recipes...</p>}

            {recipesQuery.isError && (
                <p role="alert">
                    Sorry, we couldn&apos;t load recipes. Please try again.
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
                    gridTemplateColumns: '1fr',
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
                                height: 290,
                                objectFit: 'cover',
                                borderRadius: 6,
                            }}
                        />

                        <h2>
                            <Link to={`/recipes/${recipe._id}`}>{recipe.title}</Link>
                        </h2>
                        <p>
                            Created by: {recipe.author?.username ?? 'Unknown user'}
                        </p>
                        <p>Likes: {recipe.likesCount ?? 0}</p>

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