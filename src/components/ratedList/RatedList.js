import { useEffect, useState } from 'react'
import { Progress, Space, List, Rate, Spin, Pagination, Image } from 'antd'

import ErrorMessage from '../errorMessage/ErrorMessage'
import useMovieService from '../../services/MovieService'
import GenreList from '../genreList/GenreList'
import ReleaseDate from '../releaseDate/releaseDate'
import './movieList.css'

const RatedList = ({ guestId, isRate }) => {
    const [currentPage, setCurrentPage] = useState(1)
    const [movieData, setMovieData] = useState([])
    const [totalPages, setTotalPages] = useState()
    const [newItemLoading, setNewItemLoading] = useState(false)

    const { getRatedMovies, error } = useMovieService()

    useEffect(() => {
        if (isRate) {
            setNewItemLoading(true)
            getRatedMovies(guestId, currentPage)
                .then((res) => {
                    console.log(res)
                    setMovieData(res.list)
                    setTotalPages(res.total)
                })
                .then(() => setNewItemLoading(false))
                .catch('e')
        }
    }, [currentPage, isRate])

    function renderItems(data) {
        return (
            <List
                className="movie_list"
                width={'100%'}
                style={{ maxWidth: 940, margin: '0 auto', padding: 20 }}
                grid={{ gutter: 30, xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }}
                dataSource={data}
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
                                value={item.rating}
                                count={10}
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
    const items = renderItems(movieData)
    const spinner = newItemLoading ? <Spin /> : null
    const errorMessage = error ? <ErrorMessage /> : null
    return (
        <>
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

export default RatedList
