import React, { useState, useEffect } from 'react'
import axios from 'axios'
import config from '../config'

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
      {nutrientData && (
        <table className="nutrientCont">
          <thead>
            <tr>
              <th colSpan="5" className="foodTitleCont">
                <span className="foodTitle">{nutrientData.description}</span> <span className="foodCaption">(per 100 g)</span>
              </th>
            </tr>
            {/* <tr>
              <td colSpan="2" className="foodCaption">
                (per 100 g)
              </td>
            </tr> */}
          </thead>
          <tbody>
            {nutrientData.foodNutrients
              .filter(n => !isNaN(n.amount))
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
      )}
    </section>
  )
}

export default FoodDetail
