import { useState, useEffect } from 'react'

import Header from '../header/Header'
import useMovieService from '../../services/MovieService'
import './App.css'

function App() {
  const { createGuestSession } = useMovieService()
  const [guestId, setGuestId] = useState()

  useEffect(() => {
    createGuestSession()
      .then((res) => setGuestId(res))
      .catch('e')
  }, [])
  /* console.log(`app use eff ${guestId}`); */

  return (
    <div className="App">
      <Header guestId={guestId} />
    </div>
  )
}

export default App
