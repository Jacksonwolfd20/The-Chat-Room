import React, {useState} from 'react';
import decode from 'jwt-decode';
import {
  Box,
  Container,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  TagLabel,
  Text,
} from "@chakra-ui/react";

import { Button, ButtonGroup } from '@chakra-ui/react'

import { Grid, GridItem } from '@chakra-ui/react'

import { ApolloClient, InMemoryCache, useMutation, useSubscription, gql} from '@apollo/client';
import { WebSocketLink } from "@apollo/client/link/ws";

import { POST_MESSAGE } from '../utils/mutations';
import { GET_MESSAGES } from '../utils/subscriptions';

const username = decode(JSON.stringify(localStorage.getItem('mykey')))





const Messages = ({user}) =>{
    const {data} = useSubscription(GET_MESSAGES)
    if(!data){
        return null;
    }
    return (
      <div style={{marginBottom:"5rem"}}>
        {data.messages.map(({id, user:messageUser, text})=>{
          return(
            <div key={id} style={{textAlign: user===messageUser?"right":"left"}}>
              <p style={{marginBottom:"0.3rem"}}>{messageUser}</p>
              <TagLabel size='md' colorScheme={user===messageUser?"orange": "facebook"} label={text}/>
            </div>
          )
        })}
      </div>
     )
}

export const Chat = () =>{
    const [user, setUser] = useState(username);
    const [text, setText] = useState("");
    const [postMessage] = useMutation(POST_MESSAGE)
    const sendMessage=()=>{
      if(text.length>0 && user.length >0){
        postMessage({
          variables:{
            user: user,
            text: text
          }
        })
        setText("");
      }else{
        alert("Missing fields!")
      }
      
    }
    
    return(
        <Box>
          <Text color="white" fontSize='6xl'>Welcome To The Chat Room</Text>
          <Messages user={user}/>
          <Grid gap={2}>
            
            <GridItem colspan={11}>
              <Input onChange={(e)=>{
                setText(e.target.value)}} value={text} size="small" fullWidth variant="outlined" required label="Required" label="Enter message here" />
            </GridItem>
            <GridItem colspan={1}>
            <Button colorScheme='blue' onClick={sendMessage} size='sm'  >Send</Button>
            </GridItem>
          </Grid>
        </Box>
    )
}
