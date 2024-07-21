import '@reach/dialog/styles.css'
import * as React from 'react'
import {createRoot} from 'react-dom/client'
import {Dialog} from '@reach/dialog'
import {Logo} from './components/logo'
import LoginForm from './components/LoginForm'

function App() {
  const [openModal, setOpenModal] = React.useState('none')

  function login(formData) {
    console.log('login ', formData)
  }

  function register(formData) {
    console.log('register ', formData)
  }

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
      <Dialog aria-label="Login form" isOpen={openModal === 'login'}>
        <div>
          <button onClick={() => setOpenModal('none')}>Close</button>
        </div>
        <h3>Login</h3>

        <LoginForm onSubmit={login} buttonText="Login" />
      </Dialog>
      <Dialog aria-label="Registration form" isOpen={openModal === 'register'}>
        <div>
          <button onClick={() => setOpenModal('none')}>Close</button>
        </div>
        <h3>Register</h3>

        <LoginForm onSubmit={register} buttonText="Register" />
      </Dialog>
    </div>
  )
}

const root = createRoot(document.getElementById('root'))
root.render(<App />)
export {root}
