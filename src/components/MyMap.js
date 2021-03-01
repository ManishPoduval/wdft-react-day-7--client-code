import React, { Component } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet';

class MyMap extends Component {
  render() {
    const position = [52.520, 13.405]

  const ironhackLogo = new L.Icon({
      iconUrl: 'https://i1.wp.com/www.alliron.vc/wp-content/uploads/2018/05/logo-ironhack-1.png',
      iconSize: [68, 65],
  });

  return (
      <div>
        <MapContainer style={{width: '800px', height: '500px'}}  center={position} zoom={13} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker icon={ironhackLogo} position={position}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    )
  }
}

export default MyMap
