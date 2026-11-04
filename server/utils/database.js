import mongoose from 'mongoose'

export const isMongoReady = () => mongoose.connection.readyState === 1
