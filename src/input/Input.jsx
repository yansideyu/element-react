/* @flow */

import React from 'react';
import { Component, PropTypes } from '../../libs';

import calcTextareaHeight from './calcTextareaHeight'

type State = {
  textareaStyle: { resize: string, height?: string }
}

export default class Input extends Component {
  state: State;

  static defaultProps = {
    type: 'text',
    autosize: false,
    rows: 2,
    trim: false,
    autoComplete: 'off'
  }

  constructor(props: Object) {
    super(props);

    this.state = {
      textareaStyle: { resize: props.resize }
    };
  }

  componentDidMount() {
    this.resizeTextarea();
  }

  /* <Instance Methods */

  focus(): void {
    setTimeout(() => {
      (this.refs.input || this.refs.textarea).focus();
    });
  }

  blur(): void {
    setTimeout(() => {
      (this.refs.input || this.refs.textarea).blur();
    });
  }

  /* Instance Methods> */

  fixControlledValue(value: mixed): mixed {
    if (typeof value === 'undefined' || value === null) {
      return '';
    }
    return value;
  }

  handleChange(e: SyntheticInputEvent<any>): void {
    const { onChange } = this.props;

    if (onChange) {
      onChange(e.target.value);
    }
    this.resizeTextarea();
  }

  handleFocus(e: SyntheticEvent<any>): void {
    const { onFocus } = this.props;
    if (onFocus) onFocus(e)
  }

  handleBlur(e: SyntheticEvent<any>): void {
    const { onBlur, trim } = this.props
    if (trim) this.handleTrim()
    if (onBlur) onBlur(e)
  }

  handleTrim(): void {
    const { onChange } = this.props;

    this.refs.input.value = this.refs.input.value.trim()
    if(onChange) {
      // this's for controlled components
      onChange(this.refs.input.value.trim())
    }
  }

  handlePrefixIconClick(e: SyntheticEvent<any>): void {
    const { onPrefixIconClick } = this.props;

    if (onPrefixIconClick) {
      onPrefixIconClick(e)
    }
  }

  handleSuffixIconClick(e: SyntheticEvent<any>): void {
    const { onSuffixIconClick } = this.props;

    if (onSuffixIconClick) {
      onSuffixIconClick(e)
    }
  }

  resizeTextarea(): void {
    const { autosize, type } = this.props;
    const { textareaStyle } = this.state;

    if (!autosize || type !== 'textarea') {
      return;
    }

    const minRows = autosize.minRows;
    const maxRows = autosize.maxRows;
    const textareaCalcStyle = calcTextareaHeight(this.refs.textarea, minRows, maxRows);

    this.setState({
      textareaStyle: Object.assign({}, textareaStyle, textareaCalcStyle)
    });
  }

  render(): React.DOM {
    const {
      type, size, prepend, append, prefixIcon, suffixIcon, autoComplete, validating, rows, trim,
      onMouseEnter, onMouseLeave, onPrefixIconClick, onSuffixIconClick,
      ...otherProps
    } = this.props;
    const { textareaStyle } = this.state;

    const classname = this.classNames(
      type === 'textarea' ? 'el-textarea' : 'el-input',
      size && `el-input--${size}`, {
        'is-disabled': otherProps.disabled,
        'el-input-group': prepend || append,
        'el-input-group--append': !!append,
        'el-input-group--prepend': !!prepend,
        'el-input--prefix': !!prefixIcon,
        'el-input--suffix': !!suffixIcon,
      }
    );

    if ('value' in this.props) {
      otherProps.value = this.fixControlledValue(otherProps.value);

      delete otherProps.defaultValue;
    }

    delete otherProps.resize;
    delete otherProps.style;
    delete otherProps.autosize;

    if (type === 'textarea') {
      return (
        <div style={this.style()} className={this.className(classname)}>
          <textarea { ...otherProps }
            ref="textarea"
            className="el-textarea__inner"
            style={textareaStyle}
            rows={rows}
            onChange={this.handleChange.bind(this)}
            onFocus={this.handleFocus.bind(this)}
            onBlur={this.handleBlur.bind(this)}
          />
        </div>
      )
    } else {
      const prefixIconClass = this.classNames('el-input__prefix', 'el-input__icon', prefixIcon, { 'is-clickable': !!onPrefixIconClick });
      const suffixIconClass = this.classNames('el-input__suffix', 'el-input__icon', suffixIcon, { 'is-clickable': !!onSuffixIconClick });
      return (
        <div style={this.style()} className={this.className(classname)} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
          { prepend && <div className="el-input-group__prepend">{prepend}</div> }
          { typeof prefixIcon === 'string' ? (
            <i
              className={prefixIconClass}
              onClick={this.handlePrefixIconClick.bind(this)}
              onKeyDown={this.handlePrefixIconClick.bind(this)}
            />
          ) : prefixIcon }
          <input { ...otherProps }
            ref="input"
            type={type}
            className="el-input__inner"
            autoComplete={autoComplete}
            onChange={this.handleChange.bind(this)}
            onFocus={this.handleFocus.bind(this)}
            onBlur={this.handleBlur.bind(this)}
          />
          { validating && <i className="el-input__icon el-icon-loading"></i> }
          { typeof suffixIcon === 'string' ? (
            <i
              className={suffixIconClass}
              onClick={this.handleSuffixIconClick.bind(this)}
              onKeyDown={this.handleSuffixIconClick.bind(this)}
            />
          ) : suffixIcon }
          { append && <div className="el-input-group__append">{append}</div> }
        </div>
      )
    }
  }
}

Input.propTypes = {
  // base
  type: PropTypes.string,
  prefixIcon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  suffixIcon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  disabled: PropTypes.bool,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
  autoFocus: PropTypes.bool,
  maxLength: PropTypes.number,
  minLength: PropTypes.number,
  defaultValue: PropTypes.any,
  value: PropTypes.any,
  trim: PropTypes.bool,

  // type !== 'textarea'
  size: PropTypes.oneOf(['small']),
  prepend: PropTypes.node,
  append: PropTypes.node,

  // type === 'textarea'
  autosize: PropTypes.oneOfType([ PropTypes.bool, PropTypes.object ]),
  rows: PropTypes.number,
  resize: PropTypes.oneOf(['none', 'both', 'horizontal', 'vertical']),

  // event
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onPrefixIconClick: PropTypes.func,
  onSuffixIconClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,

  // autoComplete
  autoComplete: PropTypes.string,
  inputSelect: PropTypes.func,

  // form related
  form: PropTypes.string,
  validating: PropTypes.bool,
}
