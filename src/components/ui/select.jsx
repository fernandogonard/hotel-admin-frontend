// src/components/ui/select.jsx
import React from 'react'

export const Select = ({ children, ...props }) => {
  return (
    <select
      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      {...props}
    >
      {children}
    </select>
  )
}

export const SelectItem = ({ children, value }) => {
  return <option value={value}>{children}</option>
}
