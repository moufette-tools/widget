import React, { useState, useEffect } from 'react'
import styled from 'styled-components/macro'
import { useMutation, useQuery } from '@apollo/client';
import html2canvas from 'html2canvas';
import { Tabs, useTabState, Panel } from "@bumaga/tabs";

import { FEATURES } from '../../apollo/queries';
import { VOTE } from '../../apollo/mutations';

const Row = styled.div<any>`
   display: flex;
   ${props => props.last ? '' : 'border-bottom: 1px dashed;'}
   padding-bottom: 10px;
   border-color: #00000020;
`

const Col = styled.div`
   ${(props: any) => props.flex ? 'flex: 1;' : ''}
   display: flex;
   flex-direction: column;
`

const ArrowUp = styled.div<any>`
cursor: pointer;
width: 0;
height: 0;
border-left: 5px solid transparent;
border-right: 5px solid transparent;
border-bottom: 10px solid ${props => props.marked ? props.theme.colors.primary : 'gray'};
`

const ArrowDown = styled.div<any>`
cursor: pointer;
width: 0;
height: 0;
border-left: 5px solid transparent;
border-right: 5px solid transparent;
border-top: 10px solid ${props => props.marked ? props.theme.colors.primary : 'gray'};
`

const Title = styled.div`

`

const Description = styled.div``


const Features = () => {

   const { data: { features } = { features: [] } } = useQuery(FEATURES)
   const [vote] = useMutation(VOTE)

   const onVote = (voting: number, feature: any) => {
      vote({ variables: { voting, feature: feature._id } }).catch(console.log)
   }

   return (
      <>
         {
            features.map((f: any, i: number) => (
               <Row last={(i + 1) === features.length} key={f._id} css={`margin-bottom: 10px`}>
                  <Col flex css={`margin-right: 10px; justify-content: center;`}>
                     <Title>{f.title}</Title>
                     <Description>{f.notes}</Description>
                  </Col>
                  <Col css={`flex: 0.1; justify-content: center; align-items: center;`}>
                     <ArrowUp marked={f.myVote?.voting === 1} onClick={() => onVote(1, f)} />
                     <p css={`margin: 7px 0 7px 0`}>{f.score}</p>
                     <ArrowDown marked={f.myVote?.voting === -1} onClick={() => onVote(-1, f)} />
                  </Col>
               </Row>
            ))
         }
      </>
   )
}


export default Features