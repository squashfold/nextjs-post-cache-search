import type { NextApiRequest, NextApiResponse } from 'next'
import type Post from '../../interfaces/post'
import Fuse from 'fuse.js'

const posts = require('../../cache/data/posts').data

export default (req: NextApiRequest, res: NextApiResponse) => {
  const fuse = new Fuse(posts, {keys: ['title', 'excerpt']}) // Specify which fields from the cache we should check for matches against
  const query = req.query.query ? req.query.query.toString().toLowerCase() : '' // Convert the query to lower case so matches aren't case sensitive
  const results: Post[] = query.length ? fuse.search(query) : posts // Find posts which match, or return all of them

  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify({ results }))
}