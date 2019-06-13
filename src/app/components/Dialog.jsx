import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import DialogContentText from '@material-ui/core/DialogContentText';
import TextField from '@material-ui/core/TextField';

class ConfirmationDialogBox extends React.Component {
	render() {
		const { dialogBoxBody, dialogBoxTitle, handleTextChange, ...rest } = this.props;
		return (
			<Dialog
				// disableBackdropClick
				disableEscapeKeyDown
				maxWidth="xs"
				{...rest}
			>
				<DialogTitle id="confirmation-dialog-title">{(dialogBoxTitle) ? dialogBoxTitle : 'Action confirmation'}</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						id="name"
						label="Email Address"
						type="email"
						value={this.props.textvalue}
						onChange={this.props.handleTextChange}
						fullWidth
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => this.props.onClose(false)} color="primary">
						Cancel
            </Button>
					<Button onClick={() => this.props.onClose(true)} color="primary">
						Ok
            </Button>
				</DialogActions>
			</Dialog >
		);
	}
}

ConfirmationDialogBox.propTypes = {
	onClose: PropTypes.func,
};

export default Dialog;