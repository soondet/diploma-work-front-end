import React, { Component } from "react";
import {
  DatePicker,
  Select,
  Button,
  List,
  Col,
  message,
  Row,
  Card,
  Steps,
  Divider,
  Descriptions,
} from "antd";
import { Link } from "react-router-dom";

import UserService from "../services/user.service";
import BookingService from "../services/booking.service";
export default class BoardUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      booking: [],
    };
  }

  componentDidMount() {
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
    BookingService.getByUserId(
      JSON.parse(localStorage.getItem("user")).id
    ).then((response) => {
      this.setState({
        booking: response.data,
      });
    });
  }

  render() {
    const { booking } = this.state;
    return (
      <div className="container">
        <header className="jumbotron">
          <h3 align="center">My Tickets</h3>
          <Col>
            <List
              pagination={{
                pageSize: 3,
              }}
              size="large"
              dataSource={this.state.booking}
              renderItem={(item) => (
                <List.Item>
                  <Card
                    style={{
                      width: "100%",
                      borderRadius: "10px",
                      boxShadow: "0 0 5px rgba(0,0,0,0.5)",
                    }}
                  >
                    <Descriptions
                      title={"Ticket №" + item.id}
                      bordered
                      layout="vertical"
                      // column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
                    >
                      <Descriptions.Item label="Booking Time">
                        {item.bookingTime}
                      </Descriptions.Item>
                      <Descriptions.Item label="Leaving Time">
                        {item.schedule.date}
                      </Descriptions.Item>
                      <Descriptions.Item label="Bus Model">
                        {item.schedule.bus.busModel.modelName}
                      </Descriptions.Item>
                      <Descriptions.Item label="Bus State Number">
                        {item.schedule.bus.stateNumber}
                      </Descriptions.Item>
                      <Descriptions.Item label="Route Distance">
                        {item.schedule.route.distance}
                      </Descriptions.Item>
                      <Descriptions.Item label="Price">
                        {item.schedule.price}
                      </Descriptions.Item>
                    </Descriptions>
                    {/* <p>bookingTime: {item.bookingTime}</p> */}
                    {/* <p>busModelSeatNumber: {item.busModelSeatNumber}</p>
                  <p>busStateNumber: {item.busStateNumber}</p>
                  <p>routeDistance: {item.routeDistance}</p>
                  <p>
                    scheduleAvailableSeatNumber:
                    {item.scheduleAvailableSeatNumber}
                  </p>
                  <p>scheduleDate: {item.scheduleDate}</p>
                  <p>schedulePrice: {item.schedulePrice}</p>
                  <p>scheduleStatus: {item.scheduleStatus}</p>
                  <p>seatNumber: {item.seatNumber}</p> */}

                    <Divider />
                    <Link
                      to={{
                        pathname: "/bookinginfo",
                        state: { booking: item },
                      }}
                    >
                      <Button renderAs="button" type="primary">
                        See More Details
                      </Button>
                    </Link>
                  </Card>
                </List.Item>
              )}
            />
          </Col>
        </header>
      </div>
    );
  }
}
