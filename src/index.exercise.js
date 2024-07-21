import React from 'react'
import ReactDOM from 'react-dom/client'
import {Logo} from './components/logo'

function onButtonClick(buttonName) {
    alert(`${buttonName} button was clicked!`)
}

function App() {
    return (
        <div>
            <Logo />

            <h2>Bookshelf</h2>

            <div>
                <button onClick={() => onButtonClick('Login')}>
                    Login
                </button>
            </div>

            <div>
                <button onClick={() => onButtonClick('Register')}>
                    Register
                </button>
            </div>
        </div>
    )
}

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(<App />)

