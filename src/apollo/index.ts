import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';

import moufetteConfig from '../config'


const errorLink = onError(
   ({ graphQLErrors, networkError, operation, response }) => {
      console.log({ graphQLErrors, networkError, operation, response });
      if (graphQLErrors) {
         graphQLErrors.map(({ message: description, locations, path }) => {
            let message;
            switch (operation.operationName) {
               case 'FriendsQuery':
                  message = 'Fetch friends request faild';
                  break;
               default:
                  message = `Error`;
            }
            console.log(
               `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
            );
            // response.errors = undefined;
            console.log({
               message,
               description,
            });
         });
      } else if (networkError) {
         console.log(`[Network error]: ${networkError}`);
         // response.errors = undefined;
         return console.log({
            message: 'Network Error',
            description: networkError.message,
         });
      }
   },
);


const client = new ApolloClient({
   link: ApolloLink.from([
      errorLink,
      new HttpLink({
         uri: moufetteConfig.api_host,
         credentials: 'same-origin'
      }),
   ]),
   cache: new InMemoryCache()
}) as any; // TODO

export default client