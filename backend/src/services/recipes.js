import mongoose from 'mongoose'
import { Recipe } from '../db/models/recipe.js'

export async function createRecipe(userId, { title, ingredients, imageUrl }) {
    if (
        typeof title !== 'string' ||
        !title.trim() ||
        !Array.isArray(ingredients) ||
        ingredients.length === 0 ||
        ingredients.some(
            (ingredient) =>
                typeof ingredient !== 'string' || !ingredient.trim(),
        ) ||
        typeof imageUrl !== 'string' ||
        !imageUrl.trim()
    ) {
        throw new Error('Invalid recipe data')
    }

    const recipe = new Recipe({
        title: title.trim(),
        ingredients: ingredients.map((ingredient) => ingredient.trim()),
        imageUrl: imageUrl.trim(),
        author: userId,
    })

    return await recipe.save()
}

export async function listAllRecipes() {
    return await Recipe.find()
        .populate('author', 'username')
        .sort({ createdAt: 'descending' })
}

export async function getRecipeById(recipeId) {
    if (!mongoose.isValidObjectId(recipeId)) {
        return null
    }

    return await Recipe.findById(recipeId)
}

export async function updateRecipe(
    userId,
    recipeId,
    { title, ingredients, imageUrl },
) {
    if (!mongoose.isValidObjectId(recipeId)) {
        return null
    }

    if (
        typeof title !== 'string' ||
        !title.trim() ||
        !Array.isArray(ingredients) ||
        ingredients.length === 0 ||
        ingredients.some(
            (ingredient) =>
                typeof ingredient !== 'string' || !ingredient.trim(),
        ) ||
        typeof imageUrl !== 'string' ||
        !imageUrl.trim()
    ) {
        throw new Error('Invalid recipe data')
    }

    return await Recipe.findOneAndUpdate(
        { _id: recipeId, author: userId },
        {
            $set: {
                title: title.trim(),
                ingredients: ingredients.map((ingredient) => ingredient.trim()),
                imageUrl: imageUrl.trim(),
            },
        },
        { new: true, runValidators: true },
    )
}

export async function deleteRecipe(userId, recipeId) {
    if (!mongoose.isValidObjectId(recipeId)) {
        return { deletedCount: 0 }
    }

    return await Recipe.deleteOne({ _id: recipeId, author: userId })
}