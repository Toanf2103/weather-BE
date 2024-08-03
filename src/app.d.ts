import { User } from './modules/user/entities'

declare global {
  namespace Express {
    interface Request {
      user?: User | null
    }
  }
}
