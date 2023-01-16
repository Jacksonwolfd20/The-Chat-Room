import React from 'react';
import { ApolloClient, InMemoryCache, createHttpLink, ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./App.css";
import { setContext } from '@apollo/client/link/context';
import Homepage from './Pages/Homepage';

import {Chat} from './Pages/Chat'

const client = new ApolloClient({

  uri: 'http://localhost:3001/graphql',
  cache: new InMemoryCache()


});

function App() {
  return (
    <div className="App">
    <ApolloProvider client={client}>
      
        <Router>
        
          <Routes>

              <Route path="/" element={<Homepage />}  />
              <Route path="/chatroom" element={<Chat />} />

              </Routes>
              
        </Router>
        
    </ApolloProvider>
    </div>
  );
}

export default App;