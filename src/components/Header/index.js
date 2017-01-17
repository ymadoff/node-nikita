import React, { PropTypes } from "react"

// import enhanceCollection from "phenomic/lib/enhance-collection"
import styles from "./index.css"
import Svg from "react-svg-inline"
// import AppBar from "react-toolbox/lib/app_bar"
import { IconButton } from "react-toolbox/lib/button"
// import Navigation from "react-toolbox/lib/navigation"
import Link from "react-toolbox/lib/link"
// import cx from "classnames"

import gitHubSvg from "../icons/iconmonstr-github-1.svg"
const git = <Svg className={ "material-icons" } svg={ gitHubSvg } cleanup />

const Header = (props, context) => {
  const { onLeftIconClick } = props
  const { router, metadata: { pkg } } = context // , collection
  // const pages = enhanceCollection(collection, {
  //   filter: { layout: "Page", __url: /^\/about\/.*/ },
  //   sort: "sort"
  // })

  const handleToggleHome = (event) => {
    event.preventDefault()
    router.push("/")
  }
  const pages = []
  return (
    <div
      leftIcon="menu"
      onLeftIconClick={ onLeftIconClick }
      className={ styles.appBar }
    >
      <IconButton inverse icon={ "menu" } onClick={ onLeftIconClick } />
      <p className={ styles.texts }>
        <a className={ styles.title } href="#" onClick={ handleToggleHome }>
          { "NIKITA" }
        </a>
        <span className={ styles.headline }>
          { "Deployment automatisation for Node.js" }
        </span>
      </p>
      <nav className={ styles.nav } type="horizontal" flat="true">
        {
          pages.map((page) => {
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
        <Link href={ pkg.repository } label="GitHub"
          active icon={ git } className={ styles.github }
        />
      </nav>
    </div>
  )
}

Header.propTypes = {
  onLeftIconClick: PropTypes.func,
}
Header.contextTypes = {
  metadata: PropTypes.object.isRequired,
  router: PropTypes.object,
}

export default Header
