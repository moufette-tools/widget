import { gql } from 'apollo-boost';

export const FEEDBACK_MUTATION = gql`
  mutation Feedback($message: String!, $image: String, $email: String) {
    feedback(message: $message, image: $image, email: $email)
  }
`;


export const VOTE = gql`
  mutation Vote($voting: Int!, $feature: String!) {
    vote(voting: $voting, feature: $feature) {
      _id
      title
      notes
      score
      myVote
    }
  }
`;
