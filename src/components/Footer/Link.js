
import React, { PropTypes } from "react"

import styles from "./index.css"
import cx from "classnames"

class Link extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    href: PropTypes.string,
    onClick: PropTypes.func,
    children: PropTypes.node,
  };
  static contextTypes = {
    router: PropTypes.object,
  }
  isActive() {
    console.log(this.props.href, this.context.router.isActive(this.props.href))
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
      </li>
    )
  }
}

export default Link
