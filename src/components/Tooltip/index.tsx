import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'

const Message = styled.span<any>`
   visibility: ${props => props.visible ? 'visible' : 'hidden'};
   opacity: ${props => props.visible ? '1' : '0'};
   white-space: nowrap;
   padding: 10px;
   background-color: white;
   color: #000;
   text-align: center;
   border-radius: 6px;
   position: absolute;
   z-index: 1;
   top: -5px;
   right: 120%;
   transition: opacity 1s;
   top: 50%;
   transform: translateY(-50%);

   ::after {
      content: "";
      position: absolute;
      top: 50%;
      left: 100%;
      margin-top: -5px;
      border-width: 5px;
      border-style: solid;
      border-color: transparent transparent transparent white;
   }
`

const Container = styled.span`
   position: relative;
   display: inline-block;
`

function useInterval(callback: () => void, delay: number | null) {
   const savedCallback: any = useRef();

   // Remember the latest callback.
   useEffect(() => {
      savedCallback.current = callback
   }, [callback]);

   // Set up the interval.
   useEffect(() => {
      function tick() {
         savedCallback.current()
      }
      if (delay !== null) {
         let id = setInterval(tick, delay);
         return () => clearInterval(id);
      }
   }, [delay]);
}

const Tooltip = ({ children, messages, delay = 3000, interval = 1000 }: any) => {

   const [index, setIndex] = useState(-1)
   const [time, setTime] = useState(null)

   useEffect(() => {
      const t = setTimeout(() => {
         setIndex(index + 1);
         setTime(interval)
      }, delay)
      return () => clearTimeout(t)
   }, [])

   useEffect(() => {
      if (index === messages.length) {
         setTime(null)
      }
   }, [index])


   useInterval(() => {
      setIndex(index + 1);
   }, time);


   return (
      <Container>
         <Message visible={!!time}>
            {messages[index]}
         </Message>
         {children}
      </Container>
   )
}

export default Tooltip