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

const particles_params = {
  particles: {
    number: {
      value: 90,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const initalState = {
  input: '',
  imageUrl: '',
  faceBoxes: [],
  route: 'signin',
  isSignedin: false,
  user: {
    id: '',
    name: '',
    email:'',
    pass:'',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initalState;
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  calculateBoundingBox(data, index) {
    const img = document.getElementById('input-image');
    const width = Number(img.width);
    const height = Number(img.height);
    return {
      id: index,
      leftCol: data.left_col * width,
      topRow: data.top_row * height,
      rightCol: width - (data.right_col * width),
      bottomRow: height - (data.bottom_row * height)
    }

  }

  onDetectClick = () => { 
    this.setState({ imageUrl: this.state.input });
    fetch('https://fast-oasis-14486.herokuapp.com/imageurl',{
      method:'post',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
          input: this.state.input
      })
    })
    .then(response => response.json())
    .then(response => {
      let faces_detected = []
      if (response !== 'Unable to work with api' && response.outputs[0].data.regions){
        fetch('https://fast-oasis-14486.herokuapp.com/image',{
          method:'put',
          headers:{'Content-Type':'application/json'},
          body: JSON.stringify({
              id: this.state.user.id
          })
        })
        .then(res => res.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, { entries: count }))
          faces_detected = response.outputs[0].data.regions.map((faces, i) => {
            return this.calculateBoundingBox(faces.region_info.bounding_box, i);
          })
          this.setState({ faceBoxes: faces_detected });
        })
        .catch(console.log)
      }
      this.setState({ faceBoxes: faces_detected });
    })
    .catch(err => console.log(err));
  }

  onRouteChange = (to) => {
    if (to === 'home'){
      this.setState({isSignedin: true})
    }
    else if (to === 'signin'){
      this.setState(initalState);
    }
    this.setState({ route : to})
  }

  loadUser = (data) => {
    this.setState({user: {
        id: data.id,
        name: data.name,
        email: data.email,
        pass: data.pass,
        entries: data.entries,
        joined: data.joined
      }
    }
    )
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
              <Rank name={this.state.user.name} entries={this.state.user.entries}/>
              <ImageLinkForm 
              onInputChange={this.onInputChange} 
              onDetectClick={this.onDetectClick} />
              <FaceRecognition 
              imageUrl={this.state.imageUrl} 
              faceBoxes={this.state.faceBoxes} />
            </div>
          : (this.state.route === 'signin'
              ?<Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
              : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
            )
        }
      </div>
    );
  }
}

export default App;
