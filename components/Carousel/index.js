import React, { PropTypes, Component, Children, cloneElement } from 'react';
import styled from 'styled-components'
import Swipeable from 'react-swipeable'
import { throttle } from 'lodash'

import CarouselContainer from './CarouselContainer'
import Wrapper from './Wrapper'
import CarouselSlot from './CarouselSlot'
import Indicator from './Indicator'

const TitleSection = styled.div`
  margin: 20px;
`

class Carousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      position: 0,
      direction: props.children.length === 2 ? 'prev' : 'next',
      sliding: false
    }
  }

  getOrder(itemIndex) {
    const { position } = this.state
    const { children } = this.props
    const numItems = children.length

    if (numItems === 2) return itemIndex

    if (itemIndex - position < 0) return numItems - Math.abs(itemIndex - position)
    return itemIndex - position
  }

  doSliding = (direction, position) => {
    this.setState({
      sliding: true,
      direction,
      position
    })

    setTimeout(() => {
      this.setState({
        sliding: false
      })
    }, 50)
  }

  nextSlide = () => {
    const { position } = this.state
    const { children } = this.props
    const numItems = children.length

    if (numItems === 2 && position === 1) return

    this.doSliding('next', position === numItems - 1 ? 0 : position + 1)
  }

  prevSlide = () => {
    const { position } = this.state
    const { children } = this.props
    const numItems = children.length

    if (numItems === 2 && position === 0) return

    this.doSliding('prev', position === 0 ? numItems - 1 : position - 1)
  }

  handleSwipe = throttle((isNext) => {
    const { children } = this.props
    const numItems = children.length || 1

    if (isNext && numItems > 1) {
      this.nextSlide()
    } else if (numItems > 1) {
      this.prevSlide()
    }
  }, 500, { trailing: false })

  render() {
    const { title, children } = this.props
    const { sliding, direction, position } = this.state

    const childrenWithProps = Children.map(children,
      (child) => cloneElement(child, {
        numSlides: children.length || 1
      })
    )

    return (
      <div>
        <TitleSection>
          <h2>{ title }</h2>
          { childrenWithProps.length > 1 &&
            (<Indicator
              length={ childrenWithProps.length }
              position={ position }
            />)
          }
        </TitleSection>

        <Swipeable
          onSwipingLeft={ () => this.handleSwipe(true) }
          onSwipingRight={ () => this.handleSwipe() }
        >
          <Wrapper>
            <CarouselContainer
              sliding={ sliding }
              direction={ direction }
              numSlides={ childrenWithProps.length }
            >
              { childrenWithProps.map((child, index) => (
                <CarouselSlot
                  key={ index }
                  order={ this.getOrder(index) }
                  numSlides={ childrenWithProps.length }
                  position={ position }
                >
                  {child}
                </CarouselSlot>
              )) }
            </CarouselContainer>
          </Wrapper>
        </Swipeable>
      </div>
    )
  }
}

Carousel.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node
};

export default Carousel;
