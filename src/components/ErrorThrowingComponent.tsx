import { Component } from 'react';

interface Props {
  shouldThrow: boolean;
}

class ErrorThrowingComponent extends Component<Props> {
  render() {
    if (this.props.shouldThrow) {
      throw new Error('This is a test error!');
    }
    return null;
  }
}

export default ErrorThrowingComponent;
