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

import AuthService from "../../services/auth.service";
import ParkService from "../../services/park.service";
import AddressService from "../../services/address.service";
import BusService from "../../services/bus.service";

class AddSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addresses: [],
      addressesChoosed: [],
      dataSource: [],
    };
  }

  render() {
    return (
      <div>
        <Row>
          {/* <Col className="schedule">
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
                      borderRadius: "10px",
                      boxShadow: "0 0 5px rgba(0,0,0,0.5)",
                    }}
                  >
                    <Row>
                      <Col>
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
                      </Col>
                      <Col className="schedule-ticket">
                        <p>
                          Доступные места:
                          {item.scheduleAvailableSeatNumber}
                        </p>
                        <p>Время выхода: {item.scheduleDate}</p>
                        <p>Цена: {item.schedulePrice} ТГ.</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
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
                      </Col>
                      <Col className="schedule-ticket">
                        <p>Модель автобуса: {item.busModelName}</p>
                        <p>Гос. номер автобуса: {item.busStateNumber}</p>
                        <p>Растояние пути: {item.routeDistance}</p>
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
          </Col> */}
        </Row>
      </div>
    );
  }
}

export default AddSchedule;
