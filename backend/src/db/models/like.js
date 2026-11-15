
import mongoose, { Schema } from 'mongoose'

const likeSchema = new Schema(
    {
        // This stores the ID of the user who liked the recipe
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        // This stores the ID of the recipe that the user liked
        recipe: {
            type: Schema.Types.ObjectId,
            ref: 'recipe',
            required: true,
        },
    },
    { timestamps: true },
)
// Prevent duplicate likes
likeSchema.index({ user: 1, recipe: 1 }, { unique: true })

export const Like = mongoose.model('like', likeSchema)
