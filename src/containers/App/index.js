import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Chat from 'containers/Chat'
import Expander from 'components/Expander'
import { setFirstMessage, removeAllMessages } from 'actions/messages'
import { setCredentials, createConversation } from 'actions/conversation'
import { getCredentialsFromLocalStorage } from 'helpers'

import './style.scss'

const NO_LOCALSTORAGE_MESSAGE
  = 'Sorry, your browser does not support web storage. Are you in localhost ?'

@connect(
  state => ({
    isReady: state.conversation.conversationId,
    }),
  {
  setCredentials,
  setFirstMessage,
  createConversation,
  removeAllMessages,
  },
)
class App extends Component {
  state = {
    expanded: this.props.expanded || false,
    isReady: null,
  }
  static getDerivedStateFromProps (props, state) {
    const { isReady, preferences } = props

    // Since the conversation is only created after the first submit
    // need to check if the current state is expanded to avoid webchat being collasped
    // when the conversation is created.
    if (isReady !== state.isReady && !state.expanded) {
      let expanded = null

      switch (preferences.openingType) {
      case 'always':
        expanded = true
        break
      case 'never':
        expanded = false
        break
      case 'memory':
        if (window.localStorage) {
          expanded = localStorage.getItem('isChatOpen') === 'true'
        } else {
          console.log(NO_LOCALSTORAGE_MESSAGE)
        }
        break
      default:
        break
      }
      return { expanded, isReady }
    }
    return { isReady }
  }

  componentDidMount () {
    const { channelId, token, preferences, noCredentials, onRef } = this.props
    const credentials = getCredentialsFromLocalStorage(channelId)
    const payload = { channelId, token }

    if (onRef) {
      onRef(this)
    }

    if (noCredentials) {
      return false
    }

    if (credentials) {
      Object.assign(payload, credentials)
    } else {
      // Wait until a message is being send before creating the conversation.
      // this.props.createConversation(channelId, token).then(({ id, chatId }) => {
      //   storeCredentialsToLocalStorage(chatId, id, preferences.conversationTimeToLive, channelId)
      // })
    }

    if (preferences.welcomeMessage) {
      this.props.setFirstMessage(preferences.welcomeMessage)
    }

    this.props.setCredentials(payload)
  }

  componentDidUpdate (prevProps, prevState) {
    const { onToggle, conversationHistoryId } = this.props

    if (prevState.expanded !== this.state.expanded) {
      if (window.localStorage) {
        localStorage.setItem('isChatOpen', this.state.expanded)
        if (onToggle) {
          onToggle(this.state.expanded)
        }
      } else {
        console.log(NO_LOCALSTORAGE_MESSAGE)
      }
    }
  }

  componentDidCatch (error, info) {
    console.log(error, info)
  }

  toggleChat = () => {
    const { clearMessagesOnclose } = this.props
    this.setState({ expanded: !this.state.expanded }, () => {
      if (!this.state.expanded && clearMessagesOnclose) {
        this.clearMessages()
      }
    })
  }

  clearMessages = () => {
    this.props.removeAllMessages()
  }

  render () {
    const {
      preferences,
      containerMessagesStyle,
      containerStyle,
      expanderStyle,
      logoStyle,
      showInfo,
      sendMessagePromise,
      loadConversationHistoryPromise,
      onClickShowInfo,
      conversationHistoryId,
      primaryHeader,
      secondaryView,
      secondaryHeader,
      secondaryContent,
      getLastMessage,
      enableHistoryInput,
      defaultMessageDelay,
      readOnlyMode,
    } = this.props
    const { expanded } = this.state

    return (
      <div className='RecastApp CaiApp'>
        <link
          rel='stylesheet'
          type='text/css'
          href='https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css'
        />
        <link
          rel='stylesheet'
          type='text/css'
          href='https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css'
        />

        <Expander
          show={!expanded}
          onClick={this.toggleChat}
          preferences={preferences}
          style={expanderStyle}
        />

        <Chat
          show={expanded}
          clearMessages={this.clearMessages}
          closeWebchat={this.toggleChat}
          preferences={preferences}
          containerMessagesStyle={containerMessagesStyle}
          containerStyle={containerStyle}
          logoStyle={logoStyle}
          showInfo={showInfo}
          onClickShowInfo={onClickShowInfo}
          sendMessagePromise={sendMessagePromise}
          loadConversationHistoryPromise={loadConversationHistoryPromise}
          primaryHeader={primaryHeader}
          secondaryView={secondaryView}
          secondaryHeader={secondaryHeader}
          secondaryContent={secondaryContent}
          getLastMessage={getLastMessage}
          enableHistoryInput={enableHistoryInput}
          defaultMessageDelay={defaultMessageDelay}
          conversationHistoryId={conversationHistoryId}
          readOnlyMode={readOnlyMode}
          
        />
      </div>
    )
  }
}

App.propTypes = {
  token: PropTypes.string,
  channelId: PropTypes.string,
  preferences: PropTypes.object.isRequired,
  containerMessagesStyle: PropTypes.object,
  expanderStyle: PropTypes.object,
  containerStyle: PropTypes.object,
  showInfo: PropTypes.bool,
  sendMessagePromise: PropTypes.func,
  conversationHistoryId: PropTypes.string,
  loadConversationHistoryPromise: PropTypes.func,
  noCredentials: PropTypes.bool,
  primaryHeader: PropTypes.func,
  secondaryView: PropTypes.bool,
  secondaryHeader: PropTypes.any,
  secondaryContent: PropTypes.any,
  getLastMessage: PropTypes.func,
  expanded: PropTypes.bool,
  onToggle: PropTypes.func,
  removeAllMessages: PropTypes.func,
  onRef: PropTypes.func,
  clearMessagesOnclose: PropTypes.bool,
  enableHistoryInput: PropTypes.bool,
  readOnlyMode: PropTypes.bool,
  defaultMessageDelay: PropTypes.number,
}

export default App
