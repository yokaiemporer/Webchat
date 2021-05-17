import React,{ useState, useEffect } from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

const Dictaphone = (props) => {
  const { transcript, resetTranscript } = useSpeechRecognition()

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return null
  }
  useEffect(() => {
    props.onVoiceChange("lol",transcript)
    
  },[transcript]);
  return (
    <div>
      <button onClick={SpeechRecognition.startListening}>Start</button>
      {/* <button onClick={SpeechRecognition.stopListening }>Stop</button> */}
      {/* <button onClick={e => props.onVoiceChange(e,transcript)}>tochat</button> */}
      {/* <button onClick={resetTranscript}>Reset</button> */}
      {/* <p>{transcript}</p> */}
    </div>
  )
}
export default Dictaphone