/** @jsx jsx */
import {jsx} from '@emotion/core'

import * as React from 'react'
import {Dialog} from './lib'

const ModalContext = React.createContext()

const callAll = (...fns) => (...args) => fns.forEach((fn) => fn && fn(args))
function Modal(props) {
  const [isOpen, setIsOpen] = React.useState(false)

  return <ModalContext.Provider value={[isOpen, setIsOpen]} {...props} />
}

function ModalDismissButton({children: child}) {
  const [, setIsOpen] = React.useContext(ModalContext)

  return React.cloneElement(child, {
    onClick: (...args) => callAll(setIsOpen(false), child.props.onClick(args))
  })
}

function ModalOpenButton({children: child}) {
  const [, setIsOpen] = React.useContext(ModalContext)
  return React.cloneElement(child, {
    onClick: (...args) => callAll(setIsOpen(true), child.props.onClick(args))
  })
}

function ModalContents(props) {
  const [isOpen, setIsOpen] = React.useContext(ModalContext)
  return (
    <Dialog isOpen={isOpen} onDismiss={() => setIsOpen(false)} {...props} />
  )
}

export {Modal, ModalDismissButton, ModalOpenButton, ModalContents}
