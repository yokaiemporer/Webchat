import React from 'react'
import PropTypes from 'prop-types'
// import refreshLogo from '../../../assets/refresh-page-option.png'
import './style.scss'

const Header = ({ closeWebchat, preferences, logoStyle, readOnlyMode ,clearMessages}) => {
  if (readOnlyMode) {
    return null
  }
  return (
    <div
      className='RecastAppHeader CaiAppHeader'
      style={{
        color: preferences.complementaryColor,
        backgroundColor: preferences.accentColor,
      }}
    >
      <img className='RecastAppHeader--logo CaiAppHeader--logo' src={preferences.headerLogo} style={logoStyle} />

      <div className='RecastAppHeader--title CaiAppHeader--title'>{preferences.headerTitle}</div>
      <button onClick={clearMessages}>Refresh</button>
      <img src='../../../assets/refresh-page-option.png' onClick={clearMessages} />
      <div className='RecastAppHeader--btn CaiAppHeader--btn' onClick={closeWebchat}>
        <img src='https://cdn.cai.tools.sap/webchat/close.svg' />
      </div>
    </div>
  )
}

Header.propTypes = {
  refreshLogo: PropTypes.object,
  closeWebchat: PropTypes.func,
  preferences: PropTypes.object,
  logoStyle: PropTypes.object,
  readOnlyMode: PropTypes.bool,
  clearMessages: PropTypes.func
}

export default Header
