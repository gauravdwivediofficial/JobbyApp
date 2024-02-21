import {Redirect} from 'react-router-dom'
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
  notFound: 'NOT_FOUND',
}

class JobItemDescription extends Component {
  state = {
    list: '',
    similarJobs: [],
    life: '',
    skills: [],
    status: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.JobDetailsApi()
  }

  JobDetailsApi = async () => {
    this.setState({status: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)

    if (response.ok === true) {
      this.setState({status: apiStatusConstants.success})

      const data = await response.json()
      const updatedJobData = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        id: data.job_details.id,
        jobDescription: data.job_details.job_description,
        lifeAtCompany: {
          imageUrl: data.job_details.life_at_company.image_url,
          description: data.job_details.life_at_company.description,
        },
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        title: data.job_details.title,
        skills: data.job_details.skills.map(eachItem => ({
          name: eachItem.name,
          imageUrl: eachItem.image_url,
        })),
      }
      const updatedSimilarJobs = data.similar_jobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        rating: eachItem.rating,
        title: eachItem.title,
      }))

      this.setState({similarJobs: updatedSimilarJobs})
      this.setState({list: updatedJobData})
      this.setState({life: updatedJobData.lifeAtCompany})
      this.setState({skills: updatedJobData.skills})
    } else {
      this.setState({status: apiStatusConstants.failure})
    }
  }

  onSuccess = () => {
    const {list, life, similarJobs, skills} = this.state
    console.log(similarJobs)
    const {description, imageUrl} = life

    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = list
    return (
      <>
        <div className="botm-container">
          <div>
            <img src={companyLogoUrl} alt="job details company logo" />
            <div>
              <h1>{title}</h1>
              <p>{rating}</p>
            </div>
          </div>
          <div>
            <div>
              <p>{location}</p>
              <p>{employmentType}</p>
            </div>
            <p>{packagePerAnnum}</p>
          </div>
          <hr />
          <div>
            <h1>Description</h1>
            <a href={companyWebsiteUrl}>Visit</a>
          </div>
          <p>{jobDescription}</p>
          <h1>Skills</h1>
          <ul>
            {skills.map(eachItem => (
              <li key={eachItem.name}>
                <img src={eachItem.imageUrl} alt={eachItem.name} />
                <p>{eachItem.name}</p>
              </li>
            ))}
          </ul>
          <h1>Life at Company</h1>
          <div>
            <p>{description}</p>
            <img src={imageUrl} alt="life at company" />
          </div>
        </div>
        <h1>Similar Jobs</h1>
        <ul>
          {similarJobs.map(eachItem => (
            <li key={eachItem.id} className="li-similar">
              <div>
                <img
                  src={eachItem.companyLogoUrl}
                  alt="job details company logo"
                />
                <div>
                  <h1>{eachItem.title}</h1>
                  <p>{eachItem.rating}</p>
                </div>
              </div>
              <h1>Description</h1>
              <p>{eachItem.jobDescription}</p>
              <div>
                <p>{eachItem.location}</p>
                <p>{eachItem.employmentType}</p>
              </div>
            </li>
          ))}
        </ul>
      </>
    )
  }

  retryButton = () => {
    this.JobDetailsApi()
  }

  onFailure = () => (
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

  onLoading = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderWithSwitch = () => {
    const {status} = this.state
    switch (status) {
      case apiStatusConstants.success:
        return this.onSuccess()
      case apiStatusConstants.inProgress:
        return this.onLoading()
      case apiStatusConstants.failure:
        return this.onFailure()
      default:
        return null
    }
  }

  render() {
    if (Cookies.get('jwt_token') === undefined) {
      return <Redirect path="/login" />
    }
    return (
      <div>
        <Header />
        <div className="bg-item-container">{this.renderWithSwitch()}</div>
      </div>
    )
  }
}

export default JobItemDescription
