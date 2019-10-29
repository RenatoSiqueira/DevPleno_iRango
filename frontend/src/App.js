import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

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
        </header>
      </div>
    )
  }
}

export default App;
