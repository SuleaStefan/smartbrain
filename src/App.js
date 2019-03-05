import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import SignIn from './components/SignIn/SignIn';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Rank from './components/Rank/Rank';
import './App.css';
import 'tachyons'
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Register from './components/Register/Register';

const app = new Clarifai.App({
	apiKey: 'd621026420804a1bb76ca9f4bebe7792'
});

const particlesOptions = {
    particles: {
    	number: {
    		value: 200,
    		density: {
    			enable: true,
    			value_area: 800,
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
      box: {},
      route: 'signin',
      isSignedIn: 'false',
		}
	}
  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height),
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box})
  }

	onInputChange = (event) => {
    if(this.route === 'signout'){
      this.setState({isSignedIn: false})
    }else{
      this.setState({isSignedIn: true})
    }
		this.setState({input: event.target.value});
	}

	onButtonSubmit = () => {
		this.setState({imageUrl: this.state.input});
		app.models
			.predict(
				Clarifai.FACE_DETECT_MODEL,
				this.state.input)
			.then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
			.catch(err => console.log(err));
	}

  onRouteChange = (route) => {
    this.setState({route: route});
  }

  render() {
    return (
      <div className="App">
      	<Particles className='particles'
              params={particlesOptions}
         />
        { this.state.route === 'home'
          ? <div>
              <Navigation onRouteChange={this.onRouteChange} />
              <Logo />
              <Rank />
              <ImageLinkForm 
                      onInputChange={this.onInputChange}
                      onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
            </div>

          : (
              this.state.route === 'signin'
              ? <SignIn onRouteChange={this.onRouteChange} />
              : <Register onRouteChange={this.onRouteChange} />
            ) 
       }
      </div>
    );
  }
}

export default App;
