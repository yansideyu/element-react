/* @flow */

import React from 'react';
import { Component, PropTypes, Transition, View } from '../../libs';

export default class Tag extends Component {
  constructor(props: Object) {
    super(props);

    this.state = {
      visible: true
    };
    this.handleIconClick = this.onIconClick.bind(this)
  }

  handleClose(event?: SyntheticEvent<any>): void {
    if (event) {
      event.stopPropagation();
    }
    this.setState({
      visible: false
    }, () => {
      if (this.props.onClose) {
        this.props.onClose();
      }
    });
  }

  onIconClick(event: SyntheticEvent<any>): void {
    const { onIconClick = (event: SyntheticEvent<any>) => {} } = this.props;
    event.stopPropagation();
    onIconClick(event);
  }

  render() {
    const { type, hit, closable, closeTransition, color, icon, onIconClick } = this.props;

    return(
      <Transition name={closeTransition ? '' : 'el-zoom-in-center'}>
        <View key={this.state.visible} show={this.state.visible}>
          <span
            style={this.style({
              backgroundColor: color
            })}
            className={this.className('el-tag', type && `el-tag--${type}`, {
              'is-hit': hit
            })}
          >
            {icon && (
              <i className={this.className('el-tag--prefix', icon, onIconClick && 'clickable')} onClick={this.handleIconClick} />
            )}
            {this.props.children}
            {closable && (
              <i className="el-tag__close el-icon-close" onClick={this.handleClose.bind(this)}></i>
            )}
          </span>
        </View>
      </Transition>
    )
  }
}

Tag.propTypes = {
  closable: PropTypes.bool,
  type: PropTypes.string,
  hit: PropTypes.bool,
  color: PropTypes.string,
  closeTransition: PropTypes.bool,
  onClose: PropTypes.func,
  icon: PropTypes.string,
  onIconClick: PropTypes.func
}
