import React from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";

import buildings from "../assets/buildings.json";

export default class PostForm extends React.Component {
  constructor(props) {
    super(props);

    this.initialDiet = {
      "vegetarian": false,
      "vegan": false,
      "kosher": false,
      "halal": false,
      "gluten": false,
    }

    this.initialPost = {
      title: "",
      room: "",
      building: "-- Select building --",
      images: [],
      desc: "",
      diet: this.initialDiet,
      feeds: "",
      netid: ""
    };

    this.initialValid = {
      title: false,
      room: false,
      building: false,
      images: false,
      desc: true,
      feeds: false
    };

    this.diets = [
      {
        id: 0,
        name: "vegetarian",
        label: "Vegetarian"
      },
      {
        id: 1,
        name: "vegan",
        label: "Vegan"
      },
      {
        id: 2,
        name: "kosher",
        label: "Kosher"
      },
      {
        id: 3,
        name: "halal",
        label: "Halal"
      },
      {
        id: 4,
        name: "gluten",
        label: "Gluten-Free"
      }
    ];

    this.state = {
      post: this.cleanPost(),
      valid: this.initialValid,
      validForm: false,
      oldPost: null,
      prevProps: this.props
    };
  }

  componentDidUpdate() {
    if (this.state.prevProps !== this.props && this.props.show) {
      if (!this.props.isNew) {
        const post = this.props.values;
        post.diet = Object.assign({}, this.dietToDict(post.diet));

        const valid = this.initialValid;
        valid.title = true;
        valid.room = true;
        valid.building = true;
        valid.images = true;
        valid.feeds = true;

        this.setState({
          post,
          valid,
          validForm: true,
          oldPost: Object.assign({}, post)
        });
      }
      this.setState({ prevProps: this.props });
    }
  }

  handleChange = event => {
    const name = event.target.name;
    const value = event.target.value;
    const post = this.state.post;
    post[name] = value;
    this.setState({ post });
    this.validate();
  }

  handleImageChange = event => {
    const post = this.state.post;
    post.images = event.target.files;
    this.setState({ post });
    this.validate();
  }

  handleDietChange = event => {
    const name = event.target.name;
    const post = this.state.post;
    post.diet[name] = !post.diet[name];
    this.setState({ post });
  }

  close = async () => {
    this.props.handleClose();
    await this.setState({ post: this.cleanPost() });
    this.validate();
  }

  handleSubmit = event => {
    event.preventDefault();
    event.returnValue = false;

    const { post, oldPost } = this.state;
    post.diet = this.dietToList(post.diet);
    post.netid = this.props.netid;

    if (this.props.isNew) {
      this.props.newPost(post);
    }
    else {
      let newPost = {};
      for (const key in post) {
        if (post[key] !== oldPost[key]) {
          newPost[key] = post[key];
        }
      }
      this.props.editPost(oldPost.id, newPost);
    }

    this.close();
  }

  validate() {
    const { post, valid } = this.state;

    valid.title = post.title.length > 0;
    valid.room = post.room.length > 0;
    valid.building = post.building !== "-- Select building --";
    valid.images = post.images.length > 0;
    valid.desc = post.desc.length < 251;
    valid.feeds = post.feeds !== "" && post.feeds > 0;

    const validForm = valid.title && valid.room && valid.building &&
      valid.images && valid.desc && valid.feeds;
    this.setState({ validForm });
  }

  dietToDict(diet) {
    if (diet === undefined) {
      return this.initialDiet;
    }
    else if (Array.isArray(diet)) {
      const dict = Object.assign({}, this.initialDiet);
      diet.forEach(i => dict[this.diets[i].name] = true);
      return dict;
    }
    else {
      return diet;
    }
  }

  dietToList(diet) {
    const list = [];
    for (let i = 0; i < this.diets.length; i++) {
      if (diet[this.diets[i].name]) {
        list.push(i);
      }
    }
    return list;
  }

  cleanPost() {
    const post = Object.assign({}, this.initialPost)
    post.diet = Object.assign({}, this.initialDiet)
    return post;
  }

  renderRequired(label, name) {
    if (this.state.valid[name]) {
      return (
        <Form.Label>{label}<span className="red">*</span></Form.Label>
      );
    }
    else {
      return (
        <Form.Label className="red">{label}*</Form.Label>
      );
    }
  }

  renderLabel(label, name) {
    if (this.state.valid[name]) {
      return (
        <Form.Label>{label}</Form.Label>
      );
    }
    else {
      return (
        <Form.Label className="red">{label}</Form.Label>
      );
    }
  }

  renderBuildings() {
    return buildings.sort()
      .map((building, index) =>
        <option key={index}>{building}</option>
      );
  }

  renderDietOptions() {
    return this.diets.map(diet =>
      <Form.Check
        key={diet.id}
        type="checkbox"
        name={diet.name}
        label={diet.label}
        checked={this.state.post.diet[diet.name]}
        onChange={this.handleDietChange}
      />
    );
  }

  renderSubmitMessage() {
    if (this.state.validForm) {
      return;
    }
    else {
      return (
        <Container className="form-warning p-0">
          Please properly fill out the fields in red.
        </Container>
      );
    }
  }

  render() {
    return (
      <Modal show={this.props.show}>
        <Modal.Header>
          <Modal.Title>New post</Modal.Title>
        </Modal.Header>
        <Form onSubmit={this.handleSubmit}>
          <Modal.Body>
            <Form.Group>
              {this.renderRequired("Title", "title")}
              <Form.Control type="text" name="title"
                placeholder="Enter title"
                value={this.state.post.title}
                onChange={this.handleChange}
              />
            </Form.Group>

            <Form.Row>
              <Form.Group as={Col}>
                {this.renderRequired("Room", "room")}
                <Form.Control type="text" name="room"
                  placeholder="Enter room"
                  value={this.state.post.room}
                  onChange={this.handleChange}
                />
              </Form.Group>

              <Form.Group as={Col}>
                {this.renderRequired("Building", "building")}
                <Form.Control as="select" name="building"
                  value={this.state.post.building}
                  onChange={this.handleChange}
                >
                  {this.renderBuildings()}
                </Form.Control>
              </Form.Group>
            </Form.Row>

            <Form.Group>
              {this.renderRequired("Image", "images")}
              <Form.Control type="file" multiple
                accept="image/png, image/jpeg"
                onChange={this.handleImageChange}
              />
              <Form.Text className="text-muted mt-1">
                <ul>
                 <li>Please center your photo.</li>
                 <li>Multiple photos can be uploaded.</li>
                 <li>All images will automatically be cropped to a square.</li>
                </ul>
              </Form.Text>
            </Form.Group>

            <Form.Group>
              {this.renderLabel("Description", "desc")}
              <Form.Control as="textarea" name="desc" rows="3"
                value={this.state.post.desc}
                onChange={this.handleChange}
              />
              <Form.Text className="text-muted mt-1">
                {this.state.post.desc.length}/250 characters
              </Form.Text>
            </Form.Group>

            <Form.Group>
              <Form.Label>Dietary Options</Form.Label>
              <Form.Text className="text-muted">
                Please select if any food fits a dietary option.
              </Form.Text>
              {this.renderDietOptions()}
            </Form.Group>

            <Form.Group>
              {this.renderRequired("Feeds approximately...", "feeds")}
              <Form.Text className="text-muted">
                Please enter a positive number.
              </Form.Text>
              <Form.Control type="number" name="feeds" placeholder="1"
                value={this.state.post.feeds}
                onChange={this.handleChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            {this.renderSubmitMessage()}
            <Button variant="cancel" className="mr-1"
              onClick={this.close}>
              Cancel
            </Button>
            <Button type="submit" variant="submit"
              disabled={!this.state.validForm}>
              Submit
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}
