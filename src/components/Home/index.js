import {Component} from 'react'
import {Redirect, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'

class Home extends Component {
  findJobs = () => {
    const {history} = this.props
    history.replace('/jobs')
  }

  render() {
    if (Cookies.get('jwt_token') === undefined) {
      return <Redirect to="/login" />
    }
    return (
      <div>
        <Header />
        <div className="bottom-container">
          <h1>Find The Job That Fits Your Life</h1>
          <p>
            Millions of people are searching for jobs,salary
            <br /> information,company reviews.Find the job that fits your
            <br /> abilities and potential.
          </p>
          <Link to="/jobs">
            <button type="button" onClick={this.findJobs}>
              Find Jobs
            </button>
          </Link>
        </div>
      </div>
    )
  }
}

export default Home
