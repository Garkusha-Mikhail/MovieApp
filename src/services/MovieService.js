import noImage from "../assets/no_image.jpg";
const useMovieService = () => {
  const _apiBase = "https://api.themoviedb.org/3/",
    _apiKey = "api_key=4c728f7b95783acf520512782a9329d4";
  const getData = async (url) => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("error");
    }
    return await res.json();
  };

  const getAllMovies = async (page = 1) => {
    const res = await getData(
      `${_apiBase}discover/movie?page=${page}&${_apiKey}`
    );
    return res.results.map(_transformMovie);
  };
  const getAllGenres = async () => {
    const res = await getData(
      `${_apiBase}genre/movie/list?language=en&${_apiKey}`
    );
    return res;
  };
  const getPagesInfo = async (page = 1) => {
    const res = await getData(
      `${_apiBase}discover/movie?page=${page}&${_apiKey}`
    );
    return res;
  };

  const getSearchedMovies = async (searchValue, page = 1) => {
    const res = await getData(
      `${_apiBase}search/movie?${_apiKey}&query=${searchValue}&page=${page}`
    );
    /* console.log(`гетсерчед запустился`); */
    return {
      page: res.page,
      list: res.results.map(_transformMovie),
      total: res.total_pages,
    };
  };

  const _transformMovie = (movie) => {
    return {
      page: movie.page,
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      poster: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : noImage,
      vote_average: movie.vote_average,
      genre_ids: movie.genre_ids,
      release_date: movie.release_date,
    };
  };

  return {
    /* loading,
    error,
    clearError, */
    getAllMovies,
    getAllGenres,
    getSearchedMovies,
    getPagesInfo,
  };
};

export default useMovieService;
