import type { NextApiRequest, NextApiResponse } from 'next'
import type Post from '../../interfaces/post'
import Fuse from 'fuse.js'

const posts = require('../../cache/data/posts').data

export default (req: NextApiRequest, res: NextApiResponse) => {
  const fuse = new Fuse(posts, {keys: ['title', 'excerpt']})
  const query = req.query.query ? req.query.query.toString().toLowerCase() : ''
  const results: Post[] = query.length ? fuse.search(query) : posts

  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify({ results }))
}