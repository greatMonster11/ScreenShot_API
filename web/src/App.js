import React, { Component } from "react";
import Intro from "./components/intro";

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
      .then(data => {
        this.setState({ imageURL: data });
      });
  };

  render() {
    const { imageURL } = this.state;
    return (
      <div className="container">
        <Intro />
        <div className="form-group">
          <div className="row gutters-xs">
            <div className="col">
              <input
                className="form-control is-valid"
                onChange={this.handelChange}
                type="text"
                placeholder="enter the URL you want ..."
              />
            </div>
            <div className="col-auto">
              <button
                onClick={this.handleScreenshot}
                className="btn btn-primary"
              >
                Screenshot
              </button>
            </div>
          </div>
          <pre>
            {imageURL && (
              <code>
                <span>image: {imageURL.image}</span>
                <br />
                <span>status: {imageURL.status}</span>
                <br />
                <span>url: {imageURL.url}</span>
              </code>
            )}
          </pre>
        </div>

        {imageURL && <img src={imageURL.image} />}
      </div>
    );
  }
}

export default App;
