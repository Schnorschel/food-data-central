import React, { useState, useEffect } from 'react'
import axios from 'axios'

const FoodDetail = props => {
  const [nutrientData, setNutrientData] = useState()

  const getNutrientData = async () => {
    const apiKey = `https://api.nal.usda.gov/fdc/v1/${props.match.params.fdcId}?api_key=BG5c7pT5v0GRIWmEskVFQ5fyKKonSdy9zs31JvQa`
    console.log('Attempting to request data from: ' + apiKey)
    const resp = await axios.get(apiKey)
    if (resp.status != 200) {
      console.log(resp.status)
      return
    }
    setNutrientData(resp.data)
  }

  useEffect(() => {
    getNutrientData()
  }, [])

  return (
    <section className="NutritionCont">
      {nutrientData && (
        <table className="nutrientCont">
          <tr>
            <th colspan="2" className="foodTitle">
              {nutrientData.description}
            </th>
          </tr>
          <tr>
            <td colspan="2" className="foodCaption">
              (per 100 g)
            </td>
          </tr>
          {nutrientData.foodNutrients.map((nutrient, index) => {
            return (
              <tr>
                <td className="tableLabel">{nutrient.nutrient.name}:</td>
                <td className="tableValue">
                  {nutrient.amount} {nutrient.nutrient.unitName}
                </td>
              </tr>
            )
          })}
        </table>
      )}
    </section>
  )
}

export default FoodDetail
