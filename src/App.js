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
  }
 
  // componentDidMount(){
  //   fetch('http://localhost:3000/')
  //   .then(res => {
  //     return res.json();
  //   })
  //   .then(data => {
  //     console.log(data);
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   })
  // }

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
    app.models.predict
      (Clarifai.FACE_DETECT_MODEL,
        this.state.input)
      .then(response => {

        if (response){
          fetch('http://localhost:3000/image',{
            method:'put',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({
                id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(
              Object.assign(this.state.user, { entries: count })
            )
          })
        }
        let faces_detected = []
        for(let i=0; i<response.outputs[0].data.regions.length;i++){
          let faces = response.outputs[0].data.regions[i]
          faces_detected.push(this.calculateBoundingBox(faces.region_info.bounding_box, i))
        }
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
    console.log(this.state.user)
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
