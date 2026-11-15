import mongoose from 'mongoose'
import { Recipe } from '../db/models/recipe.js'
import { Like } from '../db/models/like.js'


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

// Calculate the number of likes for each recipe
export async function listAllRecipes(sortBy = 'newest') {
    const sort =
        sortBy === 'least-liked'
            ? { likesCount: 1, createdAt: -1 }
            : { createdAt: -1 }

    const recipes = await Recipe.aggregate([
        {
            $lookup: {
                from: Like.collection.name,
                localField: '_id',
                foreignField: 'recipe',
                as: 'likes',
            },
        },
        {
            $addFields: {
                likesCount: { $size: '$likes' },
            },
        },
        {
            $sort: sort,
        },
        {
            $project: {
                likes: 0,
            },
        },
    ])

    return await Recipe.populate(recipes, {
        path: 'author',
        select: 'username',
    })
}



export async function getRecipeById(recipeId) {
    if (!mongoose.isValidObjectId(recipeId)) {
        return null
    }

    const recipes = await Recipe.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(recipeId),
            },
        },
        {
            $lookup: {
                from: Like.collection.name,
                localField: '_id',
                foreignField: 'recipe',
                as: 'likes',
            },
        },
        {
            $addFields: {
                likesCount: { $size: '$likes' },
            },
        },
        {
            $project: {
                likes: 0,
            },
        },
    ])

    if (recipes.length === 0) {
        return null
    }

    return await Recipe.populate(recipes[0], {
        path: 'author',
        select: 'username',
    })
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