import * as React from 'react'

function LoginForm({onSubmit, buttonText}) {
    const handleSubmit = (event) => {
        event.preventDefault();
    
        const formData = new FormData(event.target)
        const formEntries = Object.fromEntries(formData)
    
        onSubmit(formEntries)
    }

    return (
        <form type="submit" onSubmit={handleSubmit}>
            <div>
                <label htmlFor="username">Username</label>
                <input type="text" id="username" name="username" />
            </div>

            <div>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" />
            </div>

            <button type="submit">{buttonText}</button>
        </form>
    )
}

export default LoginForm
