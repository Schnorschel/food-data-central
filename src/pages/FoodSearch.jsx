import React, { useState, useEffect, useContext } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import FoodTile from '../components/FoodTile'
import PageSelector from '../components/PageSelector'
import config from '../config'
import { UserContext } from '../UserContext'

const FoodSearch = props => {
  const { gUser, setGUser } = useContext(UserContext)
  const [foodData, setFoodData] = useState([])
  // prettier-ignore
  const [currentPageNumber, setCurrentPageNumber] = useState(props.match.params.PageNum)
  const [noOfResults, setNoOfResults] = useState()
  const [noOfResultPages, setNoOfResultPages] = useState()
  const [pageChange, setPageChange] = useState(false)
  const [favorites, setFavorites] = useState()
  // const [favoriteData, setFavoriteData] = useState()

  // prettier-ignore
  const getFoodData = async p => {
    // const page = (typeof p === 'undefined') ? (typeof currentPageNumber === 'undefined') ? 1 : currentPageNumber : p
    const page = props.match.params.PageNum
    // const apiKey = 'https://api.nal.usda.gov/fdc/v1/search?api_key=BG5c7pT5v0GRIWmEskVFQ5fyKKonSdy9zs31JvQa'
    // const tSearchTerm = encodeURI(searchTerm)
    const tSearchTerm = encodeURI(props.match.params.SearchTerm)
    // const tDatabase = encodeURI(database)
    let apiUrl = `${config.apiServer}${config.apiFoodEP}?searchTerm=${tSearchTerm}&pageNumber=${page}`
    // apiUrl = apiUrl.concat((database === 'All') ? '' : `&includeDataTypeList=${tDatabase}`)
    apiUrl = apiUrl.concat(props.match.params.RequireAllWords === 'allWords' ? '&requireAllWords=true' : '')
    // prettier-ignore
    console.log( 'Attempting to request food data from: ' + apiUrl) // + '. Searching for: ' + searchTerm )
    // let data = JSON.stringify({ generalSearchInput: `${searchTerm}` })
    // prettier-ignore
    // let headers = JSON.stringify({ headers: { "Content-Type": "application/json" } })
    const resp = await axios.get(
      apiUrl) //,
    // {
    //   generalSearchInput: searchTerm,
    //   requireAllWords: true,
    //   pageNumber: typeof currentPageNumber === 'undefined' || currentPageNumber == null ? 1 : currentPageNumber,
    //   includeDataTypes: {
    //     'Survey (FNDDS)': database === 'All' || database === 'Survey (FNDDS)' ? true : false,
    //     Foundation: database === 'All' || database === 'Foundation' ? true : false,
    //     Branded: database === 'All' || database === 'Branded' ? true : false,
    //     'SR Legacy': database === 'All' || database === 'SR Legacy' ? true : false
    //   },
    // },
    // { headers: { 'Content-Type': 'application/json' } }
    // ) // ,
    if (resp.status !== 200) {
      console.log(resp.status)
      return
    }
    console.dir(resp.data)
    setFoodData(resp.data.foods)
    setCurrentPageNumber(resp.data.foodSearchCriteria.pageNumber)
    setNoOfResults(resp.data.totalHits)
    setNoOfResultPages(parseInt(resp.data.totalPages))
    console.log('foodSearchCriteria:')
    console.dir(resp.data.foodSearchCriteria)
    console.log('totalHits: ' + resp.data.totalHits)
    console.log('totalPages: ' + resp.data.totalPages)
  }

  // prettier-ignore
  // Get the favorite data for the currently logged-in user from the back end and store it in the {favorites} hook variable
  const getFavorites = async () => {
    let resp
    const apiUrl = `${config.apiServer}${config.apiFavoriteEP}/user/favorites`
    try {
      console.log(`Submitting GET Request to ${apiUrl} with Authorization header: Bearer ${gUser.token}`)
      resp = await axios.get(apiUrl, { headers: { Authorization: `Bearer ${gUser.token}` }, })
    } catch (err) {
      console.dir(err.response)
      // console.log(err.response.data.error || 'An unexpected error occurred.')
      return
    }
    if (resp.status !== 200) {
      console.log('Error: ' + resp.status)
    } else {
      // console.dir(resp.data.userFavorite)
      // setFavorites(resp.data.userFavorite.map(el => el.favorite.fdcId))
      // setFavorites(resp.data.userFavorite)
      // setFavoriteData(resp.data.userFavorite)
      const tFav = { Id: [], fdcId: [] }
      tFav.Id = resp.data.userFavorite.map(el => el.favorite.id)
      tFav.fdcId = resp.data.userFavorite.map(el => el.favorite.fdcId)
      console.log('userFavorite:')
      console.dir(resp.data.userFavorite)
      console.log('favorites:')
      console.dir(tFav)
      
      setFavorites(tFav)
    }
  }

  useEffect(() => {
    if (typeof favorites === 'undefined' || !favorites) return
    console.dir(favorites)
  }, [favorites])

  // prettier-ignore
  // After the food data has been fetched, get the logged-in user's favorites data
  useEffect(() => {
    if (typeof foodData === 'undefined' || !foodData || 
        typeof gUser === 'undefined' || !gUser || !gUser.username)
      return
    getFavorites()
  }, [foodData])

  // const getFoodNutritionData = async fdcId => {
  //   const apiUrl = `${config.apiServer}${config.apiFoodEP}/${fdcId}` //?api_key=BG5c7pT5v0GRIWmEskVFQ5fyKKonSdy9zs31JvQa`
  //   const resp = await axios.get(apiUrl)
  //   if (resp.status !== 200) return
  //   setFoodDetailData(...foodDetailData, resp.data)
  // }

  // useEffect(() => {
  //   setFoodDetailData([])
  //   // prettier-ignore
  //   if (typeof foodData === 'undefined' || foodData == null || foodData.length === 0) return
  //   console.log('Would now get food detail data for: ')
  //   console.dir(foodData)
  //   // foodData.foreach(fd => {
  //   //   getFoodNutritionData(fd.fdcId)
  //   // })
  // }, [foodData])

  // useEffect(() => {
  //   if (!isNaN(currentPageNumber)) {
  //     getFoodData()
  //   }
  // }, [currentPageNumber])

  const updatePageNumber = e => {
    e.persist()
    const val = e.target.value
    setCurrentPageNumber(val)
    console.log('About to go to page: ' + val)
    setPageChange(true)
    // getFoodData(val)
  }

  // const handleNewSearch = () => {
  //   setCurrentPageNumber(1)
  //   getFoodData(1)
  // }

  // const updateSearchTerm = e => {
  //   const val = e.target.value
  //   setSearchTerm(val)
  // }

  useEffect(() => {
    console.log('Initiate search in FoodSearch.jsx')
    getFoodData(1)
  }, [
    props.match.params.SearchTerm,
    props.match.params.RequireAllWords,
    props.match.params.PageNum,
  ])

  // prettier-ignore
  const setResetFavorite = async e => {
    e.persist()
    console.log('setResetFavorite: e.target')
    console.dir(e.target)
    console.log('setResetFavorite: e.currentTarget')
    console.dir(e.currentTarget)
    let apiUrl
    let resp

    console.log(`e.currentTarget.attributes.fdcid: ${e.currentTarget.attributes.fdcid.value}`)
    console.dir(e.currentTarget.attributes.fdcid.value)
    // Determine whether user already favorited this food item
    const favIndex = favorites.fdcId.indexOf(Number(e.currentTarget.attributes.fdcid.value))
    //console.log(`favorites.Id[favIndex]: ${favorites.Id[favIndex]}`)

    // If so, delete favorite
    if (favIndex > -1) {
      apiUrl = `${config.apiServer}${config.apiFavoriteEP}/user/favorite/${favorites.Id[favIndex]}`
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
    } else {

    // otherwise, create favorite, because it doesn't exist yet
    apiUrl = `${config.apiServer}${config.apiFavoriteEP}/user/favorite`
    const tFavorite = {username: gUser.username, 
                        fdcId:Number(e.currentTarget.attributes.fdcid.value), 
                        description:foodData[e.currentTarget.id].description,
                        gtinUpc: foodData[e.currentTarget.id].gtinUpc || null,
                        brandOwner: foodData[e.currentTarget.id].brandOwner || null,
                        ingredients: foodData[e.currentTarget.id].ingredients || null,
                        additionalDescriptions: foodData[e.currentTarget.id].additionalDescriptions || null 
                      }
    try {
      console.log(`Submitting POST request to ${apiUrl} with payload:`)
      console.dir(tFavorite)
      resp = await axios.post(apiUrl, tFavorite, {headers: { Authorization: `Bearer ${gUser.token}` }, })
    } catch (err) {
      console.log('err.response (from catch):')
      console.dir(err.response)
      return
    }
    if (resp.status !== 200) {
      console.log(resp.status)
    } else {
      console.log('Favorite successfully created:')
      console.dir(resp.data)
      getFavorites()
    }
  }

    // if
    //delete Favorite
  }

  // useEffect(() => {
  //   console.log({ requireAllWords })
  // }, [requireAllWords])

  const plurify = n => {
    return n === 1 ? '' : 's'
  }

  return (
    // prettier-ignore
    <section className="searchMain">
      {pageChange ? <Redirect to={`/Search/${props.match.params.SearchTerm}/${props.match.params.RequireAllWords}/${currentPageNumber}/${props.match.params.Rnd}`} /> : null}
      {typeof noOfResults === 'undefined' ? <section className="dataLoader">Loading data...</section> : noOfResults > 0 ? <section className="resultStats">{noOfResults} result{plurify(noOfResults)} {noOfResultPages === 1 ? 'on' : 'across'} {noOfResultPages} page{plurify(noOfResultPages)}{noOfResultPages > 200 ? ', accessing first 200 pages' : null}</section> : 'No results'}
      {typeof currentPageNumber !== 'undefined' && currentPageNumber > 0  && <PageSelector currentPage={currentPageNumber} allPages={Math.min(noOfResultPages,200)} handleButtonClick={updatePageNumber} />}
      {/* prettier-ignore */}
      <div className="previewTilesCont">
        <FoodTile foodData={foodData} 
                  favorites={favorites ? favorites.fdcId : []} 
                  handleFavoriteClick={setResetFavorite}
                  uLoggedIn={!(typeof gUser === 'undefined' || gUser === null || typeof gUser.username === 'undefined' || gUser.username === null)} 
                  currentPageNumber={currentPageNumber} />
      </div>
      {typeof currentPageNumber !== 'undefined' && currentPageNumber > 0 && <PageSelector currentPage={currentPageNumber} allPages={Math.min(noOfResultPages, 200)} handleButtonClick={updatePageNumber} />}
    </section>
  )
}

export default FoodSearch
