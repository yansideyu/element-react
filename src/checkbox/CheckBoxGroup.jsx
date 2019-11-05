/* @flow */

import React from "react";
import { Component, PropTypes, LazyList } from "../../libs";

type State = {
  options: Array<string | number>
};

export default class CheckboxGroup extends Component {
  state: State;

  constructor(props: Object) {
    super(props);

    this.state = {
      options: this.props.value || []
    };
  }

  componentWillReceiveProps(nextProps: Object): void {
    if (nextProps.value !== this.props.value) {
      this.setState({
        options: nextProps.value
      });
    }
  }

  getChildContext(): { ElCheckboxGroup: CheckboxGroup } {
    return {
      ElCheckboxGroup: this
    };
  }

  onChange(value: string | number, checked: boolean): void {
    const { onChange } = this.props;
    const { options: oldOptions } = this.state;
    const index = oldOptions.indexOf(value);
    let newOption = [...oldOptions];

    if (checked) {
      if (index === -1) {
        newOption = [...newOption, value];
      }
    } else {
      newOption.splice(index, 1);
    }

    this.setState({ options: newOption });

    if (onChange) {
      onChange(newOption);
    }
  }

  renderCheckboxes() {
    const { children } = this.props;
    const { options } = this.state;

    return React.Children.map(children, (child) => {
      const isCheckbox = ['Checkbox', 'CheckboxButton'].includes(child.type.elementType);
      let renderOption = null;

      if (isCheckbox) {
        renderOption = React.cloneElement(
          child,
          {
            ...child.props,
            checked:
              child.props.checked ||
              options.indexOf(child.props.value) >= 0 ||
              options.indexOf(child.props.label) >= 0,
            onChange: this.onChange.bind(
              this,
              child.props.value
                ? child.props.value
                : child.props.value === 0
                ? 0
                : child.props.label
            )
          },
        );
      }

      return renderOption;
    });
  }

  renderLazyList() {
    const { children } = this.props;
    return (
      <LazyList renderItemSize={30} key={React.Children.toArray(children).length}>
        {this.renderCheckboxes()}
      </LazyList>
    );
  }

  render(): React.DOM {
    const { isLazy } = this.props;
    return (
      <div style={this.style()} className={this.className("el-checkbox-group")}>
        {!isLazy
          ? this.renderCheckboxes()
          : this.renderLazyList()}
      </div>
    );
  }
}

CheckboxGroup.childContextTypes = {
  ElCheckboxGroup: PropTypes.any
};

CheckboxGroup.propTypes = {
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  size: PropTypes.string,
  fill: PropTypes.string,
  textColor: PropTypes.string,
  value: PropTypes.any,
  isLazy: PropTypes.bool,
  onChange: PropTypes.func
};
