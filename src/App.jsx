import React from 'react'
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom'
import Page from './pages/Page'
import FoodDetail from './pages/FoodDetail'
import FoodDataCentral from './pages/FoodDataCentral'
import NotFound from './pages/NotFound'

const App = () => {
  return (
    <Router>
      <header>
        <h1>FoodData Central</h1>
        <nav>
          <ul>
            <li>
              <Link to="/">Food Data Central</Link>
            </li>
            {/* <li>
              <Link to="/1">Page 1</Link>
            </li> */}
          </ul>
        </nav>
      </header>
      <Switch>
        <Route exact path="/" component={FoodDataCentral}></Route>
        <Route exact path="/foodDetail/:fdcId" component={FoodDetail}></Route>
        {/* <Route exact path="/2" component={Page2}></Route> */}
        <Route path="*" component={NotFound}></Route>
      </Switch>
    </Router>
  )
}

export default App
