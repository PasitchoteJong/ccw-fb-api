import { prisma } from "../lib/prisma.js";

export async function getUserBy(field, value) {
    return await prisma.user.findFirst({
        where: { [field]: value }
    })
}

// getUserBy('id','3').then(console.log)
// getUserBy('firstName','gee').then(console.log)

export async function createUser(userData) {
    return await prisma.user.create({ data: userData })
}
