import React, { Component, PropTypes } from 'react';

const { arrayOf, object } = PropTypes;

export default class MessageBox extends Component {
	constructor(props) {
		super(props);
	}

	renderMessage(messageObj) {
		const { id, date, user, message } = messageObj;
		return (
			<li key={id}>
				<span className="username">{user}</span>
				<span className="date">{date}</span>
				<span className="message">{message}</span>
			</li>
		);
	}

	render() {
		const { messages } = this.props;
		console.log(JSON.stringify(messages, null, 4));

		return (
			<div className="message-box">
				<ul className="messages">
					{ messages.map(this.renderMessage) }
				</ul>
			</div>
		);
	}

}

MessageBox.propTypes = {
	messages: arrayOf(object)
};
