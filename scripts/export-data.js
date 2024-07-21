const { PrismaClient } = require('@prisma/client')
const fs = require('fs-extra')
require('dotenv').config()

const prismaClient = new PrismaClient({
    datasources: {
        db: {
        url: process.env.DATABASE_URL,
        },
    },
})

async function exportData() {
    console.log('Exporting data...')
    try {
        const users = await prismaClient.user.findMany()
        await fs.writeJson('users.json', users)
        
        const accounts = await prismaClient.account.findMany()
        await fs.writeJson('accounts.json', accounts)
        
        const operations = await prismaClient.operation.findMany()
        await fs.writeJson('operations.json', operations)
        
        const blockedUsers = await prismaClient.blockedUser.findMany()
        await fs.writeJson('blockedUsers.json', blockedUsers)
        
        console.log('Data exported successfully!')
    }
    catch (error) {
        console.error(error)
    }
    finally {
        await prismaClient.$disconnect()
    }
}

exportData()