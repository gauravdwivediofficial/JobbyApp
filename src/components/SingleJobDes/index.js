import {Link} from 'react-router-dom'
import './index.css'

const SingleJobDes = props => {
  const {eachItem} = props
  const {
    id,
    companyLogoUrl,
    location,
    employmentType,
    jobDescription,
    packagePerAnnum,
    rating,
    title,
  } = eachItem
  return (
    <Link to={`/jobs/${id}`}>
      <li className="li-item">
        <div>
          <img src={companyLogoUrl} alt="company logo" className="img" />
          <div>
            <h1 className="title">{title}</h1>
            <div>
              <img src="" alt="" />
              <p className="rating">{rating}</p>
            </div>
          </div>
        </div>
        <div className="mini-cont">
          <div className="in-mini-cont">
            <p>{location}</p>
            <p>{employmentType}</p>
          </div>
          <p>{packagePerAnnum}</p>
        </div>
        <hr />
        <h1>Description</h1>
        <p>{jobDescription}</p>
      </li>
    </Link>
  )
}

export default SingleJobDes
