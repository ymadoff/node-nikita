
import React, { PropTypes } from "react"

import styles from "./index.css"
import cx from "classnames"

class Link extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    href: PropTypes.string,
    onClick: PropTypes.func,
    children: PropTypes.node,
    description: PropTypes.string,
  };
  static contextTypes = {
    router: PropTypes.object,
  }
  isActive() {
    return cx(
      styles.link,
      this.context.router.isActive(this.props.href) && styles.active
    )
  }
  render() {
    return (
      <li
        className={ this.isActive() }
        key={ this.props.title }
      >
        <a
          href={ this.props.href }
          onClick={ this.props.onClick }
        >
          { this.props.children }
        </a>
        <br />
        { this.props.description }
      </li>
    )
  }
}

export default Link
