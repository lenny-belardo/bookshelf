import * as React from 'react'

function LoginForm({onSubmit, buttonText}) {
    return (
        <form type="submit" onSubmit={onSubmit}>
            <div>
                <label>Username</label>
                <input id="username" name="username" />
            </div>

            <div>
                <label>Password</label>
                <input id="password" name="password" />
            </div>

            <button>{buttonText}</button>
        </form>
    )
}

export default LoginForm
