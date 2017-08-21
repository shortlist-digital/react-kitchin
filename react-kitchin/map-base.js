import React, { Component } from 'react'
import GoogleMap from 'google-map-react'
import VenueProvider from './venue-provider'
import SearchMapProvider from './search-map-provider'

export default class MapBase extends Component {
  constructor(...args) {
    super(...args)
    this.state = {
      venues: [],
      activeVenue: false,
      loading: false,
      error: false,
      location: {}
    }
    this.venueStore = new Map
    this.navigateToVenueBySlug = this.navigateToVenueBySlug.bind(this)
    this.centerMap = this.centerMap.bind(this)
  }

  navigateToVenueBySlug(props) {
    const slug = props.venueSlug
    if (slug) {
      if (!this.venueStore.has(slug)) {
        this.setState({loading: true})
        const url = `
            ${this.props.kitchinUrl}/api/v1/venue/?slug=${slug}
          `
          fetch(url)
          .then(resp => resp.json())
          .then(json => {
            this.venueStore.set(json.slug, json)
            this.setState({loading: false, activeVenue: json})
          })
          .catch(error => {
            this.setState({error})
          })
      } else {
        this.setState({activeVenue: this.venueStore.get(slug)})
      }
    } else this.setState({activeVenue: false})
  }

  componentDidMount() {
    const { center } = this.props
    this.setState({location: center})
    const kitchin = {
      brand: this.props.brand,
      url: this.props.kitchinUrl
    }

    const url = `
      ${kitchin.url}/api/v1/brand/${kitchin.brand}/venues?lat=${center.lat}&lng=${center.lng}&radius=5000`

    fetch(url)
      .then(resp => resp.json())
      .then(json => this.setState({venues: json}))

    if (this.props.venueSlug !== false) {
      this.navigateToVenueBySlug(this.props)
    }
  }

  componentWillReceiveProps(nextProps) {
    const props = this.props
    if (nextProps.venueSlug !== this.props.venueSlug) {
      this.navigateToVenueBySlug(nextProps)
    }
  }

  centerMap(location) {
    this.setState({location: location})
  }

  injectProps(children) {
    return React.Children.map(children, child => {
      if (child && (child.type == VenueProvider)) {
        return React.cloneElement(child, {
          activeVenue: this.state.activeVenue,
          loading: this.state.loading
        })
      }
      if (child && (child.type == SearchMapProvider)) {
        return React.cloneElement(child, {
          centerMap: this.centerMap
        })
      }
      return child
    })
  }

  render() {
    const props =  this.props
    return (
      <div>
        <GoogleMap
          apiKey={'AIzaSyAs1uUAnFwp_9nX-4wAb-9N8BDmhsghxRc'}
          center={[this.state.location.lat, this.state.location.lng]}
          zoom={14}
          style={{
            minWidth: '100%',
            minHeight: '100%',
            zIndex: 10
          }}
          hoverDistance={120}
        >
          {this.state.venues.map(venue => (
            <props.markerComponent  key={venue.id} {...venue} />
          ))}
        </GoogleMap>
        <div style={{zIndex: 100, position: 'relative'}}>
          {this.injectProps(this.props.children)}
        </div>
      </div>
    )
  }
}
