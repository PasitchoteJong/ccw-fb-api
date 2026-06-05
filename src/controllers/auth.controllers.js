import createHttpError from 'http-errors'
import identityKeyUtil from '../utils/identity-key.util.js'
import { prisma } from '../lib/prisma.js'
import bcrypt from 'bcryptjs'
import { loginSchema, registerSchema } from '../validations/schema.js'
import jwt from 'jsonwebtoken'

export async function register(req, res, next) {
    // validation
    const data = await registerSchema.parseAsync(req.body)
    console.log('data =', data)
    //check identity is email or mobile
    const identityKey = data.email ? 'email' : 'mobile'
    console.log('identityKey =', identityKey)

    // find user for non-duplicate
    const haveUser = await prisma.user.findUnique({
        where: { [identityKey]: data[identityKey] }
    })

    if (haveUser) {
        return next(createHttpError[409]('This user already register'))
    }

    const result = await prisma.user.create({ data })

    const userInfo = {
        id: result.id,
        [identityKey]: result[identityKey],
        firstName: result.firstName,
        lastName: result.lastName,
    }

    res.json({
        message: 'Register Successful',
        user: userInfo
    })
}


export async function login(req, res, next) {
    const data = loginSchema.parse(req.body)
    const identityKey = data.email ? 'email' : 'mobile'
    // find this user
    const foundUser = await prisma.user.findFirst({
        where: { [identityKey]: data[identityKey] }
    })
    if (!foundUser) {
        return next(createHttpError[401]('Invalid Login 1'))
    }
    //check password
    let pwOk = await bcrypt.compare(data.password, foundUser.password)
    if (!pwOk) {
        return next(createHttpError[401]('Invalid Login 2'))
    }
    //create token
    const payload = { id: foundUser.id }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        algorithm: 'HS256',
        expiresIn: '15d'
    })
    //rip off -password, createdAt, updatedAt
    const { password, createdAt, updatedAt, ...userInfo } = foundUser

    res.json({
        message: 'Login controller',
        token: token,
        user: userInfo
    })
}

// maybe 
export async function getMe(req, res, next) {
    console.log(x)
    res.send('GetMe Controller')
}