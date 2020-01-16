import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import FoodTile from '../components/FoodTile'
import PageSelector from '../components/PageSelector'
import config from '../config'

const FoodSearch = props => {
  const [searchTerm, setSearchTerm] = useState()
  const [foodData, setFoodData] = useState([])
  const [foodDetailData, setFoodDetailData] = useState()
  // prettier-ignore
  const [currentPageNumber, setCurrentPageNumber] = useState(props.match.params.PageNum)
  const [noOfResults, setNoOfResults] = useState()
  const [noOfResultPages, setNoOfResultPages] = useState()
  const [database, setDatabase] = useState('All')
  const [pageChange, setPageChange] = useState(false)

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
    e.persist()
    const val = e.target.value
    setCurrentPageNumber(val)
    setPageChange(true)
    // getFoodData(val)
  }

  const handleNewSearch = () => {
    setCurrentPageNumber(1)
    getFoodData(1)
  }

  const updateSearchTerm = e => {
    const val = e.target.value
    setSearchTerm(val)
  }

  useEffect(() => {
    getFoodData(1)
  }, [
    props.match.params.SearchTerm,
    props.match.params.RequireAllWords,
    props.match.params.PageNum,
  ])

  // useEffect(() => {
  //   console.log({ requireAllWords })
  // }, [requireAllWords])

  const plurify = n => {
    return n === 1 ? '' : 's'
  }
  return (
    // prettier-ignore
    <section className="searchMain">
      {pageChange ? <Redirect to={`/Search/${props.match.params.SearchTerm}/${props.match.params.RequireAllWords}/${currentPageNumber}`} /> : null}
      {typeof noOfResults === 'undefined' ? '' : noOfResults > 0 ? <section className="resultStats">{noOfResults} result{plurify(noOfResults)} {noOfResultPages === 1 ? 'on' : 'across'} {noOfResultPages} page{plurify(noOfResultPages)}{noOfResultPages > 200 ? ', accessing first 200 pages' : null}</section> : 'No results'}
      {typeof currentPageNumber !== 'undefined' && currentPageNumber > 0  && <PageSelector currentPage={currentPageNumber} allPages={Math.min(noOfResultPages,200)} handleButtonClick={updatePageNumber} />}
      {/* prettier-ignore */}
      <div className="previewTilesCont">
        <FoodTile foodData={foodData} foodNutritionData={foodDetailData} currentPageNumber={currentPageNumber} />
      </div>
      {typeof currentPageNumber !== 'undefined' && currentPageNumber > 0 && <PageSelector currentPage={currentPageNumber} allPages={Math.min(noOfResultPages, 200)} handleButtonClick={updatePageNumber} />}
    </section>
  )
}

export default FoodSearch
