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
} from "antd";
import "antd/dist/antd.css";
import moment from "moment";
import { Link } from "react-router-dom";

import UserService from "../services/user.service";
import ScheduleService from "../services/schedule.service";
import CityService from "../services/city.service";
import AddressService from "../services/address.service";

import Index from "./index";
const { RangePicker } = DatePicker;

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "",
      stationCities: [],
      cities: [],
      addressesFrom: [],
      addressesTo: [],
      filters: {},
      date: "",
      cityFrom: "",
      cityTo: "",
      scheduleItems: [],
    };
    this.onOkDatePicker = this.onOkDatePicker.bind(this);
    this.onChangeCityFrom = this.onChangeCityFrom.bind(this);
    this.onChangeAddressFrom = this.onChangeAddressFrom.bind(this);
    this.onChangeCityTo = this.onChangeCityTo.bind(this);
    this.onChangeAddressTo = this.onChangeAddressTo.bind(this);
    this.onSearchSchedule = this.onSearchSchedule.bind(this);
    this.onChangeDatePicker = this.onChangeDatePicker.bind(this);
    this.showSteps = this.showSteps.bind(this);
  }

  componentDidMount() {
    UserService.getPublicContent().then(
      (response) => {
        this.setState({
          content: response.data,
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

    CityService.getCities().then(
      (response) => {
        this.setState({
          cities: response.data,
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

  showSteps(item) {
    const { addressesFrom, addressesTo, filters } = this.state;

    let sequenceFrom = item.addresses.filter(
      (e) => e.addressId === filters.addressFrom
    )[0];
    let sequenceTo = item.addresses.filter(
      (e) => e.addressId == filters.addressTo
    )[0];

    let rangeSequence;
    if (sequenceFrom !== undefined && sequenceTo !== undefined) {
      sequenceFrom = sequenceFrom.sequenceNumber;
      sequenceTo = sequenceTo.sequenceNumber;
      rangeSequence = Array(sequenceTo - sequenceFrom + 1)
        .fill()
        .map((_, idx) => sequenceFrom + idx);
    }

    return sequenceFrom !== undefined && sequenceTo !== undefined ? (
      <Steps progressDot current={sequenceTo - 1} style={{ width: "100%" }}>
        {item.addresses.map((element) => {
          if (rangeSequence.includes(element.sequenceNumber)) {
            return (
              <Steps.Step
                style={{ width: 200, height: 200 }}
                title={element.addressName}
                description={element.cityName}
              />
            );
          } else {
            return (
              <Steps.Step
                status={"wait"}
                style={{ width: 200, height: 200 }}
                title={element.addressName}
                description={element.cityName}
              />
            );
          }
        })}
      </Steps>
    ) : null;
  }

  onOkDatePicker(value) {
    this.setState({
      filters: {
        ...this.state.filters,
        date: moment(value.toISOString())
          .utc(6)
          .format("YYYY-MM-DD[T]HH:mm:ss"),
      },
    });
  }
  onChangeDatePicker(value, dateString) {
    this.setState({
      filters: {
        ...this.state.filters,
        date: dateString,
      },
    });
  }

  onChangeCityFrom(value) {
    let cityId = this.state.cities.filter((e) => e.cityName == value)[0].id;
    AddressService.getAddressByCity(cityId).then((response) => {
      this.setState({
        addressesFrom: response.data.map((e) => ({
          id: e.id,
          addressName: e.addressName,
        })),
      });
    });
    this.setState({
      filters: { ...this.state.filters, cityFrom: value },
    });
  }
  onChangeAddressFrom(value) {
    this.setState(
      {
        filters: {
          ...this.state.filters,
          addressFrom: this.state.addressesFrom.filter(
            (e) => e.addressName == value
          )[0].id,
        },
      },
      () => {
        this.onSearchSchedule();
      }
    );
  }

  onChangeCityTo(value) {
    let cityId = this.state.cities.filter((e) => e.cityName == value)[0].id;
    AddressService.getAddressByCity(cityId).then((response) => {
      this.setState({
        addressesTo: response.data.map((e) => ({
          id: e.id,
          addressName: e.addressName,
        })),
      });
    });
    this.setState({
      filters: { ...this.state.filters, cityTo: value },
    });
  }
  onChangeAddressTo(value) {
    this.setState(
      {
        filters: {
          ...this.state.filters,
          addressTo: this.state.addressesTo.filter(
            (e) => e.addressName == value
          )[0].id,
        },
      },
      () => {
        this.onSearchSchedule();
      }
    );
  }

  onSearchSchedule() {
    const { filters } = this.state;
    ScheduleService.getSchedule(filters).then(
      (response) => {
        response.data.forEach((element) => {
          element.addresses.sort(function (a, b) {
            if (a.sequenceNumber > b.sequenceNumber) {
              return 1;
            }
            if (a.sequenceNumber < b.sequenceNumber) {
              return -1;
            }
            return 0;
          });
        });

        this.setState({
          scheduleItems: response.data,
        });
      },
      (error) => {
        message.error("Please fill everything");
      }
    );
  }

  render() {
    return (
      <div className="container">
        <header className="jumbotron">
          <h3>{this.state.content}</h3>

          <Row>
            <Col>
              <Row>
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="Select From City"
                  optionFilterProp="children"
                  onChange={this.onChangeCityFrom}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.state.cities.map((e, index) => (
                    <Select.Option key={e.id} value={e.cityName}>
                      {e.cityName}
                    </Select.Option>
                  ))}
                </Select>
              </Row>
              <Row>
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="Select From Address"
                  optionFilterProp="children"
                  onChange={this.onChangeAddressFrom}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.state.addressesFrom.map((e, index) => (
                    <Select.Option key={e.id} value={e.addressName}>
                      {e.addressName}
                    </Select.Option>
                  ))}
                </Select>
              </Row>
            </Col>
            <Col>
              <Row>
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="Select To City"
                  optionFilterProp="children"
                  onChange={this.onChangeCityTo}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.state.cities.map((e, index) => (
                    <Select.Option key={e.id} value={e.cityName}>
                      {e.cityName}
                    </Select.Option>
                  ))}
                </Select>
              </Row>
              <Row>
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="Select To Address"
                  optionFilterProp="children"
                  onChange={this.onChangeAddressTo}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.state.addressesTo.map((e, index) => (
                    <Select.Option key={e.id} value={e.addressName}>
                      {e.addressName}
                    </Select.Option>
                  ))}
                </Select>
              </Row>
            </Col>
            <DatePicker onChange={this.onChangeDatePicker} />
            <Button type="primary" onClick={this.onSearchSchedule}>
              Search
            </Button>
          </Row>
          <Col>
            <List
              pagination={{
                pageSize: 3,
              }}
              size="large"
              bordered
              dataSource={this.state.scheduleItems}
              renderItem={(item) => (
                <List.Item>
                  <Card style={{ width: "100%" }}>
                    <p>busModelName: {item.busModelName}</p>
                    <p>busModelSeatNumber: {item.busModelSeatNumber}</p>
                    <p>busStateNumber: {item.busStateNumber}</p>
                    <p>routeDistance: {item.routeDistance}</p>
                    <p>
                      scheduleAvailableSeatNumber:
                      {item.scheduleAvailableSeatNumber}
                    </p>
                    <p>scheduleDate: {item.scheduleDate}</p>
                    <p>schedulePrice: {item.schedulePrice}</p>
                    <p>scheduleStatus: {item.scheduleStatus}</p>
                    <p>seatNumber: {item.seatNumber}</p>

                    <Divider />
                    {this.showSteps(item)}
                    <Link
                      to={{
                        pathname: "/ticket",
                        state: { scheduleTicket: item },
                      }}
                    >
                      <Button renderAs="button" type="primary">
                        Buy
                      </Button>
                    </Link>
                  </Card>
                </List.Item>
              )}
            />
          </Col>

          <Index />
        </header>
      </div>
    );
  }
}
