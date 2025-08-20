import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import config from '../config/config.js'
import { UnauthenticatedError, UnauthorizedError } from './errorHandler.js'
import { UserType } from '../types/index.js'
import type { ProviderRoleTitle } from '@prisma/client'

const authenticate = (userType: UserType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthenticatedError('You need to login first')
      }
      
      const token = authHeader.substring(7)
      
      if (!token) {
        throw new UnauthenticatedError('You need to login first')
      }
      
      const decoded = jwt.verify(token, config.JWT_SECRET) as any
      
      if (decoded.type !== userType) {
        throw new UnauthorizedError('Access denied')
      }
      
      req.user = decoded
      next()
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthenticatedError('Invalid token')
      }
      throw error
    }
  }
}

const authorize = (roleTitles: ProviderRoleTitle[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if (!user) throw new UnauthenticatedError('You need to login first')

    if (user.type !== UserType.PROVIDER) 
      throw new UnauthorizedError('Access denied')

    if (!user.roleTitle || !roleTitles.includes(user.roleTitle)) 
      throw new UnauthorizedError('Access denied')

    next()
  }
}

const authenticateMultipleUser =
  (allowedUsers: UserType[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthenticatedError('You need to login first')
      }
      
      const token = authHeader.substring(7)
      
      if (!token) {
        throw new UnauthenticatedError('You need to login first')
      }
      
      const decoded = jwt.verify(token, config.JWT_SECRET) as any
      
      if (!allowedUsers.includes(decoded.type)) {
        throw new UnauthorizedError('Access denied')
      }
      
      req.user = decoded
      next()
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthenticatedError('Invalid token')
      }
      throw error
    }
  }

export { authenticate, authorize, authenticateMultipleUser }
