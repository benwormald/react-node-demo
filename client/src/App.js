import React, { Component } from "react";
import axios from "axios";
import {
  Divider,
  Header,
  List,
  Input,
  Button,
  Grid,
  Segment,
} from "semantic-ui-react";

export default class App extends Component {
  state = {
    data: [],
    id: 0,
    message: null,
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null,
  };

  componentDidMount() {
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 1000);
      this.setState({ intervalIsSet: interval });
    }
  }
  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  getDataFromDb = () => {
    fetch("http://localhost:3001/api/getData")
      .then(data => data.json())
      .then(res => {
        this.setState({ data: res.data });
      });
  };

  pushDataToDB = message => {
    let currentIds = this.state.data.map(data => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    axios.post("http://localhost:3001/api/putData", {
      id: idToBeAdded,
      message: message,
    });
  };

  deleteFromDB = idTodelete => {
    let objIdToDelete = null;
    this.state.data.forEach(dat => {
      if (dat.id == idTodelete) {
        objIdToDelete = dat._id;
      }
    });

    axios.delete("http://localhost:3001/api/deleteData", {
      data: {
        id: objIdToDelete,
      },
    });
  };

  updateDB = (idToUpdate, updateToApply) => {
    let objIdToUpdate = null;
    this.state.data.forEach(d => {
      if (d.id == idToUpdate) {
        objIdToUpdate = d._id;
      }
    });

    axios.post("http://localhost:3001/api/updateData", {
      id: objIdToUpdate,
      update: { message: updateToApply },
    });
  };

  render() {
    const { data } = this.state;
    return (
      <div>
        <Divider horizontal>
          <Header as="h4">List</Header>
        </Divider>
        <Segment>
          <List>
            {data.length <= 0
              ? "No db entries yet"
              : data.map(d => {
                  return (
                    <List.Item style={{ padding: "10px" }} key={d._id}>
                      <span style={{ color: "gray" }}> id: </span> {d.id} <br />
                      <span style={{ color: "gray" }}> data: </span> {d.message}{" "}
                      <br />
                    </List.Item>
                  );
                })}
          </List>
        </Segment>
        <Divider horizontal>
          <Header as="h4">Controls</Header>
        </Divider>
        <Segment>
          <Grid columns={3} stackable textAlign="center">
            <Grid.Row verticalAlign="middle">
              <Grid.Column verticalAlign="middle">
                <Input
                  type="text"
                  onChange={e => this.setState({ message: e.target.value })}
                  placeholder="add something to database"
                />
                <Button
                  basic
                  color="green"
                  onClick={() => this.pushDataToDB(this.state.message)}
                >
                  Add
                </Button>
              </Grid.Column>
              <Grid.Column>
                <Input
                  type="text"
                  onChange={e => this.setState({ idToDelete: e.target.value })}
                  placeholder="ID to delete"
                />
                <Button
                  basic
                  color="red"
                  onClick={() => this.deleteFromDB(this.state.idToDelete)}
                >
                  Delete
                </Button>
              </Grid.Column>
              <Grid.Column>
                <Input
                  type="text"
                  placeholder="ID to update"
                  onChange={e => this.setState({ idToUpdate: e.target.value })}
                />
                <Input
                  type="text"
                  placeholder="New message"
                  onChange={e =>
                    this.setState({ updateToApply: e.target.value })
                  }
                />
                <Button
                  basic
                  color="teal"
                  onClick={() =>
                    this.updateDB(
                      this.state.idToUpdate,
                      this.state.updateToApply
                    )
                  }
                >
                  Update
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </div>
    );
  }
}
