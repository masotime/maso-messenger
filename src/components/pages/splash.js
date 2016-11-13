/* global window, WebSocket */
import React, { Component, PropTypes } from 'react';
import MessageBox from 'components/elements/MessageBox';
import TextBox from 'components/elements/TextBox';
import { max, extract, safeParse } from 'common/util';

const { arrayOf, object } = PropTypes;

export default class SplashPage extends Component {

	constructor(props) {
		super(props);

		const { messages } = props;
		const top = max(extract(messages, 'id')) || -1;

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
		websocket.onmessage = ({ data }) => {
			const msg = safeParse(data);

			switch (msg.type) {
				case 'MESSAGES_UPDATE': {
					const { messages } = msg;
					const top = max(extract(messages, 'id'));
					this.setState({
						messages: this.state.messages.concat(messages),
						top
					});
					break;
				}

				case 'UPDATES_AVAILABLE': {
					this.receiveMessages();
					break;
				}
			}
		}

		this.connection = websocket;
	}

	onUsername = e => {
		this.setState({ username: e.target.value });
		window.localStorage.setItem('username', e.target.value);
	}

	onMessage = e => {
		this.setState({ message: e.target.value });
	}

	receiveMessages = () => {
		const message = {
			type: 'RECEIVE',
			id: this.state.top
		};

		this.connection.send(JSON.stringify(message));
	}

	sendMessage = () => {
		const message = {
			type: 'SEND',
			user: this.state.username,
			message: this.state.message
		}

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