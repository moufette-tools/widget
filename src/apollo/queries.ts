
import { gql } from 'apollo-boost';

export const WIDGET = gql`
  query Widget {
    widget
  }
`;


export const FEATURES = gql`
  query Features {
    features {
      _id
      title
      notes
      score
      myVote
    }
  }
`;
