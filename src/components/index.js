// this is the root component
import React, { Component, PropTypes } from 'react';
import Html from 'components/html';
import SplashPage from 'components/pages/splash';

const { object } = PropTypes;

export default class App extends Component {
	render() {
		const { model } = this.props;
		return (
			<Html model={model}>
				<SplashPage {...model} />
			</Html>
		);
	}
}

App.propTypes = {
	model: object
};
