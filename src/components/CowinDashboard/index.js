import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationByAge from '../VaccinationByAge'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationCoverage from '../VaccinationCoverage'
import './index.css'

const apiStatusConstans = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CowinDashboard extends Component {
  state = {
    apiStatus: apiStatusConstans.initial,
    covidVaccinationData: [],
  }

  componentDidMount() {
    this.getVaccinationData()
  }

  getVaccinationData = async () => {
    this.setState({
      apiStatus: apiStatusConstans.inProgress,
    })

    const vaccinationDataApiUrl = 'https://apis.ccbp.in/covid-vaccination-data'
    const options = {
      method: 'GET',
    }
    const response = await fetch(vaccinationDataApiUrl, options)

    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = {
        last7DaysVaccination: fetchedData.last_7_days_vaccination.map(
          eachDay => ({
            vaccineDate: eachDay.vaccine_date,
            dose1: eachDay.dose_1,
            dose2: eachDay.dose_2,
          }),
        ),

        vaccinationByAge: fetchedData.vaccination_by_age.map(eachAge => ({
          age: eachAge.age,
          count: eachAge.count,
        })),

        vaccinationByGender: fetchedData.vaccination_by_gender.map(
          eachGender => ({
            count: eachGender.count,
            gender: eachGender.gender,
          }),
        ),
      }

      this.setState({
        covidVaccinationData: updatedData,
        apiStatus: apiStatusConstans.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstans.failure,
      })
    }
  }

  renderApiInProgressView = () => (
    <div data-testid="loader" className="loading-view">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderApiFailureView = () => (
    <div className="failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        className="failure-image"
        alt="failure view"
      />
      <h1 className="failure-text"> Something went wrong </h1>
    </div>
  )

  renderApiSuccessView = () => {
    const {covidVaccinationData} = this.state
    return (
      <>
        <VaccinationCoverage
          vaccinationCoverageDetails={covidVaccinationData.last7DaysVaccination}
        />
        <VaccinationByGender
          vaccinationByGenderDetails={covidVaccinationData.vaccinationByGender}
        />
        <VaccinationByAge
          vaccinationByAgeDetails={covidVaccinationData.vaccinationByAge}
        />
      </>
    )
  }

  renderViewOnBasisApiStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstans.success:
        return this.renderApiSuccessView()

      case apiStatusConstans.failure:
        return this.renderApiFailureView()

      case apiStatusConstans.inProgress:
        return this.renderApiInProgressView()

      default:
        return null
    }
  }

  render() {
    return (
      <div className="app-container">
        <div className="dashbord-container">
          <div className="logo-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
              className="logo"
              alt="website logo"
            />
            <h1 className="logo-heading">Co-Win</h1>
          </div>
          <h1 className="heading"> CoWIN Vaccination in India </h1>
          {this.renderViewOnBasisApiStatus()}
        </div>
      </div>
    )
  }
}

export default CowinDashboard
