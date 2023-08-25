import { useEffect, useState } from 'react'
import { Progress, Space, List, Rate, Input, Pagination, Spin, Image } from 'antd'
import { debounceCallback } from 'debounce-callback'

import useMovieService from '../../services/MovieService'
import GenreList from '../genreList/GenreList'
import ReleaseDate from '../releaseDate/releaseDate'
import ErrorMessage from '../errorMessage/ErrorMessage'
import './movieList.css'

function MoviesList(props) {
  const [movieData, setMovieData] = useState([])
  const [searchStatus, setSerchStatus] = useState(false)
  const [searchedValue, setSearchedValue] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [newItemLoading, setNewItemLoading] = useState(false)
  const [totalPages, setTotalPages] = useState()
  const { getAllMovies, getSearchedMovies, getPagesInfo, createRatedPost, error } = useMovieService()
  const guestId = props.guestId

  /* console.log(`test ${guestId}`); */

  useEffect(() => {
    if (!searchStatus) {
      setNewItemLoading(true)
      getAllMovies(currentPage)
        .then((res) => setMovieData(res))
        .then(() => setNewItemLoading(false))
        .catch('e')
    }
  }, [currentPage])

  useEffect(() => {
    if (searchStatus) {
      setNewItemLoading(true)
      /* console.log(`вызов найденных фильмов для страницы ${currentPage}`); */
      getSearchedMovies(searchedValue, currentPage)
        .then((res) => {
          setMovieData(res.list) //не передается страница. в консоли ундеф
          setTotalPages(res.total)
        })
        .then(() => setNewItemLoading(false))
        .catch('e')
    }
    /* console.log(movieData); */
  }, [searchedValue, currentPage])

  useEffect(() => {
    if (!searchStatus) {
      getPagesInfo()
        .then((res) => setTotalPages(res.total_pages))
        .catch('e')
    }
  }, [])

  const onSearch = debounceCallback((inputValue) => {
    if (inputValue) {
      setSerchStatus(true)
      setCurrentPage(1)
      setSearchedValue(inputValue)

      /* console.log("in"); */
    } else {
      setSerchStatus(false)
      setCurrentPage(1)
      getAllMovies() //удалил тут currentPageсо входа . по идее он не нужен
        .then((res) => setMovieData(res))
        .catch('e')
    }
  }, 1000)

  function renderItems() {
    return (
      <List
        className="movie_list"
        width={'100%'}
        style={{ maxWidth: 940, margin: '0 auto', padding: 20 }}
        grid={{ gutter: 30, xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
        dataSource={movieData}
        renderItem={(item) => (
          <List.Item
            className="movie-list_item"
            style={{
              display: 'grid',
              maxWidth: 450,
              gutter: 15,
              justifyContent: 'stretch',
            }}
            key={item.title}
          >
            <div className="img_wrap">
              <Image
                className="movie_img"
                src={item.poster}
                alt={item.title}
                style={{
                  overflow: 'hidden',
                  /*maxWidth: 200,
                  minWidth: 100,
                  maxHeight: 280,
                  minHeight: 100, */
                  width: '100%',
                }}
              />
            </div>

            <div
              className="movie_info"
              style={{
                height: 270,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                marginRight: 10,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  margin: 0,
                }}
              >
                <h4 className="movie_title" style={{ textAlign: 'left', margin: 0 }}>
                  {item.title}
                </h4>
                <Space wrap>
                  <Progress
                    style={{ marginRight: 10, marginLeft: 10 }}
                    type="circle"
                    format={(percent) => `${(percent / 10).toFixed(1)}`}
                    percent={item.vote_average * 10}
                    size={30}
                    strokeColor={
                      item.vote_average > 0 && item.vote_average < 3
                        ? '#E90000'
                        : item.vote_average >= 3 && item.vote_average < 5
                        ? '#E97E00'
                        : item.vote_average >= 5 && item.vote_average < 7
                        ? '#E9D100'
                        : '#66E900'
                    }
                    trailColor={'#D9D9D9'}
                  />
                </Space>
              </div>

              <ReleaseDate className="movie_date" releaseDate={item.release_date} />
              <GenreList className="movie_genre" genreArr={item.genre_ids} />
              <div className="movie_descr">{item.overview}</div>
              <Rate
                allowHalf
                //defaultValue={0}
                value={10}
                count={10}
                onChange={(value) => {
                  createRatedPost(guestId, item.id, value)
                  //console.log(status, guestId, item.id, value);
                }}
                style={{
                  fontSize: 15,
                  position: 'absolute',
                  bottom: 0,
                  right: 10,
                  whiteSpace: 'nowrap',
                }}
                className="movie_rate"
              />
            </div>
          </List.Item>
        )}
      />
    )
  }
  const items = renderItems()
  const spinner = newItemLoading ? <Spin /> : null
  const errorMessage = error ? <ErrorMessage /> : null
  return (
    <>
      <Input
        placeholder="Type to search..."
        style={{ width: '90%' }}
        onChange={(e) => {
          onSearch(e.target.value)
        }}
      />

      <div>
        {spinner}
        {items}
        {errorMessage}
      </div>

      <Pagination
        onChange={(page) => {
          setCurrentPage(page)
        }}
        defaultCurrent={1}
        current={currentPage}
        total={totalPages}
        showSizeChanger={false}
      />
    </>
  )
}

export default MoviesList
