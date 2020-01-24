import React from 'react'
import HelloWorld from '../components/HelloWorld'

const HomePage = () => {
  return (
    <section className="mainContainer">
      <p>
        A repository of nutrient information of commercial and generic foods
        provided through databases of the{' '}
        <a href="https://fdc.nal.usda.gov" target="_blank">
          USDA
        </a>{' '}
        (US Department of Agriculture).
      </p>
      <p>Search anonymously or sign up to save your favorite food items.</p>
    </section>
  )
}

export default HomePage
