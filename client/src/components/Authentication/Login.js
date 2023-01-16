import { Button } from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/react";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { VStack } from "@chakra-ui/react";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../../utils/mutations';
import { Link } from 'react-router-dom';

import Auth from '../../utils/auth';




  const Login = (props) => {
    const toast = useToast();
    const [formState, setFormState] = useState({ email: '', password: '' });
    const [login, { error, data }] = useMutation(LOGIN_USER);

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
        const { data } = await login({
          variables: { ...formState },
        });
  
        Auth.login(data.login.token);
        toast({
          title: "Login Successful",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        
      } catch (e) {
       
        console.error(e);
      }
  


      setFormState({
        email: '',
        password: '',
      });
    };
  

  return (
    <VStack spacing="10px">
    

          
          <div className="card-body">
            {data ? (
              
              <p >
                
                <Link to="/"></Link>
              </p>
            ) : (
              <form onSubmit={handleFormSubmit}>

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
        <InputGroup size="md">
          <Input
            className="form-input"
            placeholder="******"
            name="password"
            type="password"
            value={formState.password}
            onChange={handleChange}
          />
          <InputRightElement width="72px">
            
          </InputRightElement>
        </InputGroup>
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
              <div className="my-3 p-3 bg-danger text-white">
                {error.message}
              </div>
            )}
          </div>

      </VStack>
  );
};

export default Login;
