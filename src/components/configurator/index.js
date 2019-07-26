import { h, Component } from "preact";
import style from "./style";
import { route } from "preact-router";

export default class Configurator extends Component {
  static defaultProps = {
    frequencies: [1, 2, 3, 6, 9, 12],
    planets: ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn"],
    colors: ["Red", "Blue", "Yellow", "Green"]
  };

  state = {
    startDisabled: false,
    stopDisabled: false,
    clearDisabled: false,
    selectedPlanets: [],
    selectedColor: null,
    selectedInterval: null
  };

  constructor() {
    super();

    this.onColorSelect = this.onColorSelect.bind(this);
    this.onPlanetSelect = this.onPlanetSelect.bind(this);
    this.onIntervalSelect = this.onIntervalSelect.bind(this);

    this.activate = this.activate.bind(this);
    this.deactivate = this.deactivate.bind(this);
    this.clear = this.clear.bind(this);
    this.reset = this.reset.bind(this);
  }

  onIntervalSelect(e) {
    let targetValue = e.target.value;

    if (this.state.selectedInterval !== targetValue) {
      this.setState({ selectedInterval: targetValue });
    }
  }

  onPlanetSelect(e) {
    let targetValue = e.target.value;
    let { selectedPlanets } = this.state;
    let findIndex = selectedPlanets.indexOf(targetValue);

    if (selectedPlanets.length > 1 && findIndex !== -1) {
      selectedPlanets.splice(findIndex, 1);
    } else if (selectedPlanets.length <= 1 && findIndex === -1) {
      selectedPlanets.push(targetValue);
    } else {
      selectedPlanets = [];
    }

    this.setState({ selectedPlanets });
  }

  onColorSelect(e) {
    let targetValue = e.target.value;

    if (this.state.selectedColor !== targetValue) {
      this.setState({ selectedColor: targetValue });
    }
  }

  onExportClick() {
    route("/snapshot");
  }

  activate() {
    this.props.start(
      this.state.selectedPlanets,
      this.state.selectedInterval,
      this.state.selectedColor
    );
  }

  deactivate() {
    this.props.stop();
  }

  clear() {
    this.props.clear();
  }

  reset() {
    this.props.reset();
  }

  render() {
    return (
      <div class={style.configurator}>
        <div class={style.buttons}>
          <input
            type="button"
            value="Start"
            disabled={this.state.startDisabled}
            onClick={this.activate}
          />
          <input
            type="button"
            value="Stop"
            disabled={this.state.stopDisabled}
            onClick={this.deactivate}
          />
          <input
            type="button"
            value="Reset"
            disabled={this.state.clearDisabled}
            onClick={this.reset}
          />
        </div>
        <div class="planets">
          <h3>Planets (select two)</h3>
          {this.props.planets.map(planet => (
            <input
              type="button"
              value={planet}
              class="planet"
              onClick={this.onPlanetSelect}
              active={this.state.selectedPlanets.indexOf(planet) !== -1}
              disabled={
                this.state.selectedPlanets.length > 1 &&
                this.state.selectedPlanets.indexOf(planet) === -1
              }
            />
          ))}
        </div>
        <div class="frequencies">
          <h3>Interval (in seconds)</h3>
          {this.props.frequencies.map(interval => (
            <input
              type="button"
              value={interval}
              class="interval"
              onClick={this.onIntervalSelect}
              active={this.state.selectedInterval == interval}
            />
          ))}
        </div>
        <div class="colors">
          <h3>Colors</h3>
          {this.props.colors.map(color => (
            <input
              type="button"
              value={color}
              class="color"
              onClick={this.onColorSelect}
              active={this.state.selectedColor === color}
            />
          ))}
        </div>
        <div class={`${style.playa} ${style.buttons}`}>
          <input
            class={style.export}
            type="button"
            value="Export Pattern"
            onClick={this.onExportClick}
          />
        </div>
      </div>
    );
  }
}
