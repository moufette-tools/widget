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
   width: 48px;
   height: 48px;
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
   width = "22px",
   className = "",
   viewBox = "0 -2 20 20"
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
         <path fill={fill} stroke="white" stroke-width="0.7" d="M17.657,2.982H2.342c-0.234,0-0.425,0.191-0.425,0.426v10.21c0,0.234,0.191,0.426,0.425,0.426h3.404v2.553c0,0.397,0.48,0.547,0.725,0.302l2.889-2.854h8.298c0.234,0,0.426-0.191,0.426-0.426V3.408C18.083,3.174,17.892,2.982,17.657,2.982M17.232,13.192H9.185c-0.113,0-0.219,0.045-0.3,0.124l-2.289,2.262v-1.96c0-0.233-0.191-0.426-0.425-0.426H2.767V3.833h14.465V13.192z M10,7.237c-0.821,0-1.489,0.668-1.489,1.489c0,0.821,0.668,1.489,1.489,1.489c0.821,0,1.488-0.668,1.488-1.489C11.488,7.905,10.821,7.237,10,7.237 M10,9.364c-0.352,0-0.638-0.288-0.638-0.638c0-0.351,0.287-0.638,0.638-0.638c0.351,0,0.638,0.287,0.638,0.638C10.638,9.077,10.351,9.364,10,9.364 M14.254,7.237c-0.821,0-1.489,0.668-1.489,1.489c0,0.821,0.668,1.489,1.489,1.489s1.489-0.668,1.489-1.489C15.743,7.905,15.075,7.237,14.254,7.237 M14.254,9.364c-0.351,0-0.638-0.288-0.638-0.638c0-0.351,0.287-0.638,0.638-0.638c0.352,0,0.639,0.287,0.639,0.638C14.893,9.077,14.605,9.364,14.254,9.364 M5.746,7.237c-0.821,0-1.489,0.668-1.489,1.489c0,0.821,0.668,1.489,1.489,1.489c0.821,0,1.489-0.668,1.489-1.489C7.234,7.905,6.566,7.237,5.746,7.237 M5.746,9.364c-0.351,0-0.638-0.288-0.638-0.638c0-0.351,0.287-0.638,0.638-0.638c0.351,0,0.638,0.287,0.638,0.638C6.384,9.077,6.096,9.364,5.746,9.364"></path>
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
                     <img style={{ maxHeight: 150, maxWidth: '100%',width: 'auto' }} src={image || ''} />
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