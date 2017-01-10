
import React, { PropTypes } from "react"
import cx from "classnames"

import styles from "./index.css"

class Container extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    open: PropTypes.bool,
  }
  render() {
    const getStyles = () => {
      return cx(styles.container, this.props.open ? styles.open : styles.close)
    }
    return (
      <div className={ getStyles() }>
        { this.props.children }
      </div>
    )
  }
}

export default Container
