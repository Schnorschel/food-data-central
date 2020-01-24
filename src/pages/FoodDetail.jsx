import React, { useState, useEffect } from 'react'
import axios from 'axios'
import config from '../config'
import { pascalCaseExcept, sentenceCase, quietPlease } from '../utils'

// prettier-ignore
// Hard-coded order of nutrients
const nutrientOrder = [
  'Water','Energy', 'Protein', 'Total lipid (fat)', 'Carbohydrate, by difference', 'Fiber, total dietary',
  'Sugars, total including NLEA', 'Calcium, Ca', 'Iron, Fe', 'Magnesium, Mg', 'Phosphorus, P', 'Potassium, K', 
  'Sodium, Na', 'Zinc, Zn', 'Copper, Cu', 'Selenium, Se', 'Vitamin C, total ascorbic acid', 'Thiamin', 
  'Riboflavin', 'Niacin', 'Vitamin B-6', 'Folate, total', 'Folic acid', 'Folate, food', 'Folate, DFE', 
  'Choline, total', 'Vitamin B-12', 'Vitamin B-12, added', 'Vitamin A, RAE', 'Retinol', 'Carotene, beta', 
  'Carotene, alpha', 'Cryptoxanthin, beta', 'Lycopene', 'Lutein + zeaxanthin', 'Vitamin E (alpha-tocopherol)', 
  'Vitamin E, added', 'Vitamin D (D2 + D3)', 'Vitamin K (phylloquinone)', 'Fatty acids, total saturated', '4:0', 
  '6:0', '8:0', '10:0', '12:0', '14:0', '16:0', '18:0', 'Fatty acids, total monounsaturated', '16:1', '18:1', 
  '20:1', '22:1', 'Fatty acids, total polyunsaturated', '18:2', '18:3', '18:4', '20:4', '20:5 n-3 (EPA)', 
  '22:5 n-3 (DPA)', '22:6 n-3 (DHA)', 'Cholesterol', 'Alcohol, ethyl', 'Caffeine', 'Theobromine'
]

const FoodDetail = props => {
  const [nutrientData, setNutrientData] = useState()

  const getNutrientData = async () => {
    const apiKey = `${config.apiServer}${config.apiFoodEP}/${props.match.params.fdcId}` // ?api_key=BG5c7pT5v0GRIWmEskVFQ5fyKKonSdy9zs31JvQa`
    console.log('Attempting to request data from: ' + apiKey)
    const resp = await axios.get(apiKey)
    if (resp.status !== 200) {
      console.log(resp.status)
      return
    }
    // console.dir(resp.data)
    setNutrientData(resp.data)
  }

  useEffect(() => {
    getNutrientData()
  }, [])

  const decimalToString = decimal => {
    let sDec = decimal.toString()
    if (!sDec.includes('.')) sDec += '.0'
    return sDec.split('.')
  }

  // prettier-ignore
  return (
    <section className="NutritionCont">
      {nutrientData ? (
        <table className="nutrientCont">
          <thead>
            <tr>
              <th colSpan="5" className="foodTitleCont">
                <span className="foodTitle">{pascalCaseExcept(nutrientData.description,1)}</span> <span className="foodCaption">(per 100 g)</span>
              </th>
            </tr>
            {nutrientData.brandOwner && <tr><td colSpan="5" className="foodMetaData foodIngredients">Brand: {quietPlease(nutrientData.brandOwner)}</td></tr>}
            {nutrientData.gtinUpc && <tr><td colSpan="5" className="foodMetaData">UPC: {sentenceCase(nutrientData.gtinUpc)}</td></tr>}
            {nutrientData.ingredients && <tr><td colSpan="5" className="foodMetaData">Ingredients: {sentenceCase(nutrientData.ingredients)}</td></tr>}
          </thead>
          <tbody>
            {nutrientData.foodNutrients
              .filter(n => !isNaN(n.amount))
              .sort((a, b) =>
                (nutrientOrder.indexOf(a.nutrient.name) === -1 ? 99 : nutrientOrder.indexOf(a.nutrient.name)) -
                (nutrientOrder.indexOf(b.nutrient.name) === -1 ? 99 : nutrientOrder.indexOf(b.nutrient.name))
              )
              .map((nutrient, index) => {
                return (
                  <tr key={index}>
                    <td className="tableLabel">{nutrient.nutrient.name}:</td>
                    <td className="tableValueMs">{decimalToString(nutrient.amount)[0]}</td>
                    <td className="tableDecimalPoint">{decimalToString(nutrient.amount)[1] === '0' ? '' : '.'}</td>
                    <td className="tableValueLs">{decimalToString(nutrient.amount)[1] === '0' ? '' : decimalToString(nutrient.amount)[1]}</td>
                    <td className="tableValueUnit">&nbsp;{nutrient.nutrient.unitName}</td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      ) : <section className="dataLoader">Loading data...</section>}
    </section>
  )
}

export default FoodDetail
