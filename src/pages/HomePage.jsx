import React from 'react'
import HelloWorld from '../components/HelloWorld'

const HomePage = () => {
  return (
    <section className="mainContainer">
      <p className="bigMessage">
        A repository of nutrient information of commercial and generic foods
        provided through databases of the{' '}
        <a href="https://fdc.nal.usda.gov" target="_blank">
          USDA
        </a>{' '}
        (US Department of Agriculture)
      </p>
      <p className="subTitle">
        Search anonymously or sign up and log in to save your favorite food
        items
      </p>
    </section>
  )
}

export default HomePage
