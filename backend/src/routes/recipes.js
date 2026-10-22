import { requireAuth } from '../middleware/jwt.js'
import {
    listAllRecipes,
    getRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe,
} from '../services/recipes.js'

export function recipesRoutes(app) {
    // List all recipes
    app.get('/api/v1/recipes', async (req, res) => {
        try {
            return res.json(await listAllRecipes())
        } catch (err) {
            console.error('Error listing recipes:', err)
            return res.status(500).json({ error: 'Failed to list recipes' })
        }
    })

    // Get one recipe
    app.get('/api/v1/recipes/:id', async (req, res) => {
        try {
            const recipe = await getRecipeById(req.params.id)

            if (!recipe) {
                return res.status(404).json({ error: 'Recipe not found' })
            }

            return res.json(recipe)
        } catch (err) {
            console.error('Error getting recipe:', err)
            return res.status(500).json({ error: 'Failed to get recipe' })
        }
    })

    // Create a recipe (login required)
    app.post('/api/v1/recipes', requireAuth, async (req, res) => {
        try {
            const recipe = await createRecipe(req.auth.sub, req.body)
            return res.status(201).json(recipe)
        } catch (err) {
            console.error('Error creating recipe:', err)

            if (err.message === 'Invalid recipe data') {
                return res.status(400).json({ error: err.message })
            }

            return res.status(500).json({ error: 'Failed to create recipe' })
        }
    })

    // Update your own recipe (login required)
    app.patch('/api/v1/recipes/:id', requireAuth, async (req, res) => {
        try {
            const recipe = await updateRecipe(
                req.auth.sub,
                req.params.id,
                req.body,
            )

            if (!recipe) {
                return res.status(404).json({
                    error: 'Recipe not found or you are not the author',
                })
            }

            return res.json(recipe)
        } catch (err) {
            console.error('Error updating recipe:', err)

            if (err.message === 'Invalid recipe data') {
                return res.status(400).json({ error: err.message })
            }

            return res.status(500).json({ error: 'Failed to update recipe' })
        }
    })

    // Delete your own recipe (login required)
    app.delete('/api/v1/recipes/:id', requireAuth, async (req, res) => {
        try {
            const { deletedCount } = await deleteRecipe(
                req.auth.sub,
                req.params.id,
            )

            if (deletedCount === 0) {
                return res.status(404).json({
                    error: 'Recipe not found or you are not the author',
                })
            }

            return res.status(204).end()
        } catch (err) {
            console.error('Error deleting recipe:', err)
            return res.status(500).json({ error: 'Failed to delete recipe' })
        }
    })
}