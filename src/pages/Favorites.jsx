import React, { useState, useEffect, useContext } from 'react'
import { Redirect } from 'react-router-dom'
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

  const resetFavorite = async e => {
    e.persist()
    let resp
    const delFavIndex = foodData[foodData.map(el => el.fdcId).indexOf(Number(e.currentTarget.attributes.fdcid.value))].id
    const apiUrl = `${config.apiServer}${config.apiFavoriteEP}/user/favorite/${delFavIndex}`

    try {
      resp = await axios.delete(apiUrl, {headers: {Authorization: `Bearer ${gUser.token}`}})
    } catch (err) {
      console.dir(err.response)
      return
    }
    if (resp.status !== 200) {
      console.log(resp.status)
      return
    } else {
      console.log('Delete response: ' + resp.data)
      getFavorites()
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

  // prettier-ignore
  return <section className="favoritesMain">
    {gUser && gUser.username ? (<div className="previewTilesCont">
      {foodData && foodData.length > 0 ? <FoodTile foodData={foodData} 
                                                   favorites={foodData.map(el => el.fdcId)}
                                                   handleFavoriteClick={resetFavorite}
                                                   uLoggedIn={!(typeof gUser === 'undefined' || gUser === null || typeof gUser.username === 'undefined' || gUser.username === null)} 
                                                   currentPageNumber="1" 
                                                   origin="favorites"/> : <section>No favorites found</section>}
    </div>) : <Redirect to="/" />}
  </section>
}

export default Favorites
