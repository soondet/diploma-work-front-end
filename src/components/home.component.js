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
} from "antd";
import "antd/dist/antd.css";
import moment from "moment";

import UserService from "../services/user.service";
import ScheduleService from "../services/schedule.service";
import StationService from "../services/station.service";
import CityService from "../services/city.service";
import AddressService from "../services/address.service";

import Index from "./index";
const { RangePicker } = DatePicker;
// const { Option } = Select;

//moment().format("YYYY-MM-DD[T]HH:mm:ss"),
//  moment().startOf("month").utc(6).startOf("day"),
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

  onOkDatePicker(value) {
    console.log(value);
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
    this.setState({
      filters: {
        ...this.state.filters,
        addressFrom: this.state.addressesFrom.filter(
          (e) => e.addressName == value
        )[0].id,
      },
    });
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
    this.setState({
      filters: {
        ...this.state.filters,
        addressTo: this.state.addressesTo.filter(
          (e) => e.addressName == value
        )[0].id,
      },
    });
  }

  onSearchSchedule() {
    const { filters } = this.state;
    console.log(filters);
    ScheduleService.getSchedule(filters).then(
      (response) => {
        console.log(response);
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
    this.state.cities.map((e, index) => console.log(e.cityName + " " + index));
    console.log(this.state.addressesFrom);
    console.log(this.state.addressesTo);
    console.log(this.state.filters);
    console.log(this.state.scheduleItems);
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
            {/* <DatePicker
              onChange={this.onChangeDatePicker}
              showTime
              // onChange={this.onChange}
              format="YYYY-MM-DDTHH:mm"
              onOk={this.onOkDatePicker}
              renderExtraFooter={() => <h5>Please press OK after choosing</h5>}
            /> */}
            <Button type="primary" onClick={this.onSearchSchedule}>
              Search
            </Button>
          </Row>
          <Col>
            <List
              pagination={{
                onChange: (page) => {
                  console.log(page);
                },
                pageSize: 3,
              }}
              size="large"
              bordered
              dataSource={this.state.scheduleItems}
              renderItem={(item) => (
                <List.Item>
                  <Card style={{ width: 300 }}>
                    <p>{item.scheduleStatus}</p>
                    <p>{item.scheduleDate}</p>
                    <p>{item.price}</p>
                    <p>{item.routeDistance}</p>
                    <p>{item.busStateNumber}</p>
                    <p>{item.busAvailability}</p>
                    <p>{item.busAvailableSeatNumber}</p>
                    <p>{item.busModelName}</p>
                    <p>{item.busModelSeatNumber}</p>
                    <p>
                      {item.addresses.map((element) => {
                        return (
                          <div>
                            {element.addressName}, {element.sequenceNumber}
                          </div>
                        );
                      })}
                    </p>
                  </Card>
                  ,
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
