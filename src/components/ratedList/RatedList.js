import { useEffect, useState } from 'react'
import { Progress, Space, List, Rate, Spin, Pagination } from 'antd'

import ErrorMessage from '../errorMessage/ErrorMessage'
import useMovieService from '../../services/MovieService'
import GenreList from '../genreList/GenreList'
import ReleaseDate from '../releaseDate/releaseDate'

const RatedList = ({ guestId, isRate }) => {
    const { getRatedMovies, error } = useMovieService()
    const [currentPage, setCurrentPage] = useState(1)
    const [movieData, setMovieData] = useState([])
    const [totalPages, setTotalPages] = useState()
    const [newItemLoading, setNewItemLoading] = useState(false)
    console.log(isRate)

    useEffect(() => {
        if (isRate) {
            setNewItemLoading(true)
            getRatedMovies(guestId, currentPage)
                .then((res) => {
                    setMovieData(res.list)
                    setTotalPages(res.total)
                })
                .then(() => setNewItemLoading(false))
                .catch('e')
        }
    }, [currentPage, isRate])

    function renderItems() {
        console.log(`total pages ${totalPages}`)
        return (
            <List
                itemLayout="vertical"
                style={{ maxWidth: 1010, margin: '0 auto', padding: 20 }}
                size="large"
                grid={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
                dataSource={movieData}
                renderItem={(item) => (
                    <List.Item
                        style={{
                            padding: 0,
                            paddingRight: 10,
                            height: 280,
                            maxWidth: 450,
                            display: 'flex',
                            flexDirection: 'row-reverse',
                            justifyItems: 'space-between',
                            boxShadow: '0px 4px 12px 0px rgba(0, 0, 0, 0.15)',
                        }}
                        key={item.title}
                        extra={
                            <img
                                width={180}
                                height={280}
                                alt={item.title}
                                src={item.poster}
                                style={{ marginLeft: -24, marginRight: 20 }}
                            />
                        }
                    >
                        <div
                            style={{
                                height: 270,

                                display: 'flex',
                                flexDirection: 'column',

                                justifyContent: 'space-between',
                            }}
                        >
                            <div>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        margin: 0,
                                    }}
                                >
                                    <h4 style={{ textAlign: 'left', margin: 0 }}>{item.title}</h4>
                                    <div>
                                        <Space wrap>
                                            <Progress
                                                type="circle"
                                                format={(percent) => `${percent / 10}`}
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
                                </div>

                                <ReleaseDate releaseDate={item.release_date} />
                                <GenreList genreArr={item.genre_ids} />
                                <div
                                    style={{
                                        height: 130,
                                        width: 230,
                                        marginBottom: 10,
                                        overflow: 'hidden',
                                        textAlign: 'left',
                                    }}
                                >
                                    {item.overview}
                                </div>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <Rate
                                    allowHalf
                                    defaultValue={item.rating}
                                    count={10}
                                    style={{ fontSize: 16 }}
                                    /* onChange={(value) => {
                    const status = createRatedPost(guestId, item.id, value); 
                    console.log(status, guestId, item.id, value);
                  }}*/
                                />
                            </div>
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
