import React from "react";
import Container from "react-bootstrap/Container";
import UserPost from "./profile/UserPost";

export default class Profile extends React.Component {
  componentDidMount() {
    this.props.getUserData();
  }

  renderText() {
    if (this.props.posts.length === 0) {
      return "No Active Posts"
    }
    else {
      return "Active Posts"
    }
  }

  renderPosts() {
    return this.props.posts.map(post =>
      <UserPost
        key={post.id}
        deletePost={this.props.deletePost}
        likePost={this.props.likePost}
        likes={this.props.likes}
        openForm={this.props.openForm}
        post={post}
        unlikePost={this.props.unlikePost}
      />
    );
  }

  render() {
    return (
      <Container fluid id="profile" className="p-0">
        <h4 id="profile-name">{this.props.netid}</h4>
        <h5 id="profile-text">{this.renderText()}</h5>
        <Container id="user-feed" className="p-0">
          {this.renderPosts()}
        </Container>
      </Container>
    );
  }
}
