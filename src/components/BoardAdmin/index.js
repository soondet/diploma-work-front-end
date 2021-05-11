import React, { Component } from "react";
import { Form, Input, Button, Checkbox, Select, Tabs } from "antd";
import UserService from "../../services/user.service";
import BusService from "../../services/bus.service";
import AuthService from "../../services/auth.service";
import RoleService from "../../services/role.service";
import CityService from "../../services/city.service";
import BusModelService from "../../services/busmodel.service";
import ParkService from "../../services/park.service";

import AddModerator from "./AddModerator";
import AddBus from "./AddBus";
class BoardAdmin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      buses: [],
      users: [],
      roles: [],
      cities: [],
      busModels: [],
      parks: [],
    };
  }

  componentDidMount() {
    BusService.getBus().then((response) => {
      this.setState({
        buses: response.data,
      });
    });

    AuthService.getUsers().then((response) => {
      this.setState({
        users: response.data,
      });
    });

    RoleService.getRoles().then((response) => {
      this.setState({
        roles: response.data,
      });
    });

    CityService.getCities().then((response) => {
      this.setState({
        cities: response.data,
      });
    });

    BusModelService.getBusModels().then((response) => {
      this.setState({
        busModels: response.data,
      });
    });

    ParkService.getParks().then((response) => {
      this.setState({
        parks: response.data,
      });
    });
  }

  deleteBusById = (id) => {
    this.setState((state) => {
      return {
        buses: state.buses.filter((bus) => bus.id !== id),
      };
    });
  };

  render() {
    console.log(this.state.content);
    return (
      <div className="container">
        <header className="jumbotron">
          <h3>{this.state.content}</h3>
          <Tabs defaultActiveKey="1" centered type="card">
            <Tabs.TabPane tab="Assign/Reassign Bus" key="1">
              <AddModerator data={this.state} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Add/Edit/Delete Bus" key="2">
              <AddBus data={this.state} deleteBusById={this.deleteBusById} />
            </Tabs.TabPane>
            {/* <Tabs.TabPane tab="Tab 3" key="3">
              Content of Tab Pane 3
            </Tabs.TabPane> */}
          </Tabs>
        </header>
      </div>
    );
  }
}
export default BoardAdmin;
