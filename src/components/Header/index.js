import Cookies from 'js-cookie'
import {Link, withRouter} from 'react-router-dom'
import './index.css'

const Header = props => {
  const onLogoutClick = () => {
    const {history} = props
    Cookies.remove('jwt_token')

    history.replace('/login')
  }

  return (
    <ul className="header-container">
      <li>
        <Link to="/">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="img"
          />
        </Link>
      </li>
      <li className="paragraph">
        <Link to="/">
          <p>Home</p>
        </Link>
        <Link to="/jobs">
          <p>Jobs</p>
        </Link>
      </li>
      <li>
        <button type="button" onClick={onLogoutClick}>
          Logout
        </button>
      </li>
    </ul>
  )
}

export default withRouter(Header)
