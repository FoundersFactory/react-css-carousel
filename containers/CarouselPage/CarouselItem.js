import React, { PropTypes } from 'react';
import styled from 'styled-components'

const Item = styled.div`
  background: darkorange;
  text-align: center;
  padding: 50px;
  color: white;
`

function CarouselItem(props) {
  return (
    <Item>Item {props.index} of {props.numSlides}</Item>
  )
}

CarouselItem.propTypes = {
  index: PropTypes.number,
  numSlides: PropTypes.number
}

export default CarouselItem