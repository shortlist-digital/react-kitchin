# React Kitchin

Declative components for creating a Kitchin powered Map

## Example setup using Tapestry

```js
const venueStyle = {
  background: 'white',
  position: 'fixed',
  padding: 20,
  top: '5%',
  right: 0,
  height: '90%',
  maxHeight: '90%',
  overflow: 'scroll',
  width: 300
}

const textStyle = {
  color: 'red',
  position: 'fixed',
  bottom: 30,
  left: 30
}

const navStyle = {
  textAlign: 'center',
  height: 80,
  padding: 20,
  color: 'white'

}

import React, { Component } from 'react'
import { MapBase, VenueProvider } from './legend'
import { Link } from 'react-router'

const Marker = (props) =>
  <Link to={`/map/${props.slug}`}>
    <div
      style={{
        borderRadius: 100, border: '3px solid white',
        backgroundImage: `url(${props.image_url})`,
        backgroundSize: 'cover',
        height: 80, width: 80,
        position: 'relative',
        zIndex:9999999,
      }}
    >
      <h1>{props.title}
    </h1></div>
  </Link>

const CustomVenue = ({venue, loading}) => {
  const { name, reviews, image_url } = venue
  return venue && (
    <div style={venueStyle}>
      {loading && <p>Loading</p>}
      <img style={{width: '100%', display: 'block'}} src={image_url} />
      <h1 dangerouslySetInnerHTML={{__html: name}} />
      <p
        style={{lineHeight: 1.4}}
        dangerouslySetInnerHTML={{__html: reviews[0].description}}
      />
    </div>
  )
}

const Nav = () =>
  <div style={{position: 'absolute', background: 'black', height: 80, width: '100%'}}>
    <Link style={navStyle} to={'/map/toms-kitchen-deli-bar-at-hms-belfast'}>Venue</Link>
    <Link style={navStyle} to={'/map'}>Map</Link>
  </div>

const MapView = (props) =>
  <div>
    <MapBase
      markerComponent={Marker}
      brand={__KITCHIN_BRAND__}
      kitchinUrl={__KITCHIN_URL__}
      venueSlug={props.routeParams.venueSlug}
      center={{lat: 51.501273, lng: 0.004876}}
    >
      <Nav />
      <h1 style={textStyle}>LEGEND</h1>
      <VenueProvider>
        <CustomVenue />
      </VenueProvider>
    </MapBase>
  </div>

export default {
  siteUrl: __CMS_URL__,
  routes: [{
    path: '/map',
    component: MapView
  },
  {
    path: '/map/:venueSlug',
    component: MapView
  }]
}
```
