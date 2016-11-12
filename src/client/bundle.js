/* global window, document */
import React from 'react';
import { render } from 'react-dom';
import App from 'components';
import { SHARED_STATE_NAME } from 'common/constants';

const model = window[SHARED_STATE_NAME];

render(<App model={model} />, document);