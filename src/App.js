import './App.css';
import React, { Component } from 'react';
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import Signin from './Components/Signin/Signin';
import Register from './Components/Register/Register';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';


const app = new Clarifai.App({
  apiKey: 'YOUR API KEY HERE'
});

const particles_params = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}
class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      faceBoxes: [],
      route: 'signin',
      isSignedin: false
    }
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  calculateBoundingBox(data) {
    const img = document.getElementById('input-image');
    const width = Number(img.width);
    const height = Number(img.height);
    return {
      leftCol: data.left_col * width,
      topRow: data.top_row * height,
      rightCol: width - (data.right_col * width),
      bottomRow: height - (data.bottom_row * height)
    }

  }

  onDetectClick = () => {
    this.setState({ imageUrl: this.state.input });
    app.models.predict
      (Clarifai.FACE_DETECT_MODEL,
        this.state.input)
      .then(response => {
        const faces_detected = response.outputs[0].data.regions.map((faces) => this.calculateBoundingBox(faces.region_info.bounding_box))
        this.setState({ faceBoxes: faces_detected });
      })
  }

  onRouteChange = (to) => {
    if (to === 'home'){
      this.setState({isSignedin: true})
    }
    else if (to === 'signin'){
      this.setState({isSignedin: false})
    }
    this.setState({ route : to})
  }

  render() {
    return (
      <div className="App">
        <Particles className='particles'
          params={particles_params} />
        <Navigation onRouteChange = {this.onRouteChange} isSignedIn={this.state.isSignedin}/>
        { 
          this.state.route === 'home'
          ?  <div>
              <Logo />
              <Rank />
              <ImageLinkForm 
              onInputChange={this.onInputChange} 
              onDetectClick={this.onDetectClick} />
              <FaceRecognition 
              imageUrl={this.state.imageUrl} 
              faceBoxes={this.state.faceBoxes} />
            </div>
          : (this.state.route === 'signin'
              ?<Signin onRouteChange={this.onRouteChange}/>
              : <Register onRouteChange={this.onRouteChange}/>
            )
        }
      </div>
    );
  }
}

export default App;
