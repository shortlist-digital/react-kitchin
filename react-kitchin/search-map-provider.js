import React, { Component } from 'react'
import debounce from 'lodash/debounce'

export default class SearchMapProvider extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      searchTerm: ''
    }
    this.handleOnChange = this.handleOnChange.bind(this)
    this.pushUp = debounce(this.pushUp, 750).bind(this)
  }

  pushUp() {
    this.geolocate()
  }

  geolocate() {
    if (this.state.searchTerm) {
      const searchTerm = this.state.searchTerm
      const apiUrl = "https://maps.googleapis.com/maps/api/geocode/json?address="
      const url = `${apiUrl}${encodeURIComponent(searchTerm)}+UK`

      fetch(url)
        .then((response) => {
          if (response.status >= 400) {
            throw new Error("Bad response from server");
          }
          return response.json()
        })
        .then((data) => {
          if (data.results.length) {
            console.log('data :', data)
            this.props.centerMap(data.results[0].geometry.location)
          }
        })
    }
  }

  handleOnChange(event) {
    this.setState({searchTerm: event.target.value}, () => {
      this.pushUp(this.state.searchTerm)
    })
  }
  render() {
    return this.props.children({
      inputOnChangeHandler: this.handleOnChange
    })
  }
}
