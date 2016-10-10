import React, { PropTypes } from "react"

import styles from "./index.css"

const Content = (props) => (
  <div className={ styles.content }>
    { "ok" }
    <div>{ props.children }</div>
  </div>
)

Content.propTypes = {
  children: PropTypes.node,
}

export default Content
