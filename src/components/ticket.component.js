import React, { Component } from "react";
import "./ticket/bus.seats.scss";
import { Button } from "antd";
import UserService from "../services/user.service";
import SeatPlaceService from "../services/seatplace.service";
import BookedSeatService from "../services/bookedseat.service";
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
    };
  }
  onSeatPlaceButtonClick = (item) => {
    console.log(item);
  };

  componentDidMount() {
    const { scheduleTicket } = this.props.location.state;
    const { busX, busY, modelArray } = this.state;

    for (let index = 0; index < busX * busY; index++) {
      modelArray.push({ id: index });
    }

    SeatPlaceService.getByBusModelId(scheduleTicket.busModelId).then(
      (response) => {
        this.state.modelArray.map((e) => {
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
      },
      (error) => {
        this.setState({
          content:
            (error.response && error.response.data) ||
            error.message ||
            error.toString(),
        });
      }
    );

    BookedSeatService.getByScheduleId(scheduleTicket.scheduleId).then(
      (response) => {
        this.setState({
          bookedSeats: response.data,
        });
      },
      (error) => {
        this.setState({
          content:
            (error.response && error.response.data) ||
            error.message ||
            error.toString(),
        });
      }
    );
  }

  render() {
    const {
      busX,
      busY,
      seatPlaces,
      modelArray,
      scheduleTicket,
      bookedSeats,
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
          <h1>INFO</h1>
          <section style={styleSectionDiv}>
            {modelArray.map((e) =>
              e.seat ? (
                <button
                  disabled={bookedSeats.some((x) => x.seatNo === e.seat.seatNo)}
                  onClick={() => this.onSeatPlaceButtonClick(e)}
                >
                  {bookedSeats.some((x) => x.seatNo === e.seat.seatNo)
                    ? e.seat.seatNo + " bought"
                    : e.seat.seatNo}
                </button>
              ) : (
                <div>asdasd</div>
              )
            )}
          </section>
        </header>
      </div>
    );
  }
}
