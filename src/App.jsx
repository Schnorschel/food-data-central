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
  const [prevSearchCount, setPrevSearchCount] = useState(0)
  const [currSearchCount, setCurrSearchCount] = useState(0)
  const [gUser, setGUser] = useState(null)

  const currentTime = new Date()

  // prettier-ignore
  const timeOfDay = (dateTime) => {
    const hours = dateTime.getHours()
    switch (true) {
      case hours < 12: return 'Morning'
      case hours < 18: return 'Afternoon'
      case hours < 24: return 'Evening'
      default: return 'Day'
    }
  }

  useEffect(() => {
    console.log(`searchTerm: ${searchTerm}`)
  }, [searchTerm])

  useEffect(() => {
    console.log(`searchNow: ${currSearchCount}`)
  }, [currSearchCount])

  return (
      <Router>
      {currSearchCount > 0 ? <Redirect key={currSearchCount} to={`/Search/${searchTerm}/${requireAllWords}/1/${currSearchCount}`} /> : null}
        <header className="rootHeader">
          <h1 className="siteHeader">FoodData Central</h1>
          <nav>
            <ul>
              {/* {currentTime.toLocaleString()} */}
              {gUser && gUser.fullName && <li>Good {timeOfDay(currentTime)}, {gUser.fullName}</li>}
              <li><Link to="/">Home</Link></li>
              {gUser && gUser.username && <li><Link to="/Favorites">Favorites</Link></li>}
              {gUser && gUser.username ? <li><Link to="/Logout/u">Logout</Link></li> : <li><Link to="/Login/s">Login</Link></li>}
              {gUser && gUser.username ? null : <li><Link to="/Signup">Sign up</Link></li>}
            </ul>
          </nav>
          </header>
          <section className="searchTermCont">
          {/* value={searchTerm} onChange={e => {e.preventDefault(); setSearchTerm(e.target.value)}}  */}
          {/* setSearchNow(true) */}
          <input type="text" name="SearchTerm" placeholder="Search for food..." onKeyPress={e => {if (e.key === 'Enter') {console.log('Enter key pressed'); setSearchTerm(e.target.value); setCurrSearchCount(prev => prev +1)}}}/>
          {/* <select name="database" defaultChecked="All" onChange={e => setDatabase(e.target.value)} >
            <option name="database" value="All">All Databases</option>
            <option name="database" value="Survey (FNDDS)">Survey (FNDDS)</option>
            <option name="database" value="Foundation">Foundation</option>
            <option name="database" value="Branded">Branded</option>
            <option name="database" value="SR Legacy">SR Legacy</option>
          </select> */}
          {/* e.target.checked ? 'allWords' : 'anyWord' */}
          <input type="checkbox" name="requireAllWords" checked={requireAllWords === 'allWords'} onChange={e => {setRequireAllWords(e.target.checked ? 'allWords' : 'anyWord')}} />Require all words
          {/* <button name="Search" className="searchButton" onClick={handleNewSearch}>Search</button> */}
          {/* <span className="searchButton"><Link to={`/Search/${searchTerm}/${requireAllWords}/1`}>Search</Link></span> */}
        </section>        
        <Switch>
          <UserContext.Provider value={{gUser, setGUser}}>
            <Route exact path="/" component={HomePage}></Route>
            <Route exact path="/Favorites" component={Favorites}></Route>
            <Route exact path="/Search/:SearchTerm/:RequireAllWords/:PageNum/:Rnd" component={FoodSearch}></Route>
            {/* <Route exact path="/Search/:SearchTerm/:RequireAllWords/:PageNum" render={(props) => <FoodSearch {...props} key={currSearchCount} /> } ></Route> */}
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
