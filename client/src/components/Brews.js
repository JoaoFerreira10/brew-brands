import React, { Component } from "react";
import {Box, Text, Heading, Card, Image, Button, Mask, IconButton} from 'gestalt';
import Strapi from 'strapi-sdk-javascript/build/main';
import { setCart, getCart } from "../utils";

const apiUrl = process.env.API_URL || 'http://localhost:1337';
const strapi = new Strapi(apiUrl);

class Brews extends Component {

    state = {brews: [], brand: '', cartItems: []};

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

           this.setState({
               brews: data.brand.brews, 
               brand: data.brand.name,
                cartItems: getCart() || []
            });

        } catch (err) {
            console.error(err);
        }
    }

    
    handleAddToCart = brew => {

        const { cartItems } = this.state;

        const alreadyInCart = cartItems.findIndex(item => item._id === brew._id);

        if(alreadyInCart === -1) {
            const updateCart = cartItems.concat({...brew, quantity: 1});

            this.setState({cartItems: updateCart}, () => setCart(updateCart));
        }
        else {

            const updateCart = [...cartItems];
            updateCart[alreadyInCart].quantity += 1;
            this.setState({cartItems: updateCart}, () => setCart(updateCart));
        }

    };

    handleDeleteFromCart = itemId => {

        const { cartItems } = this.state;

        const items = cartItems.filter(item => item._id !== itemId);

        this.setState({cartItems: items}, ()=> setCart(items))
    }

    render() {
        const {brand, brews, cartItems} = this.state;
        return(
            <Box marginTop={4} display="flex" justifyContent="center" alignItems="start" 
            dangerouslySetInlineStyle={{
                __style: {
                    flexWrap: 'wrap-reverse'
                }
            }}>
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
                                <Button color="blue" text="Add to cart" onClick={()=> this.handleAddToCart(brew)}></Button>
                                </Text>
                            </Box>
                        </Box>
                        ))
                    }
                    </Box>
                </Box>

                {/* Cart */}
                <Box alignSelf="end" marginTop={2} marginLeft={12}>
                    <Mask shape="rounded" wash>
                        <Box
                        display="flex"
                        direction="column"
                        alignItems="center"
                        padding={2}>
                            <Heading align="center" size="md">
                                My Cart
                            </Heading>
                            <Text color="gray" italic>{cartItems.length} items selected</Text>
                            {cartItems.map(item=>(
                                <Box key={item._id} display="flex" alignItems="center">
                                    <Text>
                                        {item.name} x {item.quantity} - {(item.quantity * item.price).toFixed(2)}€
                                    </Text>
                                    <IconButton
                                    icon="cancel"
                                    accessibilityLabel="Delete"
                                    size="sm"
                                    iconColor="red"
                                    onClick={() => this.handleDeleteFromCart(item._id)}></IconButton>
                                </Box>
                            ))}
                        </Box>
                    </Mask>
                </Box>
            </Box>
        );
    }
}

export default Brews;