import React, { Component } from "react";
import "./ticket/bus.seats.scss";
import { Button, Modal, message, Card } from "antd";

import PdfService, { API_URL } from "../services/pdf.service";
export default class BookingInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      bookingInfo: this.props.location.state.booking,
      user: JSON.parse(localStorage.getItem("user")),
    };
  }

  getData = () => {};

  componentDidMount() {
    this.getData();
  }

  sendPdf = () => {
    const { bookingInfo, user } = this.state;
    PdfService.send(bookingInfo.id, user.email).then((response) => {
      message.success(`Ticket Successfully sended to ${user.email}`);
    });
  };

  // downloadPdf = () => {
  //   const { bookingInfo } = this.state;
  //   // PdfService.download(bookingInfo.id);

  //   const response = {
  //     file: API_URL + `download?id=${bookingInfo.id}`,
  //   };
  //   // server sent the url to the file!
  //   // now, let's download:
  //   window.open(response.file);
  // };

  render() {
    const { bookingInfo } = this.state;
    return (
      <div className="container">
        <header className="jumbotron">
          <Card
            style={{
              width: "100%",
              borderRadius: "10px",
              boxShadow: "0 0 5px rgba(0,0,0,0.5)",
            }}
          >
            <h3>{this.state.content}</h3>
            <h3 align="center">Detailed Booked Ticket Info:</h3>
            <h4 align="center">Booking Info:</h4>
            <span style={{ fontWeight: "650" }}>Ticket №: </span>
            {bookingInfo.id}
            <br></br>
            <span style={{ fontWeight: "650" }}>Booking Time: </span>
            {bookingInfo.bookingTime}
            <br></br>
            <span style={{ fontWeight: "650" }}>Seat No: </span>
            {bookingInfo.seatNo}
            <br></br>
            <h4 align="center">Schedule Info:</h4>
            <span style={{ fontWeight: "650" }}>Leaving Date: </span>
            {bookingInfo.schedule.date}
            <br></br>
            <span style={{ fontWeight: "650" }}>Price: </span>
            {bookingInfo.schedule.price}
            <br></br>
            <h4 align="center">Bus Info:</h4>
            <span style={{ fontWeight: "650" }}>Availability: </span>
            {bookingInfo.schedule.bus.availability}
            <br></br>
            <span style={{ fontWeight: "650" }}>State Number: </span>
            {bookingInfo.schedule.bus.stateNumber}
            <h4 align="center">Bus Model Info:</h4>
            <span style={{ fontWeight: "650" }}> Model Name: </span>
            {bookingInfo.schedule.bus.busModel.modelName}
            <br></br>
            <span style={{ fontWeight: "650" }}>Seat Number: </span>
            {bookingInfo.schedule.bus.busModel.seatNumber}
            <br></br>
            <Button
              type="primary"
              onClick={this.sendPdf}
              style={{
                width: "20%",
                margin: "5px",

                borderRadius: "5px",
                // height: "100%",
                // position: "absolute",
                right: "0px",
              }}
            >
              Send to My Email
            </Button>
            <Button
              style={{
                width: "20%",
                borderRadius: "5px",
                margin: "5px",
                // height: "100%",
                // position: "absolute",
                right: "0px",
              }}
              type="primary"
              // onClick={this.downloadPdf}
            >
              <a
                href={API_URL + `download?id=${bookingInfo.id}`}
                download="proposed_file_name"
              >
                Click to download
              </a>
            </Button>
          </Card>
        </header>
      </div>
    );
  }
}
