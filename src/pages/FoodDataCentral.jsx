import React, { useState, useEffect } from 'react'
import axios from 'axios'
import FoodTile from '../components/FoodTile'
import PageSelector from '../components/PageSelector'

const FoodDataCentral = () => {
  const [searchTerm, setSearchTerm] = useState('Cinnamon Roll')
  const [foodData, setFoodData] = useState([])
  const [foodDetailData, setFoodDetailData] = useState()
  const [currentPageNumber, setCurrentPageNumber] = useState()
  const [noOfResults, setNoOfResults] = useState()
  const [noOfResultPages, setNoOfResultPages] = useState()
  const [database, setDatabase] = useState()

  const getFoodData = async () => {
    // prettier-ignore
    const apiKey = 'https://api.nal.usda.gov/fdc/v1/search?api_key=BG5c7pT5v0GRIWmEskVFQ5fyKKonSdy9zs31JvQa'
    // prettier-ignore
    console.log( 'Attempting to request food data from: ' + apiKey + '. Searching for: ' + searchTerm )
    let data = JSON.stringify({ generalSearchInput: `${searchTerm}` })
    // prettier-ignore
    // let headers = JSON.stringify({ headers: { "Content-Type": "application/json" } })
    const resp = await axios.post(
      apiKey,
      {
        generalSearchInput: searchTerm,
        requireAllWords: true,
        pageNumber: currentPageNumber,
        includeDataTypes: {
          'Survey (FNDDS)': database === 'All' || database === 'Survey (FNDDS)' ? true : false,
          Foundation: database === 'All' || database === 'Foundation' ? true : false,
          Branded: database === 'All' || database === 'Branded' ? true : false,
          'SR Legacy': database === 'All' || database === 'SR Legacy' ? true : false
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
    setNoOfResults(resp.data.totalHits)
    setNoOfResultPages(parseInt(resp.data.totalPages))
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

  useEffect(() => {
    if (!isNaN(currentPageNumber)) {
      getFoodData()
    }
  }, [currentPageNumber])

  const updatePageNumber = e => {
    const val = e.target.value
    setCurrentPageNumber(val)
  }

  const handleNewSearch = () => {
    setCurrentPageNumber(1)
    getFoodData()
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
          <option name="database" value="All">All</option>
          <option name="database" value="Survey (FNDDS)">Survey (FNDDS)</option>
          <option name="database" value="Foundation">Foundation</option>
          <option name="database" value="Branded">Branded</option>
          <option name="database" value="SR Legacy">SR Legacy</option>
        </select>
        <button name="Search" className="searchButton" onClick={handleNewSearch}>Search</button>
        {typeof noOfResults === 'undefined' ? '' : noOfResults > 0 ? <span className="resultStats">{noOfResults} result{plurify(noOfResults)} {noOfResultPages === 1 ? 'on' : 'across'} {noOfResultPages} page{plurify(noOfResultPages)}</span> : 'No results'}
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
