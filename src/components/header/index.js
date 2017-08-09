import { h, Component } from 'preact';
import { route } from 'preact-router';
import style from './style';

export default class Header extends Component {

	onExportClick() {
		route("/snapshot")
	}

	render() {
		return (
			<header class={style.header}>
				<h2>Celestial Patterns</h2>
				<input class={style.normal} type='button' value='Export Pattern' onClick={this.onExportClick} />
			</header>
		);
	}
}
