import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  const socket = new WebSocket('ws://localhost:3000/test');

  socket.addEventListener('open', ()=> {
    console.log('connected to the websocket')
  })

  socket.addEventListener('message', (data) => {
    const message = JSON.parse(data.data)
    console.log(message)
  })


  const sendJson = ()=> { 
    socket.send(JSON.stringify({
      test: 'dwasd',
      test2: 'vcbv', 
      test3: 'dwafawf'
    }));
  }

return (
<div className="App">
  <div id="wrapper">   
    <div className="content">
      <p>This text is in frontend</p>
      <p>Content above your video</p>
      <p>Content above your video</p>
    </div>
    <div className="background">
      <video id="video" width="770" height="882" autoPlay muted loop>
        <source src="https://img.webnots.com/2015/06/Slider-Video.mp4" />
        <source src="https://img.webnots.com/2015/06/Slider-Video.webm" />
        <source src="https://img.webnots.com/2015/06/Slider-Video.ogv" />
      </video>
    </div>
  </div>
  <p>test change</p>
  <div id="later-contents">
    <button onClick={sendJson}>Send Json</button>
    <p>You can now play with the button below</p>
    <p>You can now play with the button below</p>
    <p>You can now play with the button below</p>
    <p>You can now play with the button below</p>
    <p>You can now play with the button below</p>
    <p>You can now play with the button below</p>
  </div>
</div>
)
}

export default App