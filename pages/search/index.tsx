import Head from 'next/head';
import { useCallback, useRef, useState, useEffect } from 'react'
import type Post from '../../interfaces/post'
import PostPreview from '../../components/post-preview'

export default function Home() {

const searchRef = useRef<HTMLInputElement>(null)

const defaultPosts = require('../../cache/data/posts').data;

const [query, setQuery] = useState('')
const [results, setResults] = useState<any[]>(defaultPosts)

const searchEndpoint = (query: string) => `/api/search?query=${query}`

const getResults = (query: string) => {
    if (query.length) {
      fetch(searchEndpoint(query))
        .then(res => res.json())
        .then(res => {
          setResults(res.results.map((element) => element.item)) // Fuzzy search returns our results in a different format
        })
        .catch(error => {
          console.error('Error fetching search results:', error)
          setResults([])
        })
    } else {
      setResults(defaultPosts)
    }
  };

const onChange = useCallback((event) => {
    const query = event.target.value;
    setQuery(query)
}, [query])

useEffect(() => {
    getResults(query);
}, [query]);

  return (
    <>
      <Head>
        <title>{`Search`}</title>
      </Head>
      <div className={`container mx-auto px-5`}>
        <h1 className={`text-5xl md:text-8xl font-bold tracking-tighter leading-tight md:pr-8`}>Search Articles</h1>
        <div ref={searchRef} className={`mb-4`}>
            <div>
                <label htmlFor="searchInput" className={`mr-4`}>Filter:</label>
                <input
                className={`p-2 border-solid border-2 border-black`}
                onChange={onChange}
                placeholder='Search posts'
                type='text'
                value={query}
                id="searchInput"
                />
            </div>
        </div>
        <div className={`grid grid-cols-3 gap-4`}>
            {results.map((post: Post, index) => (
                <PostPreview
                key={post.slug}
                title={post.title}
                coverImage={post.coverImage}
                date={post.date}
                author={post.author}
                slug={post.slug}
                excerpt={post.excerpt}
            />
            ))}
        </div>
    </div>
    </>
  )
}