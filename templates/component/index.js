import React from 'react';
import Styled from '@oracle-commerce/react-components/styled';
import css from './styles.css';

const SampleComponent = props => {
  const {sampleConfigOption} = props;

  return (
    <Styled id="SampleComponent" css={css}>
      <div>
        <h1>SampleComponent {sampleConfigOption}</h1>
      </div>
    </Styled>
  );
};

export default SampleComponent;
