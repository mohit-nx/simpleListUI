import React from 'react';
import {
	Grid,
	Typography,
	List,
	IconButton,
	Button,
	ListItemText,
	ListItem,
	ListItemSecondaryAction,
	TextField,
	InputAdornment,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle
} from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles'

import { Delete, Search, Clear, Edit } from '@material-ui/icons';
import styles from './styles';
import request from '../../lib/request';
import withContext from '../../components/WithContext';
import AuthContext from '../../context/AuthContext';

class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			list: [],
			searchText: '',
			validatedSearchedText: '',
			dialogOpen: false,
			dialogMode: 'create',
			textChange: '',
			editButtonId: ''
		}
	}

	componentDidMount() {
		this.fetchList();
	}

	handleChangeSearchText = event => {
		this.setState({ searchText: event.target.value });
		this.handleValidateSearchText(event);
	};

	handleValidateSearchText = event => {
		const { validatedSearchedText } = this.state;
		const inputText = event.target.value;
		const trimText = inputText.trim();
		if (
			trimText.length >= 3 ||
			(trimText.length === 0 && validatedSearchedText !== "")
		) {
			if (this.timerId) clearTimeout(this.timerId);
			this.timerId = setTimeout(() => {
				this.setState(
					{
						validatedSearchedText: trimText,
					},
					this.fetchList
				);
			}, 1000);
		}
	};

	handleClearSearch = () => {
		this.setState({ validatedSearchedText: '', searchText: '' }, this.fetchList)
	}

	fetchList = () => {
		let url = '/simple-list';
		const { validatedSearchedText } = this.state;
		if (validatedSearchedText) {
			url = url + `?searchText=${validatedSearchedText}`
		}
		request('get', url, {}, { authorization: this.props.context.auth.token })
			.then(res => {
				console.log("dada", res.data);
				if (res.data.data) {
					this.setState({ list: res.data.data })
				}
			})
	}

	createListItem = () => {
		const { list, textChange } = this.state;
		request('post', '/simple-list', { text: textChange }, { authorization: this.props.context.auth.token })
			.then(res => {
				console.log("dada", res.data);
				if (res.data.data) {
					list.push(res.data.data)
					this.setState({ list, dialogOpen: false, textChange: "" })
				}
			})
			.catch(err => {
				this.setState({ dialogOpen: false, textChange: "" });
			})
	}

	deleteListItem = id => {
		request('delete', `/simple-list/${id}`, {}, { authorization: this.props.context.auth.token })
			.then(res => {
				const { list } = this.state;
				const elementIndex = list.findIndex(element => element._id === id);
				list.splice(elementIndex, 1);
				this.setState({ list })
			})
			.catch(err => {
				console.log("Err", err);
			})
	}

	updateListItem = () => {
		const { list, textChange, editButtonId } = this.state;
		request('put', `/simple-list/${editButtonId}`, { text: textChange }, { authorization: this.props.context.auth.token })
			.then(res => {
				const { list } = this.state;
				const elementIndex = list.findIndex(element => element._id === editButtonId);
				if (elementIndex > -1) {
					list[elementIndex].text = textChange;
				}
				this.setState({ list, dialogOpen: false, textChange: "" })
			})
			.catch(err => {
				this.setState({ dialogOpen: false, textChange: "" });
				console.log("Err", err);
			})
	}

	handleTextChange = (event) => {
		this.setState({ 'textChange': event.target.value })
	}

	render() {
		const { classes } = this.props;
		const { searchText, list, dialogMode } = this.state;
		console.log("dialogMode", dialogMode ,dialogMode === "create")
		return (
			<>
				<Grid item xs={12}>
					<TextField
						variant="outlined"
						fullWidth
						className={classes.searchBar}
						placeholder="Search Notification"
						margin="normal"
						variant="outlined"
						value={searchText}
						onChange={this.handleChangeSearchText}
						InputProps={{
							endAdornment: (
								<>
									<InputAdornment position="start" className={'searchIcon'}>
										<IconButton id="btnSearch"
											aria-label="textField"
											className={'iconBtn'}
										>
											<Search />
										</IconButton>
									</InputAdornment>
									{searchText !== "" && (
										<InputAdornment position="end">
											<IconButton
												aria-label="textField"
												className={'iconBtn'}
												onClick={this.handleClearSearch}
												id="clear-notification-search"
											>
												<Clear />
											</IconButton>
										</InputAdornment>
									)}
								</>
							),
							classes: {
								input: classes.resize
							}
						}}
					/>
					<Button className={classes.addButton} variant='contained' onClick={() => this.setState({ dialogMode: 'create', dialogOpen: true })} > + Add</Button>
				</Grid>
				<Grid item xs={12}>
					<div >
						<List>
							{
								list && list.map(element => (
									<ListItem key={`elemet_${element._id}`}>
										<ListItemText
											primary={element.text}
										// secondary={'Secondary text'}
										/>
										<ListItemSecondaryAction>
											<IconButton edge="end" aria-label="Edit" id={element._id} onClick={() => this.setState({ dialogMode: 'update', dialogOpen: true, editButtonId: element._id, textChange: element.text })}>
												<Edit />
											</IconButton>
											<IconButton edge="end" aria-label="Delete" id={element._id} onClick={() => this.deleteListItem(element._id)}>
												<Delete />
											</IconButton>
										</ListItemSecondaryAction>
									</ListItem>
								))
							}

						</List>
					</div>
					<Dialog open={this.state.dialogOpen} onClose={() => this.setState({ dialogOpen: false })} aria-labelledby="form-dialog-title">
						<DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
						<DialogContent>
							<DialogContentText>
								{dialogMode === "create"? "Enter text to add": "Update Text to Update" }
          </DialogContentText>
							<TextField
								autoFocus
								margin="dense"
								id="name"
								label="Text"
								type="email"
								fullWidth
								value={this.state.textChange}
								onChange={this.handleTextChange}
							/>
						</DialogContent>
						<DialogActions>
							<Button onClick={() => this.setState({ dialogOpen: false })} color="primary">
								Cancel
          </Button>
							<Button disabled={this.state.textChange.length < 3} onClick={() => (dialogMode === "create" ? this.createListItem(): this.updateListItem())} color="primary">
								{dialogMode === 'create' ? "Create" : "Update"}
          </Button>
						</DialogActions>
					</Dialog>
				</Grid>
			</>
		)
	}
}

export default withStyles(styles)(withContext(Dashboard)(AuthContext.Consumer, 'auth'))