import React, { Component } from "react";
import {
  Row,
  Col,
  Select,
  Card,
  Form,
  message,
  Input,
  Button,
  List,
  Divider,
  Modal,
  Table,
  DatePicker,
} from "antd";
import { FormInstance } from "antd/lib/form";
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from "react-sortable-hoc";
import { MenuOutlined } from "@ant-design/icons";
import arrayMove from "array-move";
import moment from "moment";

import AuthService from "../../services/auth.service";
import ParkService from "../../services/park.service";
import AddressService from "../../services/address.service";
import BusService from "../../services/bus.service";
import SequenceService from "../../services/sequence.service";
import SeatPlaceService from "../../services/seatplace.service";
import ScheduleService from "../../services/schedule.service";
import BookedSeatService from "../../services/bookedseat.service";
class AddSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalAddScheduleVisible: false,
      addresses: [],
      addressesChoosedIds: [],
      dataSource: [],
      routesId: [],
      routeAddresses: [],
      seatPlaces: [],
      datePickedToAdd: [],
      choosedRoute: {},
    };
  }
  componentDidMount = () => {
    SeatPlaceService.getByBusModelId(
      JSON.parse(localStorage.getItem("user")).bus.busModel.id
    ).then((response) => {
      this.setState({
        seatPlaces: response.data,
      });
    });
  };

  onChangeAddresses = (value) => {
    let addresses = [];
    value.forEach((e) =>
      addresses.push(this.props.data.addresses.find((x) => e === x.id))
    );

    this.setState({
      addressesChoosedIds: value,
    });
  };

  onChangeCity = (value) => {
    let cityId = this.props.data.cities.find((e) => e.id == value).id;
    AddressService.getAddressByCity(cityId).then((response) => {
      this.setState({
        addresses: response.data,
      });
    });
  };

  showRoutes = () => {
    this.setState({
      routeAddresses: [],
    });
    SequenceService.getSequenceRouteIdsByAddressIds(
      this.state.addressesChoosedIds
    ).then((response) => {
      response.data.forEach((e) => {
        SequenceService.getSequenceByRouteId(e).then((response) => {
          this.setState({
            routeAddresses: [
              ...this.state.routeAddresses,
              {
                route: this.props.data.routes.find((x) => x.id == e),
                addresses: response.data,
              },
            ],
          });
        });
      });
    });
  };

  onSeatPlaceButtonClick = (item) => {
    this.setState({ choosenSeatPlace: item, modalTicketVisible: true });
  };

  modalHandleCancel = () => {
    this.setState({ modalAddScheduleVisible: false, choosedRoute: {} });
  };

  showModal = (item) => {
    this.setState({ modalAddScheduleVisible: true, choosedRoute: item.route });
  };

  onChangeDatePicker = (value, dateString) => {
    this.setState({ datePickedToAdd: dateString });
  };

  onFinishAddingSchedule = (values) => {
    ScheduleService.createSchedule(
      this.state.choosedRoute,
      JSON.parse(localStorage.getItem("user")).bus,
      true,
      this.state.datePickedToAdd,
      parseFloat(values.price),
      JSON.parse(localStorage.getItem("user")).bus.busModel.seatNumber -
        values.seats.length
    ).then(() => {
      ScheduleService.getOneSchedule(
        this.state.choosedRoute.id,
        JSON.parse(localStorage.getItem("user")).bus.id,
        moment(this.state.datePickedToAdd).format("YYYY-MM-DD")
      ).then((response) => {
        values.seats.forEach((e) => {
          BookedSeatService.createBookedSeat(response.data[0], e);
        });
      });
    });
  };

  onFinishAddingFailed = (errorInfo) => {
    message.warning("Please fill everything everything");
  };

  render() {
    const layout = {
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
    };
    const tailLayout = {
      wrapperCol: { offset: 8, span: 16 },
    };
    return (
      <div>
        <Row>
          <Select
            showSearch
            style={{ width: "100%" }}
            placeholder="Select City"
            optionFilterProp="children"
            onChange={this.onChangeCity}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {this.props.data.cities.map((e, index) => (
              <Select.Option key={e.id} value={e.id}>
                {e.cityName}
              </Select.Option>
            ))}
          </Select>
        </Row>
        <Row>
          <Select
            mode="multiple"
            showSearch
            style={{ width: "100%", marginBottom: "10px" }}
            placeholder="Select Addresses"
            optionFilterProp="children"
            onChange={this.onChangeAddresses}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {this.state.addresses.map((e, index) => (
              <Select.Option key={e.id} value={e.id}>
                {e.addressName}
              </Select.Option>
            ))}
          </Select>
        </Row>
        <Row>
          <Button
            style={{ display: "block", margin: "0 auto" }}
            type="primary"
            onClick={() => this.showRoutes()}
          >
            Show Routes
          </Button>
        </Row>
        <Row>
          <Col span={24}>
            <List
              locale={{ emptyText: "" }}
              pagination={{
                pageSize: 3,
              }}
              size="large"
              dataSource={this.state.routeAddresses}
              renderItem={(item) => (
                <List.Item>
                  <Card
                    style={{
                      width: "100%",
                      borderRadius: "10px",
                      boxShadow: "0 0 5px rgba(0,0,0,0.5)",
                    }}
                  >
                    <Row>
                      <Col className="schedule-ticket">
                        <p>
                          <span style={{ fontWeight: "650" }}>Route ID: </span>
                          {item.route.id}
                        </p>
                        <p>
                          <span style={{ fontWeight: "650" }}>Адреса: </span>
                          {item.addresses.map((e) => e.address.addressName) +
                            " "}
                        </p>
                      </Col>
                    </Row>
                    <Divider />
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
                      onClick={() => this.showModal(item)}
                    >
                      Add Schedule
                    </Button>
                  </Card>
                </List.Item>
              )}
            />
          </Col>
        </Row>

        <Modal
          centered
          visible={this.state.modalAddScheduleVisible}
          footer={null}
          onCancel={() => this.modalHandleCancel()}
        >
          <Form
            {...layout}
            name="basic"
            // ref={this.formEdit}
            initialValues={{ remember: true }}
            onFinish={this.onFinishAddingSchedule}
            onFinishFailed={this.onFinishAddingFailed}
            layout="vertical"
          >
            <Form.Item label="Seats" name="seats" rules={[{ required: true }]}>
              <Select
                mode="multiple"
                showSearch
                style={{ width: "100%" }}
                placeholder="Select Seats"
                optionFilterProp="children"
                onChange={this.onChangeCityEdit}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {this.state.seatPlaces.map((e, index) => (
                  <Select.Option key={e.id} value={e.seatNo}>
                    {e.seatNo}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Price" name="price" rules={[{ required: true }]}>
              <Input placeholder="input price" />
            </Form.Item>
            <Form.Item label="Date" name="date" rules={[{ required: true }]}>
              <DatePicker onChange={this.onChangeDatePicker} showTime />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ display: "block", margin: "0 auto" }}
            >
              Add
            </Button>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default AddSchedule;
