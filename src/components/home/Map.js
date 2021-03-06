import React from "react";
import ReactMapGL, { NavigationControl, Popup } from "react-map-gl";
import Container from "react-bootstrap/Container";
import Pins from "./Pins";

import coordinates from "../../assets/coordinates.json";

const navStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  padding: "10px"
};

export default class MapPane extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      viewport: {
        latitude: 40.346760,
        longitude: -74.655187,
        zoom: 15.25,
        width: 1025,
        height:700
      },
      popupHover: null
    };
  }

  onViewportChange = viewport => this.setState({ viewport });

  hoverPin = post => {
    if (this.props.popupSelect === post) {
      return;
    }
    else {
      this.setState({ popupHover: post });
    }
  };

  unhoverPin = () => {
    this.setState({ popupHover: null });
  };

  clickPin = post => {
    const popupSelect = this.props.popupSelect;
    if (popupSelect === null || popupSelect.building !== post.building) {
      this.props.setPopupSelect(post);
    }
    else {
      this.props.setPopupSelect(null);
    }
    this.setState({ popupHover: null });
  }

  renderPopupPosts(post) {
    const posts = this.props.posts.filter(item =>
      item.building === post.building && item.id !== "sk")
    return posts.map(post =>
      <Container className="p-0">
        {post.title}, <em>Room: {post.room}</em>
      </Container>
    );
  }

  renderPopup(post) {
    return (
      post && (
        <Popup
          tipSize={5}
          anchor="bottom"
          offsetTop={-30}
          longitude={coordinates[post.building][1]}
          latitude={coordinates[post.building][0]}
          closeButton={false}
        >
          <Container className="popup-title p-0">
            <strong>{post.building}</strong>
          </Container>
          {this.renderPopupPosts(post)}
        </Popup>
      )
    );
  }

  renderPopupHover() {
    const post = this.state.popupHover;
    return this.renderPopup(post);
  }

  renderPopupSelect() {
    const post = this.props.popupSelect;
    return this.renderPopup(post);
  }

  render() {
    const { viewport } = this.state;

    return (
      <ReactMapGL
        {...viewport}
        width="100%"
        height="100%"
        onViewportChange={this.onViewportChange}
        mapStyle="mapbox://styles/ibby/ck4s4lknb3ozs1crzpsxv5r4e"
        mapboxApiAccessToken="pk.eyJ1IjoiaWJieSIsImEiOiJjazRpYm5sb3Ywa3UxM2VudGZsNmxrZDE2In0.v08PMm1hYXIQo6led-GbmQ"
      >
        <Pins
          posts={this.props.posts}
          onClick={this.clickPin}
          onMouseEnter={this.hoverPin}
          onMouseLeave={this.unhoverPin}
        />
        {this.renderPopupSelect()}
        {this.renderPopupHover()}
        <div style={navStyle}>
          <NavigationControl onViewportChange={this.onViewportChange} />
        </div>
      </ReactMapGL>
    );
  }
}
