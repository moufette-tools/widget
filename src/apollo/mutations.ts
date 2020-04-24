import { gql } from 'apollo-boost';

export const FEEDBACK_MUTATION = gql`
  mutation Feedback($message: String!, $image: String) {
    feedback(message: $message, image: $image)
  }
`;
