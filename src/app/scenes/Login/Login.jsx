import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import request from '../../lib/request';
import withContext from '../../components/WithContext';
import AuthContext from '../../context/AuthContext';
import SnackBarContext from '../../context/SnackbarContext';
// import { toast } from 'react-toastify';

const styles = theme => ({
	main: {
		width: 'auto',
		display: 'block', // Fix IE 11 issue.
		marginLeft: theme.spacing.unit * 3,
		marginRight: theme.spacing.unit * 3,
		[theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
			width: 400,
			marginLeft: 'auto',
			marginRight: 'auto',
		},
	},
	paper: {
		marginTop: theme.spacing.unit * 8,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
	},
	avatar: {
		margin: theme.spacing.unit,
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing.unit,
	},
	submit: {
		marginTop: theme.spacing.unit * 3,
	},
});

class SignIn extends Component {

	constructor(props) {
		super(props)
		this.state = {
			email: "",
			password: "",
			confirmPassword: "",
			name: "",
		}
	}

	onSubmit = async (e, data) => {
		e.preventDefault();
		console.log("event", this.state);
		const { email, password } = this.state;
		try {
			const res = await this.props.context.auth.login({ email, password });
		} catch (err) {
			console.log("err", err);
			this.props.context.snackbar.open(err.message)
		}

	}

	onChange = (e) => {
		const { name, value } = e.target;
		this.setState({ [name]: value });
	}

	render() {

		const { classes } = this.props;
		const { isSignIn } = this.state
		const buttonText = "Sign in";

		return (
			<main className={classes.main}>
				<CssBaseline />
				<Paper className={classes.paper}>
					<Avatar className={classes.avatar}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Sign in
        </Typography>
					<form className={classes.form} onSubmit={this.onSubmit}>
						<FormControl margin="normal" required fullWidth>
							<InputLabel htmlFor="email">Email Address</InputLabel>
							<Input id="email" name="email" type="email" autoComplete="email" onChange={e => this.onChange(e)} autoFocus />
						</FormControl>
						<FormControl margin="normal" required fullWidth>
							<InputLabel htmlFor="password">Password</InputLabel>
							<Input name="password" type="password" id="password" onChange={e => this.onChange(e)} autoComplete="current-password" />
						</FormControl>
						{isSignIn &&
							<FormControlLabel
								control={<Checkbox value="remember" color="primary" />}
								label="Remember me"
							/>}
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
						>
							{buttonText}
						</Button>
					</form>
				</Paper>
			</main>
		);
	}
}

SignIn.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withContext(withContext(SignIn)(SnackBarContext.Consumer, 'snackbar'))(AuthContext.Consumer, 'auth'));