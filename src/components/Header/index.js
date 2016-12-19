import React, { PropTypes } from "react"

import enhanceCollection from "phenomic/lib/enhance-collection"
import styles from "./index.css"
import Svg from "react-svg-inline"
import AppBar from "react-toolbox/lib/app_bar"
import Navigation from "react-toolbox/lib/navigation"
import Link from "react-toolbox/lib/link"

import gitHubSvg from "../icons/iconmonstr-github-1.svg"
const git = <Svg className={ "material-icons" } svg={ gitHubSvg } cleanup />

class Header extends React.Component {
  static propTypes = {
    onLeftIconClick: PropTypes.func
  };
  render() {
    const { onLeftIconClick } = this.props;
    const { router, metadata: { pkg }, collection } = this.context;
    const pages = enhanceCollection(collection, {
      filter: { layout: "Page" },
    })
    return (
      <AppBar leftIcon="menu" onLeftIconClick={ onLeftIconClick } className={ styles.appBar }>
        <p>
          <span className={ styles.title }>{ "NIKITA" }</span>
          <span className={ styles.headline }>
            { "deployment automatisation for Node.js" }
          </span>
        </p>
        <Navigation className={ styles.nav } type="horizontal" flat="true">
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
        </Navigation>
      </AppBar>
    )
  }
}

Header.contextTypes = {
  metadata: PropTypes.object.isRequired,
  collection: PropTypes.array,
  router: PropTypes.object,
}

export default Header
