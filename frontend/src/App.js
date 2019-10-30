import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps'
import axios from 'axios'

const Mapa = withScriptjs(withGoogleMap(props => {
  return (
    <GoogleMap
      defaultZoom={16}
      defaultCenter={{ lat: 0, lng: 0 }}
    >
      {props.restaurantes.map((r, i) => <Marker key={i} position={r} />)}
    </GoogleMap>
  )
}))

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      counter: 0,
      isGettingPosition: false,
      position: {},
      restaurantes: [],
      isLoading: false
    }

    this.getRestaurantes = this.getRestaurantes.bind(this)
  }
  getRestaurantes(lat, lng) {
    this.setState({ isLoading: true })
    const url = 'http://localhost:3000/api/restaurantes/distancia'
    axios
      .get(`${url}?lat=${lat}&lng=${lng}`)
      .then(ret => {
        this.setState({
          restaurantes: ret.data,
          isLoading: false
        })
      })
  }

  componentDidMount() {
    this.setState({ isGettingPosition: true })

    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude
      const lng = position.coords.longitude

      this.setState({
        isGettingPosition: false,
        position: { lat, lng }
      })

      this.getRestaurantes(lat, lng)
    })

    navigator.geolocation.watchPosition(position => {
      const lat = position.coords.latitude
      const lng = position.coords.longitude

      this.setState({
        isGettingPosition: false,
        position: { lat, lng }
      })

      this.getRestaurantes(lat, lng)
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
            <button onClick={() => this.getRestaurantes(this.state.position.lat, this.state.position.lng)}>Update Restaurantes</button>
          </p>
          <Mapa
            GoogleMapURL='https://maps.googleapis.com/maps/api/js?key=AIzaSyDKo-5UfSujcP0Io4nIf7wBPIXl1r5yx5Q'
            loadingElement={<div style={{ height: '100%', width: '100%' }}></div>}
            conteinerElement={<div style={{ height: '100%', width: '100%' }}></div>}
            mapElement={<div style={{ height: '400px', width: '100%' }}></div>}
            center={this.state.position}
            restaurantes={this.state.restaurantes}
          />
          {this.state.isLoading && <p>Carregando Restaurantes</p>}
          {
            !this.state.isLoading &&
            <table>
              <thead>
                <tr>
                  <th>Restaurantes</th>
                  <th>Distância</th>
                </tr>
              </thead>
              <tbody>
                {this.state.restaurantes.map((r, i) => {
                  return (
                    <tr key={i}>
                      <td>{r.nome}</td>
                      <td>{r.dis.toFixed(3)}km</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          }
        </header>
      </div>
    )
  }
}

export default App;
