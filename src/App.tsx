import React, { useState } from 'react'
import styled from 'styled-components'
import { useMutation } from '@apollo/client';

import Popover from './components/Popover'

import { FEEDBACK_MUTATION } from './apollo/mutations';

const Floating = styled.div`
  position: fixed;
  right: 10px;
  margin: 10px;
  bottom: 10px;
`;

const Input = styled.input`

`;

const Button = styled.button`

`;

const Feedback = () => {
   const [loading, setLoading] = useState(false)
   const [isOpen, setIsOpen] = useState(false)
   const [message, setMessage] = useState('')


   const [feedback] = useMutation(FEEDBACK_MUTATION);

   const sendFeedback = () => {
      setLoading(true)
      feedback({
         variables: {
            message
         },
      }).then(({ data }) => {
         // message.success('Thank you for your feedback. You Rock!', 5);
         setLoading(false)
      }).catch(e => {
         setLoading(false)
         console.log(e)
      })
   }

   return (
      <Floating>
         <Popover
            isOpen={isOpen}
            content={(
               <div style={{ padding: 10 }}>
                  <textarea value={message} onChange={e => setMessage(e.target.value)} id="w3mission" rows={5} style={{ width: '100%' }} />
                  <Button disabled={!message} onClick={sendFeedback}>
                     Send
                  </Button>
               </div>
            )}
         >
            <Button onClick={() => setIsOpen(!isOpen)}>
               Click
            </Button>
         </Popover>
      </Floating>
   )
}

export default Feedback