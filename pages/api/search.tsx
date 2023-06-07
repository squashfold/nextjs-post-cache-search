import type { NextApiRequest, NextApiResponse } from 'next'
import type Post from '../../interfaces/post'

const posts = require('../../cache/data/posts').data

export default (req: NextApiRequest, res: NextApiResponse) => {
  const query = req.query.query ? req.query.query.toString().toLowerCase() : ''
  const results: Post[] = query.length ? posts.filter(post => post.title.toLowerCase().includes(req.query.query)) : posts

  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify({ results }))
}