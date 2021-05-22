import React, { Component } from "react";
import { Row, Col, Select, Card, Form, Button, message } from "antd";
import AuthService from "../../services/auth.service";

class AddModerator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      roleModerator: { id: 2, name: "ROLE_MODERATOR" },
    };
  }

  componentDidMount() {}

  onFinish = (values) => {
    const { roleModerator } = this.state;
    let usersBuses = this.props.data.users.filter((e) => e.bus);
    let choosedUser = this.props.data.users.find((e) => e.id === values.user);
    let choosedBus = this.props.data.buses.find((e) => e.id == values.bus);

    if (
      !choosedUser.roles.some((e) => e.name === roleModerator.name) &&
      !usersBuses.some((e) => e.bus.id == choosedBus.id)
    ) {
      choosedUser.roles.push(roleModerator);
      AuthService.save(
        choosedUser.id,
        choosedUser.username,
        choosedUser.email,
        choosedUser.password,
        choosedUser.roles,
        choosedBus
      );
      message.success("User have moderator role and assigned to bus");
    } else {
      message.warning("This User is Already Moderator or Bus is Selected");
    }
  };

  onFinishFailed = (errorInfo) => {
    message.warning("Please fill everything everything");
  };

  onFinishReAssign = (values) => {
    const { roleModerator } = this.state;
    let choosedUser = this.props.data.users.find((e) => e.id === values.user);
    let role = choosedUser.roles.find((e) => e.name === roleModerator.name);
    if (role) {
      choosedUser.roles.forEach((element, index) => {
        if (element.id === role.id) choosedUser.roles.splice(index, 1);
      });
      AuthService.save(
        choosedUser.id,
        choosedUser.username,
        choosedUser.email,
        choosedUser.password,
        choosedUser.roles,
        null
      );
      message.success("ReAssigned successfully");
    } else {
      message.warning("This user dont have role moderator");
    }
  };

  onFinishFailedReAssign = (errorInfo) => {
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
          <Col span={12}>
            <Card className={"addModerator"}>
              <h5
                style={{
                  textAlign: "center",
                  fontWeight: "600",
                }}
              >
                Assign Bus To User and Give him Role Moderator:
              </h5>
              <Form
                {...layout}
                name="basic"
                initialValues={{ remember: true }}
                onFinish={this.onFinish}
                onFinishFailed={this.onFinishFailed}
                layout="vertical"
              >
                <Form.Item
                  label="User"
                  name="user"
                  rules={[{ required: true }]}
                >
                  <Select
                    showSearch
                    style={{ width: "100%" }}
                    placeholder="Select User"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {this.props.data.users.map((e, index) => (
                      <Select.Option key={e.id} value={e.id}>
                        {e.username}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="Bus" name="bus" rules={[{ required: true }]}>
                  <Select
                    showSearch
                    style={{ width: "100%" }}
                    placeholder="Select Bus State Number"
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

                <Form.Item {...tailLayout}>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
          <Col span={12}>
            <Card className={"addModerator"}>
              <h5
                style={{
                  textAlign: "center",
                  fontWeight: "600",
                }}
              >
                Reassign User from bus and delete Moderator Role
              </h5>
              <Form
                {...layout}
                name="basic"
                initialValues={{ remember: true }}
                onFinish={this.onFinishReAssign}
                onFinishFailed={this.onFinishFailedReAssign}
                layout="vertical"
              >
                <Form.Item
                  label="User"
                  name="user"
                  rules={[{ required: true }]}
                >
                  <Select
                    showSearch
                    style={{ width: "100%" }}
                    placeholder="Select User"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {this.props.data.users.map((e, index) => (
                      <Select.Option key={e.id} value={e.id}>
                        {e.username}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item {...tailLayout}>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default AddModerator;
