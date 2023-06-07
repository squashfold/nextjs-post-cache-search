const path = require('path')
const fs = require('fs')
const greyMatter = require('gray-matter')

function getPostData() {
  const postsDirectory = path.join(process.cwd(), '_posts') 
  const fileNames = fs.readdirSync(postsDirectory)
  const posts = fileNames.map((fileName) => {
    const postId = fileName.replace(/\.md$/, '')
    const fullPath = path.join(postsDirectory, fileName)
    const postData = fs.readFileSync(fullPath, 'utf8')
    const result = greyMatter(postData)
    return {
      postId,
      slug: postId,
      title: result.data.title,
      thumbnail: result.data.coverImage,
      excerpt: result.data.excerpt,
      date: result.data.date
    }
  })

  const postsData = `export const posts = ${JSON.stringify(posts)}`

  return postsData
}

try {
  fs.readdirSync('cache')
} catch (e) {
  fs.mkdirSync('cache')
}


fs.mkdir(path.join(__dirname, 'data'),
{ recursive: true }, (error) => {
  if (error) {
    return console.error(error)
  }

  console.log('Directory created successfully!')

  fs.writeFile(`${path.join(__dirname, 'data')}/posts.js`, getPostData(), function (error) {
    if (error) {
      return console.log(error)
    }  
    
    console.log(`Posts cached!`)
  })
});