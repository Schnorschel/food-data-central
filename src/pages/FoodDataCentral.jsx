import React, { useState, useEffect } from 'react'
import axios from 'axios'
import FoodTile from '../components/FoodTile'

const FoodDataCentral = () => {
  const [searchTerm, setSearchTerm] = useState('Cinnamon Roll')
  const [foodData, setFoodData] = useState([])
  const [foodDetailData, setFoodDetailData] = useState()
  const [currentPageNumber, setCurrentPageNumber] = useState()

  const getFoodData = async () => {
    // prettier-ignore
    const apiKey = 'https://api.nal.usda.gov/fdc/v1/search?api_key=BG5c7pT5v0GRIWmEskVFQ5fyKKonSdy9zs31JvQa'
    // prettier-ignore
    console.log( 'Attempting to request food data from: ' + apiKey + '. Searching for: ' + searchTerm )
    let data = JSON.stringify({ generalSearchInput: `${searchTerm}` })
    // prettier-ignore
    let headers = JSON.stringify({ headers: { "Content-Type": "application/json" } })
    const resp = await axios.post(
      apiKey,
      {
        generalSearchInput: searchTerm,
        requireAllWords: true,
        includeDataTypes: {
          'Survey (FNDDS)': true,
          Foundation: true,
          Branded: true,
        },
      },
      { headers: { 'Content-Type': 'application/json' } }
    ) // ,
    if (resp.status !== 200) {
      console.log(resp.status)
      return
    }
    setFoodData(resp.data.foods)
    setCurrentPageNumber(resp.data.foodSearchCriteria.pageNumber)
    console.log('foodSearchCriteria:')
    console.dir(resp.data.foodSearchCriteria)
    console.log('totalHits: ' + resp.data.totalHits)
    console.log('totalPages: ' + resp.data.totalPages)
  }

  const getFoodNutritionData = async fdcId => {
    const apiKey = `https://api.nal.usda.gov/fdc/v1/${fdcId}?api_key=BG5c7pT5v0GRIWmEskVFQ5fyKKonSdy9zs31JvQa`
    const resp = await axios.get(apiKey)
    if (resp.status !== 200) return
    setFoodDetailData(...foodDetailData, resp.data)
  }

  useEffect(() => {
    setFoodDetailData([])
    // prettier-ignore
    if (typeof foodData === 'undefined' || foodData == null || foodData.length === 0) return
    console.log('Would now get food detail data for: ')
    console.dir(foodData)
    // foodData.foreach(fd => {
    //   getFoodNutritionData(fd.fdcId)
    // })
  }, [foodData])

  const handleNewSearch = () => {
    getFoodData()
  }

  const updateSearchTerm = e => {
    setSearchTerm(e.target.value)
  }
  return (
    // prettier-ignore
    <section className="search">
      <section className="searchTermCont">
        <input type="text" name="SearchTerm" value={searchTerm} onChange={updateSearchTerm} defaultValue="Cinnamon Roll"/>
        <button name="Search" className="searchButton" onClick={handleNewSearch}>Search</button>
      </section>
      {/* prettier-ignore */}
      <div className="previewTilesCont">
        <FoodTile foodData={foodData} foodNutritionData={foodDetailData} />
      </div>
    </section>
  )
}

export default FoodDataCentral
