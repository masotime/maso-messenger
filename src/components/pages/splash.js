/* global window, WebSocket */
import React, { Component, PropTypes } from 'react';
import MessageBox from 'components/elements/MessageBox';
import TextBox from 'components/elements/TextBox';
import MessagingClient from 'client/websocket';

const { arrayOf, object, number, string } = PropTypes;

export default class SplashPage extends Component {

	constructor(props) {
		super(props);

		const { title, messages, top } = props;

		this.state = {
			message: '',
			title,
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
		this.setState({ message: '' });
		this.msgBox.focus();
	}

	messageKeyUp = e => {
		if (e.keyCode === 0x0D && !e.shiftKey) this.sendMessage();
	}

	render() {
		const { state } = this;

		return (
			<div className="chat-container">
				<div className="header">
					<h1>{state.title}</h1>
				</div>
				<MessageBox messages={state.messages} self={state.username} />
				<div className="footer">
					<TextBox name="username" label="Username" onChange={this.onUsername} value={state.username} />
					<TextBox name="message" label="Message" onChange={this.onMessage} onKeyUp={this.messageKeyUp} value={state.message} ref={ref => this.msgBox = ref} textarea />
					<button className="float-button" type="button" onClick={this.sendMessage}>Send</button>
				</div>
			</div>
		);
	}
}

SplashPage.propTypes = {
	title: string,
	messages: arrayOf(object),
	top: number
};