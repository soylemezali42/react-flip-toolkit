import React, { Component, cloneElement } from 'react'
import { GestureContext, GestureContextProps } from '../Flipper'
import PropTypes from 'prop-types'
import { Swipe } from 'flip-toolkit'
import { SwipeProps } from 'flip-toolkit/dist/Swipe/types'

const configProps = PropTypes.oneOfType([
  PropTypes.shape({
    initFlip: PropTypes.func,
    cancelFlip: PropTypes.func,
    threshold: PropTypes.number
  }),
  PropTypes.bool
])

const swipePropTypes = {
  children: PropTypes.node.isRequired,
  mouseEvents: PropTypes.bool,
  onClick: PropTypes.func,
  threshold: PropTypes.number,
  right: configProps,
  left: configProps,
  top: configProps,
  bottom: configProps
}

type SwipeComponentProps = Omit<SwipeProps, 'flipId'> & {
  children: React.ReactElement
}

class SwipeComponent extends Component<SwipeComponentProps> {
  // maintain a list of flip ids that have a mousedown but not a mouseup event
  // so that once the flip has passed the inflection point, the user needs
  // to release the gesture before they can do anything else
  static propTypes = swipePropTypes

  static defaultProps = {
    onClick: () => {},
    mouseEvents: true
  }

  processProps = (props: SwipeComponentProps) => ({
    ...props,
    flipId: String(props.children.props.flipId)
  })

  componentDidUpdate(prevProps: SwipeComponentProps) {
    this.swipe.props = this.processProps(this.props)
    this.swipe.prevProps = this.processProps(prevProps)
  }

  swipe = new Swipe(this.processProps(this.props))

  render() {
    React.Children.only(this.props.children)
    return cloneElement(this.props.children, {
      gestureHandlers: this.swipe.handlers
    })
  }
}

export default function SwipeWrapper(props: SwipeComponentProps) {
  return (
    <GestureContext.Consumer>
      {({
        inProgressAnimations,
        setIsGestureInitiated
      }: GestureContextProps) => (
        <SwipeComponent
          inProgressAnimations={inProgressAnimations}
          setIsGestureInitiated={setIsGestureInitiated}
          {...props}
        />
      )}
    </GestureContext.Consumer>
  )
}

SwipeWrapper.propTypes = swipePropTypes