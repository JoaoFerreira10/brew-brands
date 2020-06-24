import React from "react";
import { Container, Box, Heading, TextField, Button } from "gestalt";
import Strapi from 'strapi-sdk-javascript/build/main';
import { setToken } from "../utils";

const apiUrl = process.env.API_URL || 'http://localhost:1337';
const strapi = new Strapi(apiUrl);
class Signup extends React.Component {

  state = {
    username: "",
    email : "",
    password: "",
    loading: false
  };


  handleChange = ({event, value}) => {
    console.log("Signup -> handleChange -> value", value, event.target.name)
    event.persist();
    this.setState({[event.target.name]: value})
  }

  handleSubmit = async event => {
    event.preventDefault();
    const {username, email, password, history} = this.state;

      try {
        this.setState({loading: true});
        const response = await strapi.register(username, email, password);
        console.log("response", response)
        setToken(response.jwt);
        this.setState({loading: false});

        this.props.history.push('/');
      }
      catch (err) {
        this.setState({loading: false});
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
              <Heading color="midnight">Sign Up</Heading>
              </Box>
              <TextField
              id="username"
              type="text"
              name="username"
              placeholder="Username"
              onChange={this.handleChange}
              ></TextField>
              <TextField
              id="mail"
              type="email"
              name="email"
              placeholder="Email"
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
      </Container>
    );
  }
}

export default Signup;
