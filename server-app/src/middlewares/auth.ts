import type { Request, Response, NextFunction } from 'express'
import { UnauthenticatedError, UnauthorizedError } from './errorHandler.js'
import { UserType } from '../types/index.js'
import type { ProviderRoleTitle } from '@prisma/client'

const authenticate = (userType: UserType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log('🔍 Auth Debug:')
    console.log('Session ID:', req.sessionID)
    console.log('Session exists:', !!req.session)
    console.log('Session user:', req.session?.user)
    console.log('Cookie header:', req.headers.cookie)
    console.log('User-Agent:', req.headers['user-agent'])
    console.log('X-Forwarded-For:', req.headers['x-forwarded-for'])
    
    const user = req.session.user
    if (!user) throw new UnauthenticatedError('You need to login first')

    if (user.type !== userType) throw new UnauthorizedError('Access denied')

    req.user = user
    next()
  }
}

const authorize = (roleTitles: ProviderRoleTitle[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthenticatedError('You need to login first')
    }

    const providerRole = req.user?.roleTitle

    if (!providerRole || !roleTitles.includes(providerRole)) {
      throw new UnauthorizedError('Access denied')
    }
    next()
  }
}

const authenticateMultipleUser =
  (allowedUsers: UserType[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const user = req.session.user
    if (!user) throw new UnauthenticatedError('Not authenticated')

    if (!allowedUsers.includes(user.type)) {
      throw new UnauthorizedError('Access denied')
    }

    req.user = user
    next()
  }

export { authenticate, authorize, authenticateMultipleUser }
