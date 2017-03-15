import React, { PropTypes } from 'react';
import Checkbox from 'material-ui/Checkbox';
import RadioButton from 'material-ui/RadioButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import muiThemeable from 'material-ui/styles/muiThemeable';
import cloneDeep from 'lodash/cloneDeep';
import FeedbackTick from './feedback-tick.jsx';
import Feedback from './feedback.jsx';

export class ChoiceInput extends React.Component {

  onCheck(el) {
    this.props.onChange({
      value: this.props.value,
      selected: el.target.checked
    });
  }

  _checked() {
    return (this.props.correct !== undefined) ? this.props.correct : this.props.checked;
  }

  getTheme() {
    let theme = cloneDeep(this.props.muiTheme);
    if (this.props.correctness === 'correct') {
      theme.checkbox.disabledColor = theme.correctColor;
    } else if (this.props.correctness === 'incorrect') {
      theme.checkbox.disabledColor = theme.incorrectColor;
    }
    return theme;
  }

  render() {

    const muiTheme = this.getTheme();
    const Tag = this.props.choiceMode === 'checkbox' ? Checkbox : RadioButton;
    const classSuffix = this.props.choiceMode === 'checkbox' ? 'checkbox' : 'radio-button';
    const feedbackStyle = {
      display: this.props.feedback !== undefined ? 'none' : 'block'
    };
    const label = (this.props['display-key'] !== undefined && this.props.label !== undefined) ? 
      `${this.props['display-key']}. ${this.props.label}` : undefined;
    /**
     * TODO: should only really have 1 theme provider in the component tree.
     * but the way Checkbox is set up you can't tweak the styles via the props fully.
     * So have to use an additional MuiThemeProvider for now.
     */
    return <div className={"corespring-" + classSuffix}>
      { this.props.showFeedbackTick && <FeedbackTick correctness={this.props.correctness} style={{feedbackStyle}} /> }
      <div className="checkbox-holder">
        <MuiThemeProvider muiTheme={muiTheme}>
          <Tag
            disabled={this.props.disabled}
            checked={this._checked.bind(this)()}
            onCheck={this.onCheck.bind(this)}
            label={label} />
        </MuiThemeProvider>
      </div>
      <Feedback feedback={this.props.feedback} correctness={this.props.correctness} style={{feedbackStyle}} />
    </div>
  }
};

ChoiceInput.propTypes = {
  choiceMode: React.PropTypes.oneOf(['radio', 'checkbox']),
  'display-key': React.PropTypes.string, 
  checked: PropTypes.bool,
  correct: PropTypes.bool,
  correctness: PropTypes.string,
  disabled: PropTypes.bool,
  feedback: PropTypes.string,
  showFeedbackTick: PropTypes.bool,
  label: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string
};


ChoiceInput.defaultProps = {
  showFeedbackTick: true
};

export default muiThemeable()(ChoiceInput);
