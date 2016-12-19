import React, { PropTypes } from "react"

import styles from "./index.css"
import "react-toolbox/components/layout/theme.scss"

class Content extends React.Component {
  render () {
    return (
      <div className={ styles.content }>
        { this.props.children }
      </div>
    )
  }
}

Content.propTypes = {
  children: PropTypes.node,
}

export default Content
