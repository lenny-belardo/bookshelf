import React from 'react'
import {render, screen, within} from '@testing-library/react'
import {Modal, ModalContents, ModalOpenButton} from '../modal'
import userEvent from '@testing-library/user-event'

test('can be opened and closed', async () => {
    const content = "Modal contents"
    const modalTitle = "Test"
    const modalLabel = "test-label"

    render(
        <Modal>
            <ModalOpenButton>
                <button>Open modal</button>
            </ModalOpenButton>
            <ModalContents aria-label={modalLabel} title={modalTitle}>
                <div>{content}</div>
            </ModalContents>
        </Modal>
    )
    expect(screen.getByRole('button', {name: /Open modal/})).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', {name: /Open modal/}))

    const modal = screen.getByRole('dialog')

    expect(screen.queryByRole('dialog')).toBeInTheDocument()
    expect(modal).toBeInTheDocument()
    expect(modal).toHaveAttribute('aria-label', modalLabel)
    expect(screen.getByLabelText(modalLabel)).toBeInTheDocument()

    const inModal = within(modal)

    expect(inModal.getByRole('heading', {name: modalTitle})).toBeInTheDocument()
    expect(inModal.getByText(content)).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', {name: /Close/}))

    expect(screen.queryByLabelText(modalLabel)).not.toBeInTheDocument()
})
