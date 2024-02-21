import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import SingleJobDes from '../SingleJobDes'
import SideContainer from '../SideContainer'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
  notFound: 'NOT_FOUND',
}

class Jobs extends Component {
  state = {
    searchInput: '',
    minimumPackage: '',
    list: [],
    checkboxInputs: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.jobsApiUrl()
  }

  jobsApiUrl = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {searchInput, checkboxInputs, minimumPackage} = this.state
    const checkboxes = checkboxInputs.join(',')
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${checkboxes}&minimum_package=${minimumPackage}&search=${searchInput}`

    const response = await fetch(apiUrl, options)
    console.log(response)
    if (response.ok === true) {
      const data = await response.json()
      if (data.jobs.length === 0) {
        this.setState({apiStatus: apiStatusConstants.notFound})
      } else {
        const updatedData = data.jobs.map(eachItem => ({
          id: eachItem.id,
          companyLogoUrl: eachItem.company_logo_url,
          employmentType: eachItem.employment_type,
          jobDescription: eachItem.job_description,
          location: eachItem.location,
          packagePerAnnum: eachItem.package_per_annum,
          rating: eachItem.rating,
          title: eachItem.title,
        }))

        this.setState({list: updatedData})
        this.setState({apiStatus: apiStatusConstants.success})
      }
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onNotFoundfailure = () => (
    <div className="nofound">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
      />
      <h1>No Jobs Found</h1>
      <p>We could not find any jobs. Try other filters.</p>
    </div>
  )

  onInputChange = event => {
    this.setState({searchInput: event.target.value})
  }

  onSubmitInput = () => {
    this.jobsApiUrl()
  }

  onSalaryChange = value => {
    this.setState({minimumPackage: value}, this.jobsApiUrl)
  }

  onEmploymentChange = value => {
    const {checkboxInputs} = this.state

    if (checkboxInputs.includes(value) === false) {
      this.setState(
        prevState => ({
          checkboxInputs: [...prevState.checkboxInputs, value],
        }),
        this.jobsApiUrl,
      )
    } else {
      const filter = checkboxInputs.filter(eachItem => eachItem !== value)
      this.setState({checkboxInputs: filter}, this.jobsApiUrl)
    }
  }

  inLoading = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  retryButton = () => {
    this.jobsApiUrl()
  }

  failure = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png "
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button type="button" onClick={this.retryButton}>
        Retry
      </button>
    </div>
  )

  onKeyPress = event => {
    if (event.key === 'Enter') {
      this.jobsApiUrl()
    }
  }

  onSuccess = () => {
    const {list, searchInput} = this.state
    return (
      <div className="main-container">
        <div className="input">
          <input
            type="search"
            onChange={this.onInputChange}
            value={searchInput}
            className="ip"
            placeholder="Search"
            onKeyDown={this.onKeyPress}
          />
          <button
            type="button"
            data-testid="searchButton"
            onClick={this.onSubmitInput}
          >
            <BsSearch className="search-icon" />
          </button>
        </div>
        <ul className="ul">
          {list.map(eachItem => (
            <SingleJobDes eachItem={eachItem} key={eachItem.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderWithStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.onSuccess()
      case apiStatusConstants.failure:
        return this.failure()
      case apiStatusConstants.inProgress:
        return this.inLoading()
      case apiStatusConstants.notFound:
        return this.onNotFoundfailure()
      default:
        return null
    }
  }

  render() {
    if (Cookies.get('jwt_token') === undefined) {
      return <Redirect to="/login" />
    }
    const {checkboxInputs} = this.state
    console.log(checkboxInputs.join(','))

    return (
      <div>
        <Header />
        <div className="Jobs-bottom-container">
          <div className="side-container">
            <SideContainer
              onSalaryChange={this.onSalaryChange}
              onEmploymentChange={this.onEmploymentChange}
              jobsApiUrl={this.jobsApiUrl}
            />
          </div>
          {this.renderWithStatus()}
        </div>
      </div>
    )
  }
}

export default Jobs
