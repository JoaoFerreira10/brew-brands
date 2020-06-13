import React, { Component } from "react";
import {Box, Text, Heading, Card, Image, Button} from 'gestalt';
import Strapi from 'strapi-sdk-javascript/build/main';

const apiUrl = process.env.API_URL || 'http://localhost:1337';
const strapi = new Strapi(apiUrl);

class Brews extends Component {

    state = {brews: [], brand: ''};

    async componentDidMount() {

        try {
            const { data } = await strapi.request("POST", "/graphql",{
                data: {query: `query {
                    brand(id: "${this.props.match.params.brandId}") {
                      _id,
                      name,
                      brews{
                        _id,
                        name,
                        description,
                        price,
                        image {
                          name,
                          url
                        }
                      }
                    }
                  }`
                }
              }
           );
console.log("FSD", data)
           this.setState({brews: data.brand.brews, brand: data.brand.name});

        } catch (err) {
            console.error(err);
        }
    }

    render() {
        const {brand, brews} = this.state;
        return(
            <Box marginTop={4} display="flex" justifyContent="center" alignItems="start">
                <Box display="flex" direction="column" alignItems="center">
                    <Box margin={2}>
                        <Heading color="orchid">{brand}</Heading>
                    </Box>
                    <Box
                    wrap
                    shape="rounded" display="flex" justifyContent="center">
          {
            brews.map(brew =>(
              <Box paddingY={4} margin={2} width={220} key={brew._id}> 
                <Card>
                  
                    <Box height={260} width={200} paddingY={2}>
                      <Image
                      alt="Brew"
                      naturalHeight={1}
                      naturalWidth={1}
                      src={`${apiUrl}${brew.image[0] && brew.image[0].url}`}
                      />
                    </Box>
                  
                </Card> 
                <Box marginBottom={2}>
                    <Text bold size="xl">{brew.name}</Text>
                </Box>
                <Text>{brew.description}</Text>
                <Text color="orchid">{brew.price}€</Text>
                <Box marginTop={2}>
                    <Text size="lg">
                    <Button color="blue" text="Add to cart"></Button>
                    </Text>
                </Box>
              </Box>
            ))
          }

                    </Box>
                </Box>
            </Box>
        );
    }
}

export default Brews;