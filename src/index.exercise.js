import * as React from 'react'
import {createRoot} from 'react-dom/client'
import {Logo} from './components/logo'
import {Dialog} from '@reach/dialog'
import '@reach/dialog/styles.css'

const BUTTON_KEY = {
  LOGIN: 'login',
  REGISTER: 'register'
}

function App() {
  const [openModal, setOpenModal] = React.useState('none')

  return (
    <div>
      <Logo width="80" height="80" />
      <h1>Bookshelf</h1>

      <div>
        <button onClick={() => setOpenModal('login')}>Login</button>
      </div>

      <div>
        <button onClick={() => setOpenModal('register')}>Register</button>
      </div>

      <Dialog aria-label="login" isOpen={openModal === BUTTON_KEY.LOGIN}>
        <div>
          <button onClick={() => setOpenModal('none')}>Close</button>
        </div>

        <h3>Login</h3>
      </Dialog>

      <Dialog aria-label="register" isOpen={openModal === BUTTON_KEY.REGISTER}>
        <div>
          <button onClick={() => setOpenModal('none')}>Close</button>
        </div>

        <h3>Register</h3>
      </Dialog>
    </div>
  )
}


const root = createRoot(document.getElementById('root'))
root.render(<App />)
export {root}
