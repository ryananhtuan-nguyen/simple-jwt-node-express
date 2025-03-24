import express, { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()
const app = express()

app.use(express.json())

interface Post {
  username: string
  title: string
}

interface User {
  name: string
}

interface AuthRequest extends Request {
  user?: User
}

const posts: Post[] = [
  {
    username: 'Me',
    title: 'Post 1',
  },
  {
    username: 'You',
    title: 'Post 2',
  },
]

function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) {
    res.sendStatus(401)
    return
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, user) => {
    if (err) {
      res.sendStatus(403)
      return
    }
    req.user = user as User
    next()
  })
}

app.get('/posts', authenticateToken, (req: AuthRequest, res: Response) => {
  res.json(posts.filter((post) => post.username === req.user?.name))
})

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
