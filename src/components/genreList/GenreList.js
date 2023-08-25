import { Space, Typography } from 'antd'
import { useEffect, useState } from 'react'

import useMovieService from '../../services/MovieService'
const { Text } = Typography

const GenreList = (props) => {
  const [genreBase, setGenreBase] = useState([])
  const { getAllGenres } = useMovieService()

  useEffect(() => {
    getAllGenres()
      .then((res) => setGenreBase(res.genres))
      .catch('err')
  }, [])

  const { genreArr } = props
  const genresList = genreArr.map((item, i) => {
    let name = ''
    genreBase.forEach((genreNum) => {
      if (genreNum.id === item) {
        name = genreNum.name
      }
    })
    return (
      <Text code key={i} style={{ fontSize: 12 }}>
        {name}
      </Text>
    )
  })
  return (
    <Space direction="horizontal" style={{ display: 'flex', flexWrap: 'wrap', rowGap: 0 }}>
      {genresList}
    </Space>
  )
}
export default GenreList
