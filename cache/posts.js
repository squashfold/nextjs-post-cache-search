const path = require('path')
const fs = require('fs') // Filesystem lets us create files and directories
const greyMatter = require('gray-matter') // Parses data from posts

function getPostData() {
  const postsDirectory = path.join(process.cwd(), '_posts') 
  const fileNames = fs.readdirSync(postsDirectory)
  const posts = fileNames.map((fileName) => {
    const postId = fileName.replace(/\.md$/, '') // Replace with mdx if using MarkdownX
    const fullPath = path.join(postsDirectory, fileName)
    const postData = fs.readFileSync(fullPath, 'utf8')
    const result = greyMatter(postData)
    return {
      postId,
      slug: postId,
      title: result.data.title,
      coverImage: result.data.coverImage,
      excerpt: result.data.excerpt,
      date: result.data.date,
      author: result.data.author,
    }
  })

  const postsData = `export const data = ${JSON.stringify(posts)}`

  return postsData
}

try {
  fs.readdirSync('cache')
} catch (e) {
  fs.mkdirSync('cache')
}

// Create a new directory 'data' within the cache folder
fs.mkdir(path.join(__dirname, 'data'),
{ recursive: true }, (error) => {
  if (error) {
    return console.error(error)
  }

  console.log('Directory created successfully!')

  // Write cache file
  fs.writeFile(`${path.join(__dirname, 'data')}/posts.js`, getPostData(), function (error) {
    if (error) {
      return console.log(error)
    }  
    
    console.log(`Posts cached!`)
  })
});