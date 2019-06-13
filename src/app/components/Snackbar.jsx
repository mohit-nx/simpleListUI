import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import SnackbarContext from '../context/SnackbarContext';

const Styles = theme => ({
	close: {
		padding: theme.spacing(0.5),
	},
});

class SimpleSnackbar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			message: "",
			open: false
		}
	}

	handleOpen = (message) => {
		this.setState({ message, open: true });
	}

	handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		this.setState({ message: "", open: false })
	}

	render() {
		const { classes, children} = this.props;
		const { open, message } = this.state;

		return (
			<SnackbarContext.Provider value={{ open: this.handleOpen }} >
				<div>
					<Snackbar
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'left',
						}}
						open={open}
						autoHideDuration={6000}
						onClose={this.handleClose}
						ContentProps={{
							'aria-describedby': 'message-id',
						}}
						message={<span id="message-id">{message}</span>}
						action={[
							<Button key="undo" color="secondary" size="small" onClick={this.handleClose}>
								UNDO
						</Button>,
							<IconButton
								key="close"
								aria-label="Close"
								color="inherit"
								className={classes.close}
								onClick={this.handleClose}
							>
								<CloseIcon />
							</IconButton>,
						]}
					/>
				</div>
				{children}
			</SnackbarContext.Provider>
		);
	}
}

export default withStyles(Styles)(SimpleSnackbar)