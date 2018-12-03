import React, { Component } from "react";
import "./App.css";

class App extends Component {
  state = {
    inputLink: "",
    imageURL: null
  };

  handelChange = e => {
    this.setState({ inputLink: e.target.value });
  };

  handleScreenshot = e => {
    e.preventDefault();
    fetch(`http://localhost:8080/?url=https://${this.state.inputLink}`)
      .then(res => res.json())
      .then(data => this.setState({ imageURL: data.image }));
  };

  render() {
    const { imageURL } = this.state;
    return (
      <div className="App">
        <input
          onChange={this.handelChange}
          type="text"
          placeholder="enter the URL you want ..."
        />
        <button onClick={this.handleScreenshot}>Screen Shot this page</button>
        {imageURL && <img src={imageURL} />}
      </div>
    );
  }
}

export default App;
