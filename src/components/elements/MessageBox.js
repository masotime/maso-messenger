import React, { Component, PropTypes } from 'react';
import moment from 'moment';

const { arrayOf, object, string } = PropTypes;
const SCROLL_SENSITIVITY = 10;

export default class MessageBox extends Component {
	constructor(props) {
		super(props);
	}

	maybeRenderDate = timestamp => {
		// using relative time conveniently sidesteps timezone sync between server and client
		return this.showDates ? <span className="date">{moment(timestamp).fromNow()}</span> : null;
	}

	renderMessage = messageObj => {
		const { id, date, user, message } = messageObj;
		const { self } = this.props;
		const messageContainerClasses = ['message-container'];

		if (user === self) messageContainerClasses.push('self');
		
		return (
			<li key={id} className={user === self ? 'self' : ''}>
				<div className="meta-container">
					<span className="username">{user}</span>
					{ this.maybeRenderDate(date) }
				</div>
				<div className="message-container">
					<span className="message">{message}</span>
				</div>
			</li>
		);
	}

	componentDidMount() {
		this.shouldScroll = true;
		this.showDates = true;
	}

	componentWillReceiveProps(nextProps) {
		const next = nextProps.messages.length;
		const curr = this.props.messages.length;
		if (next > curr) {
			// going to receive messages, decide whether to scroll or not
			const { scrollHeight, scrollTop, offsetHeight} = this.msgContainer;
			this.shouldScroll = scrollTop + offsetHeight >= scrollHeight - SCROLL_SENSITIVITY;
		}
	}

	componentDidUpdate() {
		if (this.shouldScroll) {
			this.shouldScroll = false;
			this.msgContainer.scrollTop = this.msgContainer.scrollHeight;
		}
	}

	render() {
		const { messages } = this.props;

		return (
			<div className="message-box" ref={ref => this.msgContainer = ref}>
				<ul className="messages">
					{ messages.map(this.renderMessage) }
				</ul>
			</div>
		);
	}

}

MessageBox.propTypes = {
	messages: arrayOf(object),
	self: string
};
