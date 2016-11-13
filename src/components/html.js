import React, { Component, PropTypes } from 'react';
import { BUNDLE_PATHNAME, STATIC_PATHNAME, SHARED_STATE_NAME } from 'constants/common';

const { node, oneOfType, arrayOf, object } = PropTypes;

export default class Html extends Component {
	render() {
		const { model, children } = this.props;
		const { title } = model;
		return (
			<html>
				<head>
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<meta charSet="utf-8" />
					<link rel="stylesheet" href={`${STATIC_PATHNAME}/css/style.css`} />
					<title>{title}</title>
				</head>
				<body>
					{children}
					<script type="text/javascript" dangerouslySetInnerHTML={
						{ __html: `window.${SHARED_STATE_NAME} = ${JSON.stringify(model)}` }
					}></script>
					<script src={BUNDLE_PATHNAME}></script>
				</body>
			</html>
		);
	}
}

Html.propTypes = {
	model: object,
	children: oneOfType([node, arrayOf(node)])
};
