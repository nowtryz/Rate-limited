import mongoose from 'mongoose'
import chalk from 'chalk'

export const initDatabase = async (options={}) => {
    // temporary: to follow mongo data updates
    mongoose.set('debug', true)
    // As from https://stackoverflow.com/questions/51960171/node63208-deprecationwarning-collection-ensureindex-is-deprecated-use-creat
    mongoose.set('useNewUrlParser', true)
    mongoose.set('useFindAndModify', false)
    mongoose.set('useCreateIndex', true)

    try {
        await mongoose.connect(`mongodb://localhost/rate-limited`, {
            useNewUrlParser: true,
            useUnifiedTopology : true, ...options
        })
    } catch (error) {
        console.error(chalk.red(`Connection error: ${error.stack}`))
        process.exit(1)
    }
}

export const closeConnection = () => mongoose.connection.close()
