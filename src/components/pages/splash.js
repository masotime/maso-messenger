/* global window, WebSocket */
import React, { Component, PropTypes } from 'react';
import MessageBox from 'components/elements/MessageBox';
import TextBox from 'components/elements/TextBox';
import MessagingClient from 'client/websocket';

const { arrayOf, object, number } = PropTypes;

export default class SplashPage extends Component {

	constructor(props) {
		super(props);

		const { messages, top } = props;

		this.state = {
			message: '',
			messages,
			top
		};
	}

	componentDidMount() {
		// we are now working in DOM / browser
		const { localStorage, location: { host } } = window;
		const localName = localStorage.getItem('username');

		this.setState({ username: localName || 'new-user' });

		// configure websocket connection
		const websocket = new WebSocket(`ws://${host}/messages`);
		this.msgClient = MessagingClient(websocket, {
			top: this.state.top,
			messages: this.state.messages
		});
		this.msgClient.subscribe(({ top, messages }) => this.setState({ top, messages }));
	}

	onUsername = e => {
		this.setState({ username: e.target.value });
		window.localStorage.setItem('username', e.target.value);
	}

	onMessage = e => {
		this.setState({ message: e.target.value });
	}

	sendMessage = () => {
		const { username, message } = this.state;
		this.msgClient.send(username, message);
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
	messages: arrayOf(object),
	top: number
};