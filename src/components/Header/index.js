import React, { PropTypes } from "react"
import { Link } from "react-router"

import enhanceCollection from "phenomic/lib/enhance-collection"
import styles from "./index.css"
import Svg from "react-svg-inline"
import twitterSvg from "../icons/iconmonstr-twitter-1.svg"
import gitHubSvg from "../icons/iconmonstr-github-1.svg"

const Header = (props, { metadata: { pkg }, collection }) => {
  const pages = enhanceCollection(collection, {
    filter: { layout: "Page" },
  })
  return (
    <header className={ styles.header }>
      <nav className={ styles.nav }>
        <div className={ styles.navPart1 }>
          <Link
            className={ styles.link }
            to="/"
          >
            { "Home" }
          </Link>
          { 
            pages.map((page) => (
              <Link
                key={ page.title }
                className={ styles.link }
                to={ page.__url }
              >
                { page.title }
              </Link>
            ))
          }
        </div>
        <div className={ styles.navPart2 }>
          { pkg.twitter &&
            <a
              href={ `https://twitter.com/${pkg.twitter}` }
              className={ styles.link }
            >
              <Svg svg={ twitterSvg } cleanup />
                { "Twitter" }
            </a>
          }
          { pkg.repository &&
            <a
              href={ pkg.repository }
              className={ styles.link }
            >
              <Svg svg={ gitHubSvg } cleanup />
              { "GitHub" }
            </a>
          }
        </div>
      </nav>
    </header>
  )
}

Header.contextTypes = {
  metadata: PropTypes.object.isRequired,
  collection: PropTypes.array,
}

export default Header
