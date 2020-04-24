import React, { useState } from 'react'
import styled from 'styled-components/macro'
import { useMutation } from '@apollo/client';
import html2canvas from 'html2canvas';

import { CSSProp } from 'styled-components';

import Popover from './components/Popover'

import { FEEDBACK_MUTATION } from './apollo/mutations';

declare module 'react' {
   interface Attributes {
      css?: CSSProp;
   }
}



const Label = styled.label`
   margin: 10px 0;
`

const Floating = styled.div`
  position: fixed;
  right: 10px;
  margin: 10px;
  bottom: 10px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
`;

const Textarea = styled.textarea`
   display: block;
   flex: 1;
   margin-bottom: 15px;
   border-radius: 2px;
   outline: none;
   border-color: #d9d9d9;
   font-size: 16px;
`;

const Button = styled.button`
   width: 38px;
   height: 38px;
   border-radius: 50%;
   background-color: #1890ff;
   border-color: #1890ff;
   outline: none;
   cursor: pointer;

   :active {
      background-color: #096dd9;
   }
`;

const SendButton = styled.button`
   line-height: 1.5715;
   position: relative;
   display: inline-block;
   font-weight: 400;
   white-space: nowrap;
   text-align: center;
   background-image: none;
   border: 1px solid transparent;
   -webkit-box-shadow: 0 2px 0 rgba(0,0,0,.015);
   box-shadow: 0 2px 0 rgba(0,0,0,.015);
   cursor: pointer;
   -webkit-transition: all .3s cubic-bezier(.645,.045,.355,1);
   transition: all .3s cubic-bezier(.645,.045,.355,1);
   -webkit-user-select: none;
   -moz-user-select: none;
   -ms-user-select: none;
   user-select: none;
   -ms-touch-action: manipulation;
   touch-action: manipulation;
   height: 32px;
   padding: 4px 15px;
   font-size: 14px;
   border-radius: 2px;
   color: rgba(0,0,0,.65);
   background-color: #fff;
   border-color: #d9d9d9;

   color: #fff;
   background-color: #1890ff;
   border-color: #1890ff;
   text-shadow: 0 -1px 0 rgba(0,0,0,.12);
   -webkit-box-shadow: 0 2px 0 rgba(0,0,0,.045);
   box-shadow: 0 2px 0 rgba(0,0,0,.045);

   
   :disabled {
      color: rgba(0,0,0,.25);
      background-color: #f5f5f5;
      border-color: #d9d9d9;
      text-shadow: none;
      -webkit-box-shadow: none;
      box-shadow: none;
      cursor: not-allowed;
   }
`

const SVG = ({
   style = {},
   fill = "#fff",
   width = "18px",
   className = "",
   viewBox = "0 0 32 32"
}) => (
      <svg
         width={width}
         style={style}
         height={width}
         viewBox={viewBox}
         xmlns="http://www.w3.org/2000/svg"
         className={`svg-icon ${className || ""}`}
         xmlnsXlink="http://www.w3.org/1999/xlink"
      >
         <path
            fill={fill}
            d="M 2.56635 12.9241C 0.708307 9.55549 0 6.83983 0 5.00558C 0 3.17134 0.450658 2.64526 0.907953 2.22025C 1.36525 1.79524 3.42732 0.523908 3.77867 0.286808C 4.13002 0.0497085 5.47099 -0.41107 6.31193 0.798636C 7.15287 2.00834 8.73646 4.43718 9.82825 6.05069C 11.5415 8.33611 10.1766 9.33937 9.73572 9.94069C 8.92447 11.0472 8.45734 11.3201 8.45734 12.6788C 8.45734 14.0375 12.2545 17.8976 13.1625 18.8487C 14.0635 19.7926 17.8471 23.1094 19.0195 23.2868C 20.2002 23.4654 21.7807 22.2154 22.1168 21.8985C 23.8263 20.586 24.7912 21.581 25.5787 22.0136C 26.3661 22.4461 29.9239 24.663 31.0264 25.4103C 32.0641 26.1576 31.9992 27.3125 31.9992 27.3125C 31.9992 27.3125 29.859 30.7092 29.5996 31.1168C 29.2753 31.5924 28.4971 32 26.746 32C 24.995 32 23.1241 31.6802 18.6777 29.2349C 15.0396 27.234 11.5714 24.1009 9.75551 22.2666C 7.87475 20.4324 4.68876 16.772 2.56635 12.9241Z"
         />
      </svg>
   );


const Feedback = () => {
   const [loading, setLoading] = useState(false)
   const [submitted, setSubmitted] = useState(false)
   const [isOpen, setIsOpen] = useState(false)
   const [message, setMessage] = useState('')
   const [image, setImage] = useState(null)
   const [screenshot, setScreenshot] = useState(true)


   const [feedback] = useMutation(FEEDBACK_MUTATION);

   const sendFeedback = () => {
      setLoading(true)
      feedback({
         variables: {
            message,
            image
         },
      }).then(({ data }) => {
         // message.success('Thank you for your feedback. You Rock!', 5);
         setLoading(false)
         setSubmitted(true)
         setImage(null)
         setMessage('')
      }).catch(e => {
         setLoading(false)
         console.log(e)
      })
   }

   const captureScreen = () => {
      html2canvas(document.querySelector("html") as any).then((canvas: any) => {
         const image = canvas.toDataURL("image/png");
         setImage(image)
      });
   }


   let content = null

   if (loading) {
      content = (<div style={{ height: 300 }}>loading</div>)
   } else {
      if (submitted) {
         content = <div style={{ height: 300 }}>Thank you!</div>
      } else {
         content = (
            <div style={{ padding: 15, display: 'flex', flexDirection: 'column' }}>
               {
                  image &&
                  <div style={{ border: '1px dashed', textAlign: 'center', backgroundColor: '#00000010' }} >
                     <img style={{ maxHeight: 150, width: 'auto' }} src={image || ''} />
                  </div>
               }
               <Label>
                  <input
                     style={{ marginRight: 5 }}
                     name="screenshot"
                     type="checkbox"
                     checked={screenshot}
                     onChange={() => {
                        setScreenshot(!screenshot)
                        if (!screenshot) {
                           captureScreen()
                        } else {
                           setImage(null)
                        }
                     }}
                  />
                     Include screenshot
                  </Label>
               <Textarea
                  autoFocus
                  // autofocusHtml="true"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={10}
               />
               <div css={`display: flex; justify-content: flex-end`}>
                  <SendButton disabled={!message} onClick={sendFeedback}>
                     Send
               </SendButton>
               </div>
            </div>
         )
      }
   }

   return (
      <Floating>
         <Popover
            isOpen={isOpen}
            content={content}
         >
            <Button onClick={() => {
               setIsOpen(!isOpen)
               captureScreen()
            }}>
               <SVG />
            </Button>
         </Popover >
      </Floating >
   )
}

export default Feedback