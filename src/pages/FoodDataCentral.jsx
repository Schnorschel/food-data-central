import React, { useState, useEffect } from 'react'
import axios from 'axios'
import FoodTile from '../components/FoodTile'
import PageSelector from '../components/PageSelector'
import config from '../config'

const FoodDataCentral = () => {
  const [searchTerm, setSearchTerm] = useState()
  const [foodData, setFoodData] = useState([])
  const [foodDetailData, setFoodDetailData] = useState()
  const [currentPageNumber, setCurrentPageNumber] = useState()
  const [noOfResults, setNoOfResults] = useState()
  const [noOfResultPages, setNoOfResultPages] = useState()
  const [database, setDatabase] = useState()

  const getFoodData = async p => {
    const page =
      typeof p === 'undefined'
        ? typeof currentPageNumber === 'undefined'
          ? 1
          : currentPageNumber
        : p
    // prettier-ignore
    // const apiKey = 'https://api.nal.usda.gov/fdc/v1/search?api_key=BG5c7pT5v0GRIWmEskVFQ5fyKKonSdy9zs31JvQa'
    const apiUrl = `${config.apiServer}${config.apiFoodEP}?searchTerm=${searchTerm}&pageNumber=${page}`
    // prettier-ignore
    console.log( 'Attempting to request food data from: ' + apiUrl + '. Searching for: ' + searchTerm )
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

  const getFoodNutritionData = async fdcId => {
    const apiUrl = `${config.apiServer}${config.apiFoodEP}/${fdcId}` //?api_key=BG5c7pT5v0GRIWmEskVFQ5fyKKonSdy9zs31JvQa`
    const resp = await axios.get(apiUrl)
    if (resp.status !== 200) return
    setFoodDetailData(...foodDetailData, resp.data)
  }

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
    const val = e.target.value
    setCurrentPageNumber(val)
    getFoodData(val)
  }

  const handleNewSearch = () => {
    setCurrentPageNumber(1)
    getFoodData(1)
  }

  const updateSearchTerm = e => {
    const val = e.target.value
    setSearchTerm(val)
  }

  const plurify = n => {
    return n === 1 ? '' : 's'
  }
  return (
    // prettier-ignore
    <section className="searchMain">
      <section className="searchTermCont">
        <input type="text" name="SearchTerm" value={searchTerm} onChange={updateSearchTerm} />
        <select name="database" defaultChecked="All" onChange={e => setDatabase(e.target.value)} >
          <option name="database" value="All">All Databases</option>
          <option name="database" value="Survey (FNDDS)">Survey (FNDDS)</option>
          <option name="database" value="Foundation">Foundation</option>
          <option name="database" value="Branded">Branded</option>
          <option name="database" value="SR Legacy">SR Legacy</option>
        </select>
        <button name="Search" className="searchButton" onClick={handleNewSearch}>Search</button>
        {typeof noOfResults === 'undefined' ? '' : noOfResults > 0 ? <section className="resultStats">{noOfResults} result{plurify(noOfResults)} {noOfResultPages === 1 ? 'on' : 'across'} {noOfResultPages} page{plurify(noOfResultPages)}</section> : 'No results'}
      </section>
      {typeof currentPageNumber !== 'undefined' && currentPageNumber > 0  && <PageSelector currentPage={currentPageNumber} allPages={noOfResultPages} handleButtonClick={updatePageNumber} />}
      {/* prettier-ignore */}
      <div className="previewTilesCont">
        <FoodTile foodData={foodData} foodNutritionData={foodDetailData} currentPageNumber={currentPageNumber} />
      </div>
      {typeof currentPageNumber !== 'undefined' && currentPageNumber > 0 && <PageSelector currentPage={currentPageNumber} allPages={noOfResultPages} handleButtonClick={updatePageNumber} />}
    </section>
  )
}

export default FoodDataCentral
