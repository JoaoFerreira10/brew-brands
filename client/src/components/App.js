import React, { Component } from "react";
import {Container, Box, Heading, Card, Image, Text, Spinner} from 'gestalt';
import {Link} from 'react-router-dom';
import "./App.css";
import Strapi from 'strapi-sdk-javascript/build/main';

const apiUrl = process.env.API_URL || 'http://localhost:1337';
const strapi = new Strapi(apiUrl);

class App extends Component {


  state = { brands: [], loading: true};

async componentDidMount(){

  try {
    const {data} = await strapi.request("POST", "/graphql",{
                    data: {query: `query {
                      brands{
                        _id,
                        name,
                        description,
                        image {
                          url
                        }
                      }
                    }`
                    }
                  }
               );

    console.log(data);
    
    this.setState({brands: data.brands, loading: false });

  } catch (error) {
    console.error(error);
    this.setState({loading: false});
  }

}

  render() {
    return (<Container>
      <Box display="flex" justifyContent="center">
        <Heading color="midnight" size="md">
          Brew Brands
        </Heading>
      </Box>
      <Box wrap display="flex" justifyContent="around">
          {
            this.state.brands.map(brand =>(
              <Box paddingY={4} margin={2} width={200} key={brand._id}> 
                <Card>
                  
                    <Box height={200} width={200} paddingY={1}>
                      <Image
                      alt="Brand"
                      naturalHeight={1}
                      naturalWidth={1}
                      src={`${apiUrl}${brand.image[0] && brand.image[0].url}`}
                      />
                    </Box>
                  
                </Card> 
                <Text size="xl">{brand.name}</Text>
                <Text>{brand.description}</Text>
                <Link to={brand._id}>More info</Link>
              </Box>
            ))
          }
      </Box>
      <Spinner show={this.state.loading} accessibilityLabel="Show Spinner"></Spinner>
    </Container>);
  }
}

export default App;
