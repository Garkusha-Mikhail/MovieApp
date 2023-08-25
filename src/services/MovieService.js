import { useState } from 'react'

import noImage from '../assets/no_image.jpg'

const useMovieService = () => {
  const [error, setError] = useState(null)
  const _apiBase = 'https://api.themoviedb.org/3/',
    _apiKey = 'api_key=4c728f7b95783acf520512782a9329d4'

  const getData = async (url, options = null) => {
    try {
      const res = await fetch(url, options)
      setError(null)
      if (!res.ok) {
        throw new Error(`Could not fetch ${url}, status ${res.status}`)
      }
      return await res.json()
    } catch (e) {
      setError(e.message)
      throw e
    }
  }

  const createGuestSession = async () => {
    const res = await getData(`${_apiBase}authentication/guest_session/new?${_apiKey}`)
    return res.guest_session_id
  }

  const createRatedPost = async (guestId, movieId, rating) => {
    const res = await getData(`${_apiBase}movie/${movieId}/rating?${_apiKey}&guest_session_id=${guestId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ value: rating }),
    })
    console.log(res)
    return res
  }

  const getRatedMovies = async (guestId, page = 1) => {
    const res = await getData(`${_apiBase}guest_session/${guestId}/rated/movies?page=${page}&${_apiKey}`)
    console.log(res, guestId)
    return {
      page: res.page,
      list: res.results.map(_transformMovie),
      total: res.total_pages,
    }
  }

  const getAllMovies = async (page = 1) => {
    const res = await getData(`${_apiBase}discover/movie?page=${page}&${_apiKey}`)
    return res.results.map(_transformMovie)
  }
  const getAllGenres = async () => {
    const res = await getData(`${_apiBase}genre/movie/list?language=en&${_apiKey}`)
    return res
  }
  const getPagesInfo = async (page = 1) => {
    const res = await getData(`${_apiBase}discover/movie?page=${page}&${_apiKey}`)
    return res
  }

  const getSearchedMovies = async (searchValue, page = 1) => {
    const res = await getData(`${_apiBase}search/movie?${_apiKey}&query=${searchValue}&page=${page}`)
    /* console.log(`гетсерчед запустился`); */
    return {
      page: res.page,
      list: res.results.map(_transformMovie),
      total: res.total_pages,
    }
  }

  const _transformMovie = (movie) => {
    return {
      page: movie.page,
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : noImage,
      vote_average: movie.vote_average,
      genre_ids: movie.genre_ids,
      release_date: movie.release_date,
      rating: movie.rating,
    }
  }

  return {
    error,

    createGuestSession,
    getAllMovies,
    getAllGenres,
    getSearchedMovies,
    getPagesInfo,
    createRatedPost,
    getRatedMovies,
  }
}

export default useMovieService
