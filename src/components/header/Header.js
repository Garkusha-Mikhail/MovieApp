import { Tabs } from 'antd'
import { useState } from 'react'

import MoviesList from '../moviesList/MoviesList'
import RatedList from '../ratedList/RatedList'

const Header = ({ guestId }) => {
  const [isRate, setIsRate] = useState(false)

  const onChange = (key) => {
    console.log(key)
    if (key === '2') {
      setIsRate(true)
    } else {
      setIsRate(false)
    }
  }

  const items = [
    {
      key: '1',
      label: 'Search',
      children: <MoviesList guestId={guestId} />,
    },
    {
      key: '2',
      label: 'Rate',
      children: <RatedList guestId={guestId} isRate={isRate} />,
    },
  ]

  return <Tabs items={items} onTabClick={onChange} style={{ alignItems: 'center', margin: '0 auto' }} />
}
export default Header
