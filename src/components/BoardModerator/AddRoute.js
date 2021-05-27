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
  Table,
} from "antd";
import { FormInstance } from "antd/lib/form";
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from "react-sortable-hoc";
import { MenuOutlined } from "@ant-design/icons";
import arrayMove from "array-move";
import { PlusOutlined } from "@ant-design/icons";

import AuthService from "../../services/auth.service";
import ParkService from "../../services/park.service";
import AddressService from "../../services/address.service";
import BusService from "../../services/bus.service";
import RouteService from "../../services/route.service";
import SequenceService from "../../services/sequence.service";
import { Route } from "react-router";

const DragHandle = sortableHandle(() => (
  <MenuOutlined style={{ cursor: "grab", color: "#999" }} />
));

const columns = [
  {
    title: "Sort",
    dataIndex: "sort",
    width: 30,
    className: "drag-visible",
    render: () => <DragHandle />,
  },
  {
    title: "City",
    dataIndex: "cityName",
    className: "drag-visible",
  },
  {
    title: "Address",
    dataIndex: "addressName",
  },
];

const SortableItem = sortableElement((props) => <tr {...props} />);
const SortableContainer = sortableContainer((props) => <tbody {...props} />);
class AddRoute extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addresses: [],
      addressesChoosed: [],
      dataSource: [],
      routes: [],
    };
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { dataSource } = this.state;
    if (oldIndex !== newIndex) {
      const newData = arrayMove(
        [].concat(dataSource),
        oldIndex,
        newIndex
      ).filter((el) => !!el);
      console.log("Sorted items: ", newData);
      let addressesIds = newData.map((e) => e.index);
      let addresses = [];
      addressesIds.forEach((e) =>
        addresses.push(this.props.data.addresses.find((x) => e === x.id))
      );
      this.setState({ dataSource: newData, addressesChoosed: addresses });
    }
  };

  DraggableContainer = (props) => (
    <SortableContainer
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={this.onSortEnd}
      {...props}
    />
  );

  DraggableBodyRow = ({ className, style, ...restProps }) => {
    const { dataSource } = this.state;
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = dataSource.findIndex(
      (x) => x.index === restProps["data-row-key"]
    );
    return <SortableItem index={index} {...restProps} />;
  };

  onChangeCity = (value) => {
    let cityId = this.props.data.cities.find((e) => e.id == value).id;
    AddressService.getAddressByCity(cityId).then((response) => {
      this.setState({
        addresses: response.data,
      });
    });
  };

  onChangeAddresses = (value) => {
    let addresses = [];
    value.forEach((e) =>
      addresses.push(this.props.data.addresses.find((x) => e === x.id))
    );

    this.setState({
      addressesChoosed: addresses,
      dataSource: addresses.map((e) => ({
        key: `${e.id}`,
        cityName: e.city.cityName,
        addressName: e.addressName,
        index: e.id,
      })),
    });
  };

  clickAddRoute = () => {
    RouteService.createRoute().then(() => {
      this.props.getRoute();
      RouteService.getRoutes().then((response) => {
        let routes = response.data;
        let lastRoute = routes[routes.length - 1];
        let sequenceNumber = 1;
        this.state.addressesChoosed.forEach((e) => {
          SequenceService.createSequence(lastRoute, e, sequenceNumber);
          sequenceNumber++;
        });
        message.open({
          type: "success",
          duration: 2,
          content: "Route succesfully added",
        });

      });
    });
  };

  render() {
    const { dataSource, addressesChoosed } = this.state;
    return (
      <div>
        <Row gutter={[16, 16]} style={{ display: "flex", alignItems: "" }}>
          <Col span={16} style={{ borderRight: "2px solid #e9ecef" }}>
            <Table
              pagination={false}
              dataSource={dataSource}
              columns={columns}
              rowKey="index"
              components={{
                body: {
                  wrapper: this.DraggableContainer,
                  row: this.DraggableBodyRow,
                },
              }}
            />
          </Col>
          <Col span={8}>
            <Row>
              <Select
                showSearch
                style={{ width: "100%" }}
                placeholder="Select City"
                optionFilterProp="children"
                onChange={this.onChangeCity}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {this.props.data.cities.map((e, index) => (
                  <Select.Option key={e.id} value={e.id}>
                    {e.cityName}
                  </Select.Option>
                ))}
              </Select>
              <Select
                mode="multiple"
                showSearch
                style={{ width: "100%", marginBottom: "5px" }}
                placeholder="Select Addresses"
                optionFilterProp="children"
                onChange={this.onChangeAddresses}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {this.state.addresses.map((e, index) => (
                  <Select.Option key={e.id} value={e.id}>
                    {e.addressName}
                  </Select.Option>
                ))}
              </Select>
              <Button
                type="primary"
                onClick={() => this.clickAddRoute()}
                icon={<PlusOutlined />}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto",
                }}
              >
                Add
              </Button>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

export default AddRoute;
