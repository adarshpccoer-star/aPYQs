declare module 'react-native-math-view' {
  import React from 'react';

  interface MathViewProps {
    math: string;
    style?: any;
    [key: string]: any;
  }

  const MathView: React.ComponentType<MathViewProps>;

  export default MathView;
}
