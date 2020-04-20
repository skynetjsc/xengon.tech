import * as React from 'react';
import {TextInput} from 'react-native';
import styles from './styles';

class InputInfo extends React.Component {

  constructor(props) {
    super(props);
    this.state = { placeholder: props.value.length === 0 };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(ev) {
    this.setState({ placeholder: ev.nativeEvent.text.length === 0 });
    this.props.onChange && this.props.onChange(ev);
  }

  render() {
    const { placeholderStyle, style, onChange, ...props } = this.props;

    return (
      <TextInput
        {...props}
        onChange={this.handleChange}
        style={this.state.placeholder ?
          [styles.textInput, style, styles.placeholderStyle, placeholderStyle] : [styles.textInput, style]}
        placeholderTextColor="#34435630"
      />
    );
  }

}

export default InputInfo;
