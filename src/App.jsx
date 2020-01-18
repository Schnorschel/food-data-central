import React, { useState, useEffect } from 'react'
// prettier-ignore
import { BrowserRouter as Router, Link, Route, Switch, Redirect } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Login from './pages/Login'
import FoodDetail from './pages/FoodDetail'
import FoodSearch from './pages/FoodSearch'
import Favorites from './pages/Favorites'
import Logout from './pages/Logout'
import Signup from './pages/Signup'
import NotFound from './pages/NotFound'
import { UserContext } from './UserContext'

// prettier-ignore
const App = () => {
  const [searchTerm, setSearchTerm] = useState()
  const [requireAllWords, setRequireAllWords] = useState('anyWord')
  const [searchNow, setSearchNow] = useState(false)
  const [gUser, setGUser] = useState(null)

  return (
      <Router>
      {searchNow ? <Redirect to={`/Search/${searchTerm}/${requireAllWords}/1`} /> : null}
        <header className="rootHeader">
          <h1 className="siteHeader">FoodData Central</h1>
          <nav>
            <ul>
              {gUser && gUser.username && <li>{gUser.username}</li>}
              <li><Link to="/">Home</Link></li>
              {gUser && gUser.username && <li><Link to="/Favorites">Favorites</Link></li>}
              {gUser && gUser.username ? <li><Link to="/Logout/u">Logout</Link></li> : <li><Link to="/Login/s">Login</Link></li>}
              {gUser && gUser.username ? null : <li><Link to="/Signup">Sign up</Link></li>}
            </ul>
          </nav>
          </header>
          <section className="searchTermCont">
          <input type="text" name="SearchTerm" placeholder="Search for food..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} onKeyPress={e => {if (e.key === 'Enter') {setSearchNow(true)}}}/>
          {/* <select name="database" defaultChecked="All" onChange={e => setDatabase(e.target.value)} >
            <option name="database" value="All">All Databases</option>
            <option name="database" value="Survey (FNDDS)">Survey (FNDDS)</option>
            <option name="database" value="Foundation">Foundation</option>
            <option name="database" value="Branded">Branded</option>
            <option name="database" value="SR Legacy">SR Legacy</option>
          </select> */}
          <input type="checkbox" name="requireAllWords" value="true" checked={requireAllWords === 'allWords'} onClick={e => setRequireAllWords(e.target.checked ? 'allWords' : 'anyWord')} />Require all words
          {/* <button name="Search" className="searchButton" onClick={handleNewSearch}>Search</button> */}
          {/* <span className="searchButton"><Link to={`/Search/${searchTerm}/${requireAllWords}/1`}>Search</Link></span> */}
        </section>        
        <Switch>
          <UserContext.Provider value={{gUser, setGUser}}>
            <Route exact path="/" component={HomePage}></Route>
            <Route exact path="/" component={Favorites}></Route>
            <Route exact path="/Search/:SearchTerm/:RequireAllWords/:PageNum" component={FoodSearch}></Route>
            <Route exact path="/Login/:purpose" component={Login}></Route>
            <Route exact path="/Logout/:purpose" component={Logout}></Route>
            <Route exact path="/Signup" component={Signup}></Route>
            <Route exact path="/foodDetail/:fdcId" component={FoodDetail}></Route>
          </UserContext.Provider>
            <Route path="*" component={NotFound}></Route>
        </Switch>
      </Router>
  )
}

export default App
