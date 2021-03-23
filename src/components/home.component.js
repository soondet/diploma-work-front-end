import React, { Component } from "react";
import { DatePicker, Select, Button, List, Col, message } from "antd";
import "antd/dist/antd.css";
import moment from "moment";

import UserService from "../services/user.service";
import ScheduleService from "../services/schedule.service";
import StationService from "../services/station.service";

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
      filters: {},
      date: "",
      cityFrom: "",
      cityTo: "",
      scheduleItems: [],
    };
    this.onOkDatePicker = this.onOkDatePicker.bind(this);
    this.onChangeCityFrom = this.onChangeCityFrom.bind(this);
    this.onChangeCityTo = this.onChangeCityTo.bind(this);
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

    StationService.getStationCities().then(
      (response) => {
        this.setState({
          stationCities: response.data,
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
        date: value,
      },
    });
  }

  onChangeCityFrom(value) {
    this.setState({
      filters: { ...this.state.filters, cityFrom: value },
    });
  }

  onChangeCityTo(value) {
    this.setState({
      filters: { ...this.state.filters, cityTo: value },
    });
  }

  onSearchSchedule() {
    const { filters } = this.state;
    ScheduleService.getSchedule(filters).then(
      (response) => {
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
          <Col>
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="Select a person"
              optionFilterProp="children"
              onChange={this.onChangeCityFrom}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {this.state.stationCities.map((e, index) => (
                <Select.Option key={index} value={e}>
                  {e}
                </Select.Option>
              ))}
            </Select>
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="Select a person"
              optionFilterProp="children"
              onChange={this.onChangeCityTo}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {this.state.stationCities.map((e, index) => (
                <Select.Option key={index} value={e}>
                  {e}
                </Select.Option>
              ))}
            </Select>

            <DatePicker
              onChange={this.onChangeDatePicker}
              showTime
              // onChange={this.onChange}
              format="YYYY-MM-DDTHH:mm"
              onOk={this.onOkDatePicker}
              renderExtraFooter={() => <h5>Please press OK after choosing</h5>}
            />
            <Button type="primary" onClick={this.onSearchSchedule}>
              Click me!
            </Button>
          </Col>
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
                  {item.id}+,
                  {item.city}+,
                  {item.stationName}+,
                  {item.stateNumber}+,
                  {item.busModel}+,
                  {item.seatNumber}+,
                  {item.seatPriceStandard}+,
                  {item.seatPriceSleep}+,
                  {item.seatPriceLying}+,
                  {item.cityId}+,
                  {item.cityFrom}+,
                  {item.cityTo}+,
                  {item.date}+,
                  {item.seatCountStandard}+,
                  {item.seatCountSleep}+,
                  {item.seatCountLying}
                </List.Item>
              )}
            />
          </Col>
        </header>
      </div>
    );
  }
}
