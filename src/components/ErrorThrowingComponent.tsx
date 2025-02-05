import React from 'react';

interface Props {
  shouldThrow: boolean;
}

const ErrorThrowingComponent: React.FC<Props> = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('This is a test error!');
  }
  return null;
};

export default ErrorThrowingComponent;
