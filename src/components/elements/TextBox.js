import React, { Component, PropTypes } from 'react';

const { string, func } = PropTypes;

export default class TextBox extends Component {

	constructor(props) {
		super(props);
		this.state = {
			value: props.value || ''
		};
	}

	componentWillReceiveProps(nextProps) {
		if (this.state.value !== nextProps.value) {
			this.setState({ value: nextProps.value });
		}
	}

	render() {
		const { props, state } = this;

		return (
			<div className="textbox">
				<label>{props.label}</label>
				<input 
					type="text"
					name={props.name}
					placeholder={props.placeholder || props.label}
					value={state.value}
					onChange={props.onChange}
				/>
			</div>
		);
	}
}

TextBox.propTypes = {
	value: string,
	label: string,
	placeholder: string,
	name: string,
	onChange: func
}