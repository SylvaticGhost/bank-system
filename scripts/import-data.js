const { PrismaClient } = require('@prisma/client');
const fs = require('fs-extra');
require('dotenv').config();

const prismaClient = new PrismaClient({
    datasources: { db: { url: process.env.DATABASE_URL } }
});

async function importData() {
    console.log('Importing data...')
    try {
        const users = await fs.readJson('users.json')
        await prismaClient.user.createMany({ data: users })
        
        const accounts = await fs.readJson('accounts.json')
        await prismaClient.account.createMany({ data: accounts })
        
        const operations = await fs.readJson('operations.json')
        await prismaClient.operation.createMany({ data: operations })
        
        const blockedUsers = await fs.readJson('blockedUsers.json')
        await prismaClient.blockedUser.createMany({ data: blockedUsers })
        
        const blockedAccounts = await fs.readJson('blockedAccounts.json')
        await prismaClient.blockedAccount.createMany({ data: blockedAccounts })
        
        const depositInfos = await fs.readJson('depositInfos.json')
        await prismaClient.depositInfo.createMany({ data: depositInfos })
        
        console.log('Data imported successfully!')
    }
    catch (error) {
        console.error(error)
    }
    finally {
        await prismaClient.$disconnect()
    }
}

importData()