import React, { Component } from "react";
import {Container, Box, Heading, Card, Image, Text, SearchField, Spinner} from 'gestalt';
import {Link} from 'react-router-dom';
import Strapi from 'strapi-sdk-javascript/build/main';
import "./App.css";

const apiUrl = process.env.API_URL || 'http://localhost:1337';
const strapi = new Strapi(apiUrl);

class App extends Component {


  state = { brands: [], loading: true, searchTerm: ''};

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

handleSearch = ({value })=>{
  this.setState({searchTerm: value});


}

filteredBrands = (searchTerm, brands)=>{
  return brands.filter(brand => brand.name.toLowerCase().includes(searchTerm.toLowerCase()));
}


  render() {

    const {
      brands,
      searchTerm,
      loading
    } = this.state;

    return (
    <Container>

      <Box  display="flex" justifyContent="center" marginTop={4}>
        <SearchField id="search-field" accessibilityLabel="Search field" placeholder="Search" onChange={this.handleSearch}/>
      </Box>
      <Box display="flex" justifyContent="center">
        <Heading color="midnight" size="md">
          Brew Brands
        </Heading>
      </Box>
      <Box wrap display="flex" justifyContent="around">
          {
            this.filteredBrands(searchTerm, brands).map(brand =>(
              <Box paddingY={4} margin={3} width={200} key={brand._id}> 
                <Card>
                  
                    <Box height={270} width={200} paddingY={2}>
                      <Image
                      alt="Brand"
                      naturalHeight={1}
                      naturalWidth={1}
                      src={`${apiUrl}${brand.image[0] && brand.image[0].url}`}
                      />
                    </Box>
                  
                </Card> 
                <Text bold size="xl">{brand.name}</Text>
                <Text>{brand.description}</Text>
                <Text size="lg">
                <Link to={brand._id}>See Brews</Link>
                </Text>
              </Box>
            ))
          }
      </Box>
      <Spinner show={loading} accessibilityLabel="Show Spinner"></Spinner>
    </Container>);
  }
}

export default App;
