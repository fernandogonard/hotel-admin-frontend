import React from 'react';

const ErrorMessage = ({ error }) => {
  if (!error) return null;
  return (
    <div style={{ color: 'red', margin: '1em 0' }}>
      {error.message || error}
    </div>
  );
};

export default ErrorMessage;
