import { h, Component } from 'preact';
import { route } from 'preact-router';
import style from './style';
import Configurator from '../../components/configurator';
import Chart from 'react-d3-basic';

export default class Home extends Component {

	state = {

		mercuryTick: 4,
		mercuryTheta: 270,
		mercuryX: 0,
		mercuryY: 0,
		mercuryRadius: 40,

		venusTick: 3,
		venusTheta: 270,
		venusX: 0,
		venusY: 0,
		venusRadius: 60,

		earthTick: 2,
		earthTheta: 270,
		earthX: 0,
		earthY: 0,
		earthRadius: 100,

		marsTick: 1.5,
		marsTheta: 270,
		marsX: 0,
		marsY: 0,
		marsRadius: 150,

		jupiterTick: 1,
		jupiterTheta: 270,
		jupiterX: 0,
		jupiterY: 0,
		jupiterRadius: 220,

		patternSource: 'earth',
		patternTarget: 'jupiter',
		lines: [],

		width: 440,
		height: 440
	}

	_getCoords (theta, radius) {
		let y = radius + (radius * Math.sin((theta / 180) * Math.PI));
		let x = radius + (radius * Math.cos((theta / 180) * Math.PI));

		return {x, y};
	}

	_frame() {

		let {
			venusTheta,
			venusTick,
			venusRadius,
			earthTheta,
			earthTick,
			marsTheta,
			marsTick,
			jupiterTheta,
			jupiterTick,
			jupiterRadius

		} = this.state;

		let factor = 4;

		this.setState({
			venusTheta: venusTheta + (venusTick / factor),
			earthTheta: earthTheta + (earthTick / factor),
			marsTheta: marsTheta + (marsTick / factor),
			jupiterTheta: jupiterTheta + (jupiterTick / factor)
		});
	}

	_snapshot () {

		let {lines} = this.state;
		let c = this._canvasContext;

		let p1 = this.state.patternSource;
		let p2 = this.state.patternTarget;

		let p1Offset = 220.5 - this.state[`${p1}Radius`];
		let p2Offset = 220.5 - this.state[`${p2}Radius`];

		let p1Point = this._getCoords(this.state[`${p1}Theta`], this.state[`${p1}Radius`]);
		let p2Point = this._getCoords(this.state[`${p2}Theta`], this.state[`${p2}Radius`]);

		lines.push([
			p1Point,
			p2Point
		]);

		c.beginPath();
		c.moveTo(p1Offset + p1Point.x, p1Offset + p1Point.y);
		c.lineTo(p2Offset + p2Point.x, p2Offset + p2Point.y);
		c.stroke();
		c.closePath();

		this.setState({lines});
	}

	startPattern (selectedPlanets, selectedInterval, selectedColor) {

		if (!this._frameTimer) {
			this._frameTimer = setInterval(() => this._frame(), 25);
		}

		this.stopPattern();

		this.state.patternSource = selectedPlanets[0].toLowerCase();
		this.state.patternTarget = selectedPlanets[1].toLowerCase();

		this._canvasContext.strokeStyle = selectedColor.toLowerCase();
		this._canvasContext.lineWidth = 0.8;
		this._patternTimer = setInterval(() => this._snapshot(), Number(selectedInterval) * 1000);
	}

	stopPattern () {
		if (this._patternTimer) {
			clearInterval(this._patternTimer);
		}
	}

	clearPattern () {
		this.stopPattern();
		this._canvasContext.clearRect(0,0,this.state.width,this.state.height);
	}

	resetPlanets () {
		if (this._patternTimer) {
			this.clearInterval(this._patternTimer);
		}

		if (this._frameTimer) {
			this.clearInterval(this._frameTimer);
		}

		this.setState({
			mercuryTheta: 270,
			venusTheta: 270,
			earthTheta: 270,
			marsTheta: 270,
			jupiterTheta: 270,
			saturnTheta: 270
		});
	}

	componentWillReceiveProps(props) {
		if (props.snapshot) {
			if (this.canvas && this.hiddenLink) {
				let dataURI = this.canvas.toDataURL('png');
				this.hiddenLink.href = dataURI;
				this.hiddenLink.click();

				route("/");
			}
		}
	}

	componentDidMount() {
		this._canvasContext = this.canvas.getContext('2d');
		this.canvas.width = this.state.width;
		this.canvas.height = this.state.height;
	}



	render() {

		let venusCoords = this._getCoords(this.state.venusTheta, this.state.venusRadius);
		let earthCoords = this._getCoords(this.state.earthTheta, this.state.earthRadius);
		let marsCoords = this._getCoords(this.state.marsTheta, this.state.marsRadius);
		let jupiterCoords = this._getCoords(this.state.jupiterTheta, this.state.jupiterRadius);

		return (
			<div class={`${style.home} ${style.centerboth}`}>
				<canvas ref={canvas => (this.canvas = canvas)}></canvas>
				<div onClick={this.toggle} class={`${style.orbit} ${style.venus} ${style.centerboth}`}>
					<div
						style={{left: venusCoords.x, top: venusCoords.y}}
						class={`${style.planet} ${style.venus}`}>
					</div>
				</div>
				<div class={`${style.orbit} ${style.earth} ${style.centerboth}`}>
					<div
						style={{left: earthCoords.x, top: earthCoords.y}}
						class={`${style.planet} ${style.earth}`}>
					</div>
				</div>
				<div class={`${style.orbit} ${style.mars} ${style.centerboth}`}>
					<div
						style={{left: marsCoords.x, top: marsCoords.y}}
						class={`${style.planet} ${style.mars}`}>
					</div>
				</div>
				<div class={`${style.orbit} ${style.jupiter} ${style.centerboth}`}>
					<div
						style={{left: jupiterCoords.x, top: jupiterCoords.y}}
						class={`${style.planet} ${style.jupiter}`}>
					</div>
				</div>
				<div class={style.sun}></div>
				<a ref={hiddenLink => (this.hiddenLink = hiddenLink)} href="#" style="display:none" download="pattern">Download</a>
				<div class={style.configuration}>
					<Configurator layout="auto" start={this.startPattern.bind(this)} stop={this.stopPattern.bind(this)} reset={this.resetPlanets.bind(this)} clear={this.clearPattern.bind(this)} />
				</div>
			</div>
		);
	}
}
