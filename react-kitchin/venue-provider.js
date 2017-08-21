import React from 'react'

const VenueProvider = props => {
  return React.cloneElement(props.children, {
    venue: props.activeVenue,
    loading: props.loading
  })
}

export default VenueProvider
