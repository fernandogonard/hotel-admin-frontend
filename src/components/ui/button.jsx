// src/components/ui/button.jsx
import React from 'react'
import classNames from 'classnames'

export const Button = ({ children, className, variant = 'default', ...props }) => {
  const baseStyles = 'px-4 py-2 rounded-md font-medium transition-all'
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 text-gray-800 hover:bg-gray-100',
    ghost: 'text-gray-800 hover:bg-gray-100',
  }

  return (
    <button className={classNames(baseStyles, variants[variant], className)} {...props}>
      {children}
    </button>
  )
}
