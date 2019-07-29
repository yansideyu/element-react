/* @flow */

import React from 'react';
import { Component, PropTypes } from '../../libs';

export default class DropdownItem extends Component {
  handleClick(e: any): void {
    const { onClick, command } = this.props;
    const { component } = this.context;
    if (!onClick) {
      component.handleMenuItemClick(command, this);
    } else {
      onClick(e, command);
      if (component.props.hideOnClick) {
        component.setState({
          visible: false
        });
      }
    }
  }

  render(): React.DOM {
    const { disabled, divided } = this.props;

    return (
      <li
        style={this.style()}
        className={this.className('el-dropdown-menu__item', {
          'is-disabled': disabled,
          'el-dropdown-menu__item--divided': divided
        })} onClick={this.handleClick.bind(this)}
      >
        { this.props.children }
      </li>
    )
  }
}

DropdownItem.contextTypes = {
  component: PropTypes.any
};

DropdownItem.propTypes = {
  command: PropTypes.string,
  disabled: PropTypes.bool,
  divided: PropTypes.bool,
  onClick: PropTypes.func,
};
