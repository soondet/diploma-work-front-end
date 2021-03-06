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
import { SearchOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import moment from "moment";
import { Link } from "react-router-dom";
import {
  YMaps,
  Map,
  Placemark,
  Polyline,
  RouteEditor,
  Clusterer,
} from "react-yandex-maps";

import { IconContext } from "react-icons";
import { FaBusAlt, FaRoute, FaTicketAlt } from "react-icons/fa";

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

    let sequenceFrom = item.addresses.find(
      (e) => e.addressId === filters.addressFrom
    );
    let sequenceTo = item.addresses.find(
      (e) => e.addressId == filters.addressTo
    );

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
    let cityId = this.state.cities.find((e) => e.cityName == value).id;
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
      }
      // () => {
      //   this.onSearchSchedule();
      // }
    );
  }

  onChangeCityTo(value) {
    let cityId = this.state.cities.find((e) => e.cityName == value).id;
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
      }
      // () => {
      //   this.onSearchSchedule();
      // }
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
        <header className="jumbotron home">
          <h3 align="center">Select and buy a bus ticket</h3>

          <div className="bg-container">
            <Row justify="center" align="middle" gutter={[16, 16]}>
              <Col span={7}>
                <Select
                  showSearch
                  style={{ width: "100%" }}
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
                <Select
                  showSearch
                  style={{ width: "100%", borderRadius: "30px" }}
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
              </Col>
              <Col span={7}>
                <Select
                  showSearch
                  style={{ width: "100%" }}
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
                <Select
                  showSearch
                  style={{ width: "100%" }}
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
              </Col>
            </Row>
            <br />
            <Row justify="center" align="middle" gutter={[16, 16]}>
              <Col span={7}>
                <DatePicker
                  style={{ width: "100%" }}
                  onChange={this.onChangeDatePicker}
                  onPanelChange={(a) => {
                    console.log(a);
                  }}
                />
              </Col>
              <Col span={7}>
                <Button
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "row-reverse",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "4px 8px 4px 2px",
                  }}
                  type="primary"
                  onClick={this.onSearchSchedule}
                  icon={<SearchOutlined />}
                >
                  Search
                </Button>
              </Col>
            </Row>
          </div>

          <Col className="schedule">
            <List
              locale={{ emptyText: "" }}
              pagination={{
                pageSize: 3,
              }}
              size="large"
              dataSource={this.state.scheduleItems}
              renderItem={(item) => (
                <List.Item>
                  <Card
                    style={{
                      width: "100%",
                      // borderRadius: "10px",
                      boxShadow: "2px 1px 5px #dadada",
                    }}
                  >
                    <Row>
                      <Col span={12}>
                        <Row>
                          {/* <Col>
                            <IconContext.Provider
                              value={{
                                // color: "blue",
                                className: "global-class-name",
                                size: "50px",
                              }}
                            >
                              <div>
                                <FaTicketAlt />
                              </div>
                            </IconContext.Provider>
                          </Col> */}
                          <Col className="schedule-ticket">
                            <p style={{ marginBottom: 3 }}>
                              <span style={{ fontWeight: "600" }}>
                                Available places:
                              </span>
                              {item.scheduleAvailableSeatNumber}
                            </p>
                            <p style={{ marginBottom: 3 }}>
                              <span style={{ fontWeight: "600" }}>
                                Exit time:
                              </span>
                              {item.scheduleDate}
                            </p>
                            <p style={{ marginBottom: 3 }}>
                              <span style={{ fontWeight: "600" }}>Price:</span>
                              {item.schedulePrice} TG.
                            </p>
                          </Col>
                        </Row>
                        <Row>
                          {/* <Col>
                            <IconContext.Provider
                              value={{
                                // color: "blue",
                                className: "global-class-name",
                                size: "50px",
                              }}
                            >
                              <div>
                                <FaBusAlt />
                              </div>
                            </IconContext.Provider>
                          </Col> */}
                          <br />
                          <Col className="schedule-ticket">
                            <p style={{ marginBottom: 3, marginTop: 10 }}>
                              <span style={{ fontWeight: "600" }}>
                                Bus model:
                              </span>
                              {item.busModelName}
                            </p>
                            <p style={{ marginBottom: 3 }}>
                              <span style={{ fontWeight: "600" }}>
                                State bus number:
                              </span>
                              {item.busStateNumber}
                            </p>
                            <p style={{ marginBottom: 3 }}>
                              <span style={{ fontWeight: "600" }}>
                                Path distance:
                              </span>
                              {item.routeDistance}
                            </p>
                          </Col>
                        </Row>
                      </Col>
                      <Col span={12}>
                        <YMaps
                          onApiAvaliable={(ymaps) => this.onApiAvaliable(ymaps)}
                        >
                          <Map
                            // onLoad={(ymaps) => this.geocode(ymaps)}
                            defaultState={{
                              center: [43.237161, 76.945626],
                              zoom: 10,
                              behaviors: ["default", "scrollZoom"],
                            }}
                            modules={[
                              "geoObject.addon.balloon",
                              "geoObject.addon.hint",
                              "geolocation",
                              "geocode",
                            ]}
                          >
                            {item.addresses.map((e, idx) => (
                              <Placemark
                                key={idx}
                                geometry={[
                                  e.addressCoordinateX,
                                  e.addressCoordinateY,
                                ]}
                                properties={{
                                  balloonContentBody: e.addressName,
                                  hintContent: e.addressName,
                                }}
                              />
                            ))}

                            <Polyline
                              geometry={item.addresses.map((e) => {
                                return [
                                  e.addressCoordinateX,
                                  e.addressCoordinateY,
                                ];
                              })}
                              options={{
                                balloonCloseButton: false,
                                strokeColor: "#000000",
                                strokeWidth: 4,
                                strokeOpacity: 1,
                              }}
                            />
                          </Map>
                        </YMaps>
                      </Col>
                    </Row>
                    <Divider />
                    {this.showSteps(item)}
                    <Link
                      to={{
                        pathname: "/ticket",
                        state: { scheduleTicket: item },
                      }}
                    >
                      <Button
                        style={{
                          width: "20%",
                          borderRadius: "5px",
                          // height: "100%",
                          // position: "absolute",
                          right: "0px",
                        }}
                        renderAs="button"
                        type="primary"
                      >
                        Buy
                      </Button>
                    </Link>
                  </Card>
                </List.Item>
              )}
            />
          </Col>

          {/* <Index /> */}
        </header>
      </div>
    );
  }
}
