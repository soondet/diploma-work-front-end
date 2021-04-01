import React, { Component } from "react";
import "./ticket/bus.seats.scss";
import { sectionDiv } from "./ticket/bus.style.js";
import UserService from "../services/user.service";

export default class Ticket extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      css: {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gridGap: "10px",
      },
      cssDiv: {
        height: "30px",
        border: "1px solid #000",
      },
    };
  }

  componentDidMount() {
    const { scheduleTicket } = this.props.location.state;
    console.log(scheduleTicket);
    UserService.getUserBoard().then(
      (response) => {
        this.setState({
          content: response.data,
        });
      },
      (error) => {
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString(),
        });
      }
    );
  }

  render() {
    return (
      <div className="container">
        <header className="jumbotron">
          <h3>{this.state.content}</h3>
          <section style={this.state.css}>
            <div style={this.state.cssDiv}></div>
            <div style={this.state.cssDiv}></div>
            <div style={this.state.cssDiv}></div>
            <div style={this.state.cssDiv}></div>
            <div style={this.state.cssDiv}></div>
          </section>
        </header>
      </div>
    );
  }
}
