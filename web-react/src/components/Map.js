import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useLocation } from 'react-router-dom'
import mapboxgl from 'mapbox-gl'

// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN

const useStyles = makeStyles(() => ({
  map: {
    height: '300px',
  },
}))
export default function Map(props) {
  const classes = useStyles()
  const [map, setMap] = useState(null)
  const location = useLocation()

  useEffect(() => {
    if (props.marker) {
      setMap(
        new mapboxgl.Map({
          container: 'map-container',
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [props.marker.longitude, props.marker.latitude],
          zoom: 13,
          dragRotate: false,
        })
      )
    }
  }, [location])

  useEffect(() => {
    if (map && props.marker) {
      new mapboxgl.Marker()
        .setLngLat([props.marker.longitude, props.marker.latitude])
        .addTo(map)
    }
  }, [map])

  return <div id="map-container" className={classes.map}></div>
}
