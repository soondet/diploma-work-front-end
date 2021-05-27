import React, { Component } from "react";
import { Button, Modal, message } from "antd";
import UserService from "../services/user.service";
import SeatPlaceService from "../services/seatplace.service";
import BookedSeatService from "../services/bookedseat.service";
import BookingService from "../services/booking.service";

import { IconContext } from "react-icons";
import { MdAirlineSeatReclineNormal } from "react-icons/md";
export default class Ticket extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      scheduleTicket: this.props.location.state.scheduleTicket,
      busX: props.location.state.scheduleTicket.busX + 1,
      busY: props.location.state.scheduleTicket.busY + 1,
      modelArray: [],
      seatPlaces: [],
      bookedSeats: [],
      modalTicketVisible: false,
      choosenSeatPlace: {},
    };
  }

  componentDidMount() {
    this.getData();
  }

  onSeatPlaceButtonClick = (item) => {
    this.setState({ choosenSeatPlace: item, modalTicketVisible: true });
  };

  modalHandleCancel = () => {
    this.setState({ modalTicketVisible: false });
  };

  modalHandleOk = () => {
    const { scheduleTicket, choosenSeatPlace } = this.state;
    if (JSON.parse(localStorage.getItem("user"))) {
      BookingService.createBookingByIds(
        scheduleTicket.scheduleId,
        JSON.parse(localStorage.getItem("user")).id,
        choosenSeatPlace.seat.seatNo
      ).then(
        (response) => {
          BookedSeatService.createBookedSeatByIds(
            scheduleTicket.scheduleId,
            choosenSeatPlace.seat.seatNo
          ).then(() => {
            this.getData();
            this.setState({ modalTicketVisible: false });
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
    } else {
      message.warning("Please Log In");
    }
  };

  getData = () => {
    const { scheduleTicket } = this.props.location.state;
    const { busX, busY } = this.state;

    let seatArray = [];
    for (let index = 0; index < busX * busY; index++) {
      seatArray.push({ id: index });
    }

    SeatPlaceService.getByBusModelId(scheduleTicket.busModelId).then(
      (response) => {
        seatArray.map((e) => {
          let seat = response.data.find(
            (x) =>
              Math.floor(e.id / busX) === x.seatCoordinateY &&
              e.id % busX === x.seatCoordinateX
          );
          if (seat) {
            e.seat = seat;
          }
        });

        this.setState({
          seatPlaces: response.data,
        });
      }
    );

    this.setState({
      modelArray: seatArray,
    });

    BookedSeatService.getByScheduleId(scheduleTicket.scheduleId).then(
      (response) => {
        this.setState({
          bookedSeats: response.data,
        });
      }
    );
  };

  render() {
    const {
      busX,
      busY,
      seatPlaces,
      modelArray,
      scheduleTicket,
      bookedSeats,
      modalTicketVisible,
    } = this.state;

    const styleSectionDiv = {
      display: "grid",
      gridTemplateColumns: `repeat(${busX}, 1fr)`,
      gridGap: "10px",
    };

    return (
      <div className="container">
        <header className="jumbotron">
          <h3>{this.state.content}</h3>
          <h3 align="center">Ticket Seats</h3>
          <div>
            <section style={styleSectionDiv} className="section-tickets">
              {modelArray.map((e) =>
                e.seat ? (
                  <button
                    className="btn btn-primary seat"
                    disabled={bookedSeats.some(
                      (x) => x.seatNo === e.seat.seatNo
                    )}
                    onClick={() => this.onSeatPlaceButtonClick(e)}
                  >
                    <IconContext.Provider
                      value={{
                        // color: "blue",
                        className: "global-class-name",
                        size: "50px",
                      }}
                    >
                      <MdAirlineSeatReclineNormal />
                    </IconContext.Provider>
                    {bookedSeats.some((x) => x.seatNo === e.seat.seatNo)
                      ? e.seat.seatNo + " bought"
                      : e.seat.seatNo}
                  </button>
                ) : (
                  <button className="btn btn-secondary" disabled></button>
                )
              )}
            </section>
          </div>
        </header>
        <Modal
          centered
          visible={modalTicketVisible}
          onOk={() => this.modalHandleOk()}
          onCancel={() => this.modalHandleCancel()}
        >
          <p>Do you really want to buy?</p>
        </Modal>
      </div>
    );
  }
}
