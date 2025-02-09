import { useState } from 'react';
import ErrorThrowingComponent from './ErrorThrowingComponent';

const TestErrorButton = () => {
  const [triggerError, setTriggerError] = useState(false);

  if (triggerError) {
    return <ErrorThrowingComponent shouldThrow={true} />;
  }

  return (
    <button
      onClick={() => setTriggerError(true)}
      className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mx-auto block"
    >
      Trigger Test Error
    </button>
  );
};

export default TestErrorButton;
