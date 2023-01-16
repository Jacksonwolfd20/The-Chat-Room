import { Button } from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/react";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { VStack } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../../utils/mutations';
import { Link } from 'react-router-dom';

import Auth from '../../utils/auth';

const Signup = () => {
  const toast = useToast();
  const [formState, setFormState] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [addUser, { error, data }] = useMutation(ADD_USER);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log(formState);

    try {
      const { data } = await addUser({
        variables: { ...formState },
      });

      Auth.login(data.addUser.token);
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (e) {
      console.error(e);
    }
  };


  return (
    <VStack spacing="5px">
    
        <div className="card-body">
          {data ? (
            <p>
              
              <Link to="/"></Link>
            </p>
          ) : (
            <form onSubmit={handleFormSubmit}>
              <FormControl id="username" isRequired>
              <FormLabel>User Name</FormLabel>
              <Input
                className="form-input"
                placeholder="Your username"
                name="username"
                type="text"
                value={formState.name}
                onChange={handleChange}
              />
              </FormControl>
              <FormControl id="email" isRequired>
              <FormLabel>Email Address</FormLabel>
              <Input
                className="form-input"
                placeholder="Your email"
                name="email"
                type="email"
                value={formState.email}
                onChange={handleChange}
              />
              </FormControl>
              <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                className="form-input"
                placeholder="******"
                name="password"
                type="password"
                value={formState.password}
                onChange={handleChange}
              />
              </FormControl>
              <Button
                colorScheme="blue"
                width="100%"
                style={{ cursor: 'pointer' }}
                type="submit"
              >
                Submit
              </Button>
            </form>
          )}

          {error && (
            <div >
              {error.message}
            </div>
          )}
        </div>
      
  </VStack>
);
};

export default Signup;
