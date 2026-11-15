
import mongoose from 'mongoose'
import { Like } from '../db/models/like.js'
import { Recipe } from '../db/models/recipe.js'

// Handle liking recipes in MongoDB

export async function likeRecipe(userId, recipeId) {
    if (!mongoose.isValidObjectId(recipeId)) {
        return null
    }

    const recipe = await Recipe.findById(recipeId)

    if (!recipe) {
        return null
    }

    return await Like.create({
        user: userId,
        recipe: recipeId,
    })
}
// unliking recipes in MongoDB
export async function unlikeRecipe(userId, recipeId) {
    if (!mongoose.isValidObjectId(recipeId)) {
        return null
    }

    return await Like.findOneAndDelete({
        user: userId,
        recipe: recipeId,
    })
}
