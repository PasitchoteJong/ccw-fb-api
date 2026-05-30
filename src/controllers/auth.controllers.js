import createHttpError from 'http-errors'
import identityKeyUtil from '../utils/identity-key.util.js'
import { prisma } from '../lib/prisma.js'
import bcrypt from 'bcryptjs'
import { registerSchema } from '../validations/schema.js'

export async function register(req, res, next) {
    const { identity, firstName, lastName, password, confirmPassword } = req.body

    // // validation
    // if (!identity.trim() || !firstName.trim() || !lastName.trim() || !password.trim() || !confirmPassword.trim()) {
    //     return next(createHttpError[400]('fill all inputs'))
    // }
    // if (confirmPassword !== password) {
    //     return next(createHttpError[400]('check confirm-password '))
    // }
    // เปลี่ยนเป็น Register schema แทน
    const data = registerSchema.parse(req.body)



    const identityKey = identityKeyUtil(identity)
    if (!identityKey) {
        return next(createHttpError[400]('identity must be email or phone number'))
    }

    // find user for non-duplicate
    const haveUser = await prisma.user.findUnique({
        where: { [identityKey]: identity }
    })

    if (haveUser) {
        return next(createHttpError[409]('This user already register'))
    }

    const newUser = {
        [identityKey]: identity,
        password: await bcrypt.hash(password, 10),
        firstName: firstName,
        lastName: lastName
    }

    const result = await prisma.user.create({ data: newUser })

    res.json({
        message: 'Register Successful',
        identityKey: identityKey,
        // haveUser: haveUser
        result: result
    })
}

export function login(req, res) {
    res.json({
        msg: 'Login controller',
        body: req.body
    })
}