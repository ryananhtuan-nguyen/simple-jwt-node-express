import express, { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()
const app = express()

app.use(express.json())

//Need to store in db
let refreshTokens: string[] = []

interface User {
  name: string
}

function generateAccessToken(user: User) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: '15s',
  })
}

app.post('/login', (req: Request, res: Response) => {
  console.log('Hello world')
  // Authenticate User
  const username = req.body.username
  const user: User = {
    name: username,
  }
  const accessToken = generateAccessToken(user)
  const refreshToken = jwt.sign(
    user,
    process.env.REFRESH_TOKEN_SECRET as string
  )
  refreshTokens.push(refreshToken)
  res.json({ accessToken, refreshToken })
})

app.post('/token', (req: Request, res: Response) => {
  const refreshToken = req.body.token
  if (refreshToken == null) res.sendStatus(401)
  if (!refreshTokens.includes(refreshToken)) res.sendStatus(403)

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as string,
    (err: any, user: any) => {
      if (err) return res.sendStatus(403)
      const accessToken = generateAccessToken({ name: (user as User).name })
      res.json({ accessToken })
    }
  )
})

app.delete('/logout', (req: Request, res: Response) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token)
  res.sendStatus(204)
})

app.listen(3001, () => {
  console.log('Server is running on port 3001')
})
