import React from "react";
import { Container, Box, Heading, TextField, Button, Text } from "gestalt";
import Strapi from 'strapi-sdk-javascript/build/main';
import { setToken } from "../utils";

const apiUrl = process.env.API_URL || 'http://localhost:1337';
const strapi = new Strapi(apiUrl);
class Signin extends React.Component {

  state = {
    username: "",
    password: "",
    loading: false,
    error: null
  };


  handleChange = ({event, value}) => {
    event.persist();
    this.setState({[event.target.name]: value})
  }

  handleSubmit = async event => {
    event.preventDefault();
    const {username, password, history} = this.state;

      try {
        this.setState({loading: true});
        const response = await strapi.login(username, password);
        setToken(response.jwt);
        this.setState({loading: false, error: null});

        this.props.history.push('/');
      }
      catch (err) {
        this.setState({loading: false, error: err});
      }
}

  render() {
    return (
      <Container>
        <Box margin={4} padding={4} shape="rounded" display="flex" justifyContent="center">    
          <form style={{display: 'inlineBlock', textAlign: 'center'}} onSubmit={this.handleSubmit}>
            <Box
            marginBottom={12}
            display="flex"
            direction="column"
            alignItems="center">
              <Heading color="midnight">Sign In</Heading>
              </Box>
              <TextField
              id="username"
              type="text"
              name="username"
              placeholder="Username"
              onChange={this.handleChange}
              ></TextField>
              <TextField
              id="password"
              type="password"
              name="password"
              placeholder="Password"
              onChange={this.handleChange}
              ></TextField>
            <Button color="blue" disabled={this.state.loading} text="Submit" type="submit"></Button>
          </form>
        </Box>
        <Box>

          {this.state.error && <Text display="flex" color="red" align="center">Login error</Text>}

        </Box>
      </Container>
    );
  }
}

export default Signin;
