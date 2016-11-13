/* global window, WebSocket */
import React, { Component, PropTypes } from 'react';
import MessageBox from 'components/elements/MessageBox';
import TextBox from 'components/elements/TextBox';

const { arrayOf, object } = PropTypes;

export default class SplashPage extends Component {

	constructor(props) {
		super(props);

		this.state = {
			messages: props.messages,
			message: ''
		};
	}

	componentDidMount() {
		// we are now working in DOM / browser
		const { localStorage, location: { host } } = window;
		const localName = localStorage.getItem('username');

		this.setState({ username: localName || 'new-user' });
		this.connection = new WebSocket(`ws://${host}/sendMessage`);
	}

	onUsername = e => {
		this.setState({ username: e.target.value });
		window.localStorage.setItem('username', e.target.value);
	}

	onMessage = e => {
		this.setState({ message: e.target.value });
	}

	sendMessage = () => {
		const message = {
			user: this.state.username,
			message: this.state.message
		}

		console.log(message);
		this.connection.send(JSON.stringify(message));
	}

	render() {
		const { state } = this;

		return (
			<div>
				<h1>Websocket chat</h1>
				<TextBox name="username" label="Username" onChange={this.onUsername} value={state.username} />
				<MessageBox messages={state.messages} />
				<TextBox name="message" label="Message" onChange={this.onMessage} value={state.message} />
				<button type="button" onClick={this.sendMessage}>Send</button>
			</div>
		);
	}
}

SplashPage.propTypes = {
	messages: arrayOf(object)
};