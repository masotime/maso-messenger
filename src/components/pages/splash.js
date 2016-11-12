import React, { Component, PropTypes } from 'react';

const { string } = PropTypes;

export default class SplashPage extends Component {
	render() {
		const { title, message } = this.props;

		return (
			<div>
				<h1>{title}</h1>
				<p>{message}</p>
			</div>
		);
	}
}

SplashPage.propTypes = {
	title: string,
	message: string
};