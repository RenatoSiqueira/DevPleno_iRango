import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps'

const Mapa = withScriptjs(withGoogleMap(props => {
  return (
    <GoogleMap
      defaultZoom={16}
      defaultCenter={{ lat: 0, lng: 0 }}
    >
    </GoogleMap>
  )
}))

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      counter: 0,
      isGettingPosition: false,
      position: {}
    }

  }
  componentDidMount() {
    this.setState({ isGettingPosition: true })
    navigator.geolocation.getCurrentPosition(position => {
      this.setState({
        isGettingPosition: false,
        position: {
          lat: position.coords.latitude,
          lng: position.coords.latitude
        }
      })
    })
  }
  render() {
    if (this.state.isGettingPosition) {
      return <p>Pegando Localização do Usuário</p>
    }
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            {JSON.stringify(this.state.position)}
          </p>
          <Mapa
            GoogleMapURL='https://maps.googleapis.com/maps/api/js?key=AIzaSyDKx1YannnmBWZl6NNtTOYU_C5DMgu8X_0'
            loadingElement={<div style={{ height: '100%', width: '100%' }}></div>}
            conteinerElement={<div style={{ height: '100%', width: '100%' }}></div>}
            mapElement={<div style={{ height: '400px', width: '100%' }}></div>}
            center={this.state.position}
          />
        </header>
      </div>
    )
  }
}

export default App;
