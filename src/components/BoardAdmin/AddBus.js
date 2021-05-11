import React, { Component } from "react";
import { Row, Col, Select, Card, Form, message, Input, Button } from "antd";
import AuthService from "../../services/auth.service";
import ParkService from "../../services/park.service";
import BusService from "../../services/bus.service";
import { FormInstance } from "antd/lib/form";

class AddBus extends Component {
  constructor(props) {
    super(props);
    this.formEdit = React.createRef();
    this.formDelete = React.createRef();

    this.state = {
      user: {},
      roleModerator: { id: 2, name: "ROLE_MODERATOR" },
      parksAdd: [],
      parksEdit: [],
      busesEdit: [],
      loaders: {
        deleteById: false,
      },
    };
  }

  changeLoader = (loader, status) => {
    this.setState((state) => {
      return {
        loaders: {
          ...state.loaders,
          [loader]: status,
        },
      };
    });
  };

  onChangeCityAdd = (value) => {
    let cityId = this.props.data.cities.find((e) => e.id == value).id;
    ParkService.getParksByCity(cityId).then((response) => {
      this.setState({
        parksAdd: response.data,
      });
    });
  };

  onChangeCityEdit = (value) => {
    let cityId = this.props.data.cities.find((e) => e.id == value).id;
    ParkService.getParksByCity(cityId).then((response) => {
      this.setState({
        parksEdit: response.data,
      });
    });
  };

  onChangeParkEdit = (value) => {
    let parkId = this.props.data.parks.find((e) => e.id == value).id;
    BusService.getBusesByPark(parkId).then((response) => {
      this.setState({
        busesEdit: response.data,
      });
    });
  };

  onChangeStateNumberEdit = (value) => {
    let bus = this.props.data.buses.find((e) => e.id == value);
    this.formEdit.current.setFieldsValue({
      busModel: bus.busModel.modelName,
      availability: bus.availability,
      seatNumber: bus.seatNumber,
    });
  };

  onFinishEditing = (values) => {
    let choosedPark = this.props.data.parks.find((e) => e.id === values.park);
    let choosedBusModel = this.props.data.busModels.find(
      (e) => e.id === values.busModel
    );
    let choosedBus = this.props.data.buses.find(
      (e) => e.id === values.stateNumber
    );

    this.changeLoader("onFinishEditing", true);
    BusService.editBus(
      choosedBus.id,
      choosedPark,
      choosedBusModel,
      choosedBus.stateNumber,
      values.availability,
      choosedBusModel.seatNumber
    ).finally(() => {
      this.changeLoader("onFinishEditing", false);
    });
  };

  onFinishAdding = (values) => {
    let choosedPark = this.props.data.parks.find((e) => e.id === values.park);
    let choosedBusModel = this.props.data.busModels.find(
      (e) => e.id === values.busModel
    );

    this.changeLoader("onFinishAdding", true);
    BusService.createBus(
      choosedPark,
      choosedBusModel,
      values.stateNumber,
      values.availability,
      choosedBusModel.seatNumber,
    ).finally(() => {
      this.changeLoader("onFinishAdding", false);
    });
  };

  onFinishDeleting = (values) => {
    this.changeLoader("deleteById", true);
    this.props.deleteBusById(values.stateNumber);

    this.formDelete.current.setFieldsValue({ stateNumber: null });

    BusService.deleteById(values.stateNumber).finally(() => {
      this.changeLoader("deleteById", false);
    });
  };

  onFinishFailedAdding = (errorInfo) => {
    message.warning("Please fill everything everything");
  };

  onFinishFailedDeleting = (errorInfo) => {
    message.warning("Please fill everything everything");
  };

  onFinishFailedEditing = (errorInfo) => {
    message.warning("Please fill everything everything");
  };

  render() {
    const { loaders } = this.state;
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
          <Col span={8}>
            <Card className={"addBus"}>
              <h5
                style={{
                  textAlign: "center",
                }}
              >
                Add Bus
              </h5>
              <Form
                {...layout}
                name="basic"
                initialValues={{ remember: true }}
                onFinish={this.onFinishAdding}
                onFinishFailed={this.onFinishFailedAdding}
                layout="vertical"
              >
                <Form.Item
                  label="City"
                  name="city"
                  rules={[{ required: true }]}
                >
                  <Select
                    showSearch
                    style={{ width: "100%" }}
                    placeholder="Select City"
                    optionFilterProp="children"
                    onChange={this.onChangeCityAdd}
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {this.props.data.cities.map((e, index) => (
                      <Select.Option key={e.id} value={e.id}>
                        {e.cityName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Park"
                  name="park"
                  rules={[{ required: true }]}
                >
                  <Select
                    showSearch
                    style={{ width: "100%" }}
                    placeholder="Select Park"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {this.state.parksAdd.map((e, index) => (
                      <Select.Option key={e.id} value={e.id}>
                        {e.parkName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Bus Model"
                  name="busModel"
                  rules={[{ required: true }]}
                >
                  <Select
                    showSearch
                    style={{ width: "100%" }}
                    placeholder="Select Bus Model"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {this.props.data.busModels.map((e, index) => (
                      <Select.Option key={e.id} value={e.id}>
                        {e.modelName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="State Number" name="stateNumber">
                  <Input placeholder="input state number" />
                </Form.Item>
                <Form.Item label="Availability" name="availability">
                  <Input placeholder="input availability" />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ display: "block", margin: "0 auto" }}
                    loading={loaders.onFinishAdding}
                  >
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
          <Col span={8}>
            <Card className={"addBus"}>
              <h5
                style={{
                  textAlign: "center",
                }}
              >
                Edit Bus
              </h5>

              <Form
                {...layout}
                name="basic"
                ref={this.formEdit}
                initialValues={{ remember: true }}
                onFinish={this.onFinishEditing}
                onFinishFailed={this.onFinishFailedEditing}
                layout="vertical"
              >
                <Form.Item
                  label="City"
                  name="city"
                  rules={[{ required: true }]}
                >
                  <Select
                    showSearch
                    style={{ width: "100%" }}
                    placeholder="Select City"
                    optionFilterProp="children"
                    onChange={this.onChangeCityEdit}
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {this.props.data.cities.map((e, index) => (
                      <Select.Option key={e.id} value={e.id}>
                        {e.cityName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Park"
                  name="park"
                  rules={[{ required: true }]}
                >
                  <Select
                    showSearch
                    style={{ width: "100%" }}
                    placeholder="Select Park"
                    optionFilterProp="children"
                    onChange={this.onChangeParkEdit}
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {this.state.parksEdit.map((e, index) => (
                      <Select.Option key={e.id} value={e.id}>
                        {e.parkName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="State Number" name="stateNumber">
                  <Select
                    showSearch
                    style={{ width: "100%" }}
                    placeholder="Select Bus State Number"
                    optionFilterProp="children"
                    onChange={this.onChangeStateNumberEdit}
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {this.state.busesEdit.map((e, index) => (
                      <Select.Option key={e.id} value={e.id}>
                        {e.stateNumber}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Bus Model"
                  name="busModel"
                  rules={[{ required: true }]}
                >
                  <Select
                    showSearch
                    style={{ width: "100%" }}
                    placeholder="Select Bus Model"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {this.props.data.busModels.map((e, index) => (
                      <Select.Option key={e.id} value={e.id}>
                        {e.modelName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item label="Availability" name="availability">
                  <Input placeholder="input availability" />
                </Form.Item>

                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ display: "block", margin: "0 auto" }}
                  loading={loaders.onFinishEditing}
                >
                  Submit
                </Button>
              </Form>
            </Card>
          </Col>

          <Col span={8}>
            <Card className={"addBus"}>
              <h5
                style={{
                  textAlign: "center",
                }}
              >
                Delete Bus
              </h5>

              <Form
                {...layout}
                name="basic"
                ref={this.formDelete}
                initialValues={{ remember: true }}
                onFinish={this.onFinishDeleting}
                onFinishFailed={this.onFinishFailedDeleting}
                layout="vertical"
              >
                <Form.Item
                  label="State Number"
                  name="stateNumber"
                  rules={[{ required: true }]}
                >
                  <Select
                    showSearch
                    style={{ width: "100%" }}
                    placeholder="Select State Number of Bus"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {this.props.data.buses.map((e, index) => (
                      <Select.Option key={e.id} value={e.id}>
                        {e.stateNumber}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loaders.deleteById}
                  style={{ display: "block", margin: "0 auto" }}
                >
                  Submit
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default AddBus;
