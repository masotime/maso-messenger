import React, { Component, PropTypes } from 'react';

const { string, func, bool } = PropTypes;

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

	focus() {
		this.textbox.focus();
	}

	renderInput = props => this.props.textarea ? <textarea {...props} /> : <input type="text" {...props} />;

	render() {
		const { props, state } = this;
		const inputProps = {
			name: props.name,
			placeholder: props.placeholder || props.label,
			value: state.value,
			onChange: props.onChange,
			onKeyUp: props.onKeyUp,
			ref: ref => this.textbox = ref
		};

		return (
			<div className="textbox">
				<label>{props.label}</label>
				{ this.renderInput(inputProps) }
			</div>
		);
	}
}

TextBox.defaultProps = {
	ref: () => {},
	onChange: () => {},
	onKeyUp: () => {},
	textarea: false
};

TextBox.propTypes = {
	value: string,
	label: string,
	placeholder: string,
	name: string,
	onChange: func,
	onKeyUp: func,
	textarea: bool
};