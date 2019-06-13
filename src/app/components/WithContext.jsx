import React from 'react'

export default function withContext(Component) {
	return function (Consumer, name) {
		return function contextComponent(props) {
			return (
				<Consumer>
					{context => <Component {...props} context={{[name]: context, ...(props.context && props.context)}} />}
				</Consumer>
			)
		}
	}
}