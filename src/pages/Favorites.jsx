import React, { useState, useEffect, useContext } from 'react'
import FoodTile from '../components/FoodTile'
import { UserContext } from '../UserContext'
import axios from 'axios'
import config from '../config'

// prettier-ignore
const Favorites = () => {
  const { gUser, setGUser } = useContext(UserContext)
  const [foodData, setFoodData] = useState()
  const [favorites, setFavorites] = useState()

  const getFavorites = async () => {
    let resp
    const apiUrl = `${config.apiServer}${config.apiFavoriteEP}/user/Favorites`
    try {
      console.log(`Submitting GET Request to ${apiUrl} with Authorization header: Bearer ${gUser.token}`)
       resp = await axios.get(apiUrl,{ headers: {Authorization: `Bearer ${gUser.token}`}})
    } catch (err) {
      // console.log('Unexpected error.')
      console.dir(err.response)
      // console.log(err.response.data.error || 'An unexpected error occurred.')
      return
    }
    if (resp.status !== 200) {
      console.log('Error: ' + resp.status)
    } else {
      console.dir(resp.data.userFavorite)
      setFoodData(resp.data.userFavorite.map(el => el.favorite))
      // setFavorites(resp.data.userFavorite)
    }
  }

  useEffect(() => {
    getFavorites()
  }, []);

  const getFoodDataForFavorites = () => {
    // console.log('getFoodDataForFavorites')
    if (typeof favorites === 'undefined' || !favorites) {
      console.log('favorites undefined or empty')
      return
    }
    setFoodData(favorites.map(el => el.favorite))
  }

  // useEffect(() => {
  //   getFoodDataForFavorites()
  // }, [favorites]);

  return <section className="favoritesMain">
    <div className="previewTilesCont">
      {foodData && foodData.length > 0 ? <FoodTile foodData={foodData} currentPageNumber="1" /> : <section>No favorites found</section>}
    </div>
  </section>
}

export default Favorites
