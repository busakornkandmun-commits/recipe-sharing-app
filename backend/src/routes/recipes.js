import { requireAuth } from '../middleware/jwt.js'
import {
    listAllRecipes,
    getRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe,
} from '../services/recipes.js'
import {
    likeRecipe,
    unlikeRecipe,
} from '../services/likes.js'


export function recipesRoutes(app) {

    // Like a recipe (login required)
    app.post('/api/v1/recipes/:id/likes', requireAuth, async (req, res) => {
        try {
            const like = await likeRecipe(req.auth.sub, req.params.id)

            if (!like) {
                return res.status(404).json({ error: 'Recipe not found' })
            }

            // If User already Like it show this message
            return res.status(201).json(like)
        } catch (err) {
            if (err.code === 11000) {
                return res.status(409).json({ error: 'You already liked this recipe' })
            }

            console.error('Error liking recipe:', err)
            return res.status(500).json({ error: 'Failed to like recipe' })
        }
    })

    // Unlike a recipe (login required)
    app.delete('/api/v1/recipes/:id/likes', requireAuth, async (req, res) => {
        try {
            const like = await unlikeRecipe(req.auth.sub, req.params.id)

            if (!like) {
                return res.status(404).json({ error: 'Like not found' })
            }

            return res.status(204).end()
        } catch (err) {
            console.error('Error unliking recipe:', err)
            return res.status(500).json({ error: 'Failed to unlike recipe' })
        }
    })
    // List all recipes
    // Default newest recipes
    app.get('/api/v1/recipes', async (req, res) => {
        try {
            const { sortBy } = req.query
            return res.json(await listAllRecipes(sortBy))
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