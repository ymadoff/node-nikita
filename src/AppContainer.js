import React, { PropTypes } from "react"

import "./index.global.css"
import "./highlight.global.css"
import styles from "./AppContainer.css"
import "react-toolbox/components/layout/theme.scss"
import cookie from "react-cookie"

import Container from "./components/Container"
import Drawer from "./components/Drawer"
import DefaultHeadMeta from "./components/DefaultHeadMeta"
import Header from "./components/Header"
import Content from "./components/Content"
import Footer from "./components/Footer"
import cx from "classnames"

class AppContainer extends React.Component {
  constructor(props) {
    super(props)
    // const navopen = cookie.load("navopen")
    // let navopen
    // if (navopen == undefined) navopen = window.innerWidth > 760
    // alert(navopen+" "+window.innerWidth+" "+document.body.innerWidth+" "+
    //   document.documentElement.clientWidth+" "+
    //   screen.width+"/"+screen.height+
    //   " "+window.orientation+" | "+window.devicePixelRatio
    // )
    // navopen = false;
    this.state = { navopen: false }
  }
  state = {}
  handleLeftIconClick = () => {
    this.setState({ navopen: !this.state.navopen })
    cookie.save("navopen", this.state.navopen)
  }
  isActive() {
    return cx(this.state.navopen && styles.navopen)
  }
  render() {
    const { children } = this.props
    return (
      <div className={ this.isActive() }>
      <Drawer open={ this.state.navopen } />
      <Container className={ styles.container } open={ this.state.navopen }>
        <DefaultHeadMeta />
        <Header onLeftIconClick={ this.handleLeftIconClick } />
        <Content>
          { children }
        </Content>
        <Footer />
      </Container>
      </div>
    )
  }
}

AppContainer.propTypes = {
  children: PropTypes.node,
}
AppContainer.contextTypes = {
  store: PropTypes.object,
}

export default AppContainer
