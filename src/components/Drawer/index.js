
import React, { PropTypes } from "react"
import enhanceCollection from "phenomic/lib/enhance-collection"
import Link from "./Link"
import cx from "classnames"

import styles from "./index.css"

class Drawer extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    to: PropTypes.string.isRequired,
    open: PropTypes.bool,
    className: PropTypes.string,
    activeClassName: PropTypes.string,
  };
  static contextTypes = {
    metadata: PropTypes.object.isRequired,
    collection: PropTypes.array,
    router: PropTypes.object,
  }
  render() {
    const { router, collection } = this.context
    const about = enhanceCollection(collection, {
      filter: { layout: "Page", __url: /^\/about\/.*/ },
      sort: "sort",
    })
    const usages = enhanceCollection(collection, {
      filter: { layout: "Page", __url: /^\/usages\/.*/ },
      sort: "sort",
    })
    const options = enhanceCollection(collection, {
      filter: { layout: "Page", __url: /^\/options\/.*/ },
    })
    const getStyles = () => {
      return cx(
        "nano", styles.drawer, this.props.open ? styles.open : styles.close
      )
    }
    return (
      <div className={ getStyles() }>
        <div className={ "nano-content" }>
          <nav>
            <p className={ styles.section }>{ "About Nikita" }</p>
            <ul>
            {
              about.map((page) => {
                const handleToggle = (event) => {
                  event.preventDefault()
                  router.push(page.__url)
                }
                return (
                  <Link
                    key={ page.title }
                    className={ styles.link }
                    href={ page.__url }
                    onClick={ handleToggle }
                  >
                    { page.title }
                  </Link>
                )
              })
            }
            </ul>
          </nav>
          <nav>
            <p className={ styles.section }>{ "Usages" }</p>
            <ul>
            {
              usages.map((page) => {
                const handleToggle = (event) => {
                  event.preventDefault()
                  router.push(page.__url)
                }
                return (
                  <Link
                    key={ page.title }
                    className={ styles.link }
                    href={ page.__url }
                    onClick={ handleToggle }
                  >
                    { page.title }
                  </Link>
                )
              })
            }
            </ul>
          </nav>
          <nav>
            <p className={ styles.section }>{ "Global Options" }</p>
            <ul>
            {
              options.map((page) => {
                const handleToggle = (event) => {
                  event.preventDefault()
                  router.push(page.__url)
                }
                return (
                  <Link
                    key={ page.title }
                    className={ styles.link }
                    href={ page.__url }
                    onClick={ handleToggle }
                  >
                    { page.title }
                  </Link>
                )
              })
            }
            </ul>
          </nav>
        </div>
      </div>
    )
  }
}

export default Drawer
