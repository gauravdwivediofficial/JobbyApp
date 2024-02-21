import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class SideContainer extends Component {
  state = {profile: '', status: 'INITIAL'}

  componentDidMount() {
    this.profileApi()
  }

  profileApi = async () => {
    this.setState({status: 'INPROGRESS'})
    const apiUrl = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = {
        profileImageUrl: data.profile_details.profile_image_url,
        name: data.profile_details.name,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({profile: updatedData})
      this.setState({status: 'SUCCESS'})
    } else {
      this.setState({status: 'FAILURE'})
    }
  }

  onChangeVal = event => {
    const {onEmploymentChange} = this.props
    onEmploymentChange(event.target.id)
  }

  onSuccess = () => {
    const {profile} = this.state
    const {profileImageUrl, shortBio, name} = profile
    return (
      <div>
        <img src={profileImageUrl} alt="profile" className="profile-pic" />
        <h1>{name}</h1>
        <p>{shortBio}</p>
      </div>
    )
  }

  onLoading = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onRetry = () => {
    this.profileApi()
  }

  onFailure = () => (
    <div>
      <button type="button" onClick={this.onRetry}>
        Retry
      </button>
    </div>
  )

  onSwitchCase = () => {
    const {status} = this.state
    switch (status) {
      case 'SUCCESS':
        return this.onSuccess()
      case 'INPROGRESS':
        return this.onLoading()
      case 'FAILURE':
        return this.onFailure()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <div className="profile-container">{this.onSwitchCase()}</div>
        <hr />
        <div className="employment">
          <h1>Type of Employment</h1>
          <ul className="ul">
            {employmentTypesList.map(eachItem => (
              <li key={eachItem.employmentTypeId}>
                <input
                  id={eachItem.employmentTypeId}
                  type="checkbox"
                  onChange={this.onChangeVal}
                />
                <label htmlFor={eachItem.employmentTypeId}>
                  {eachItem.label}
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div className="salary">
          <h1>Salary Range</h1>
          <ul className="ul">
            {salaryRangesList.map(eachItem => {
              const onChangeValue = event => {
                const {onSalaryChange} = this.props
                onSalaryChange(event.target.value)
              }

              return (
                <li onChange={onChangeValue} key={eachItem.salaryRangeId}>
                  <input
                    id={eachItem.salaryRangeId}
                    type="radio"
                    name="radio"
                    value={eachItem.salaryRangeId}
                  />
                  <label htmlFor={eachItem.salaryRangeId}>
                    {eachItem.label}
                  </label>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    )
  }
}

export default SideContainer
