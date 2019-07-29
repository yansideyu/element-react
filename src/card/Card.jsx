/* @flow */

import React from 'react';
import { Component, PropTypes } from '../../libs';

export default class Card extends Component {
  render(): React.DOM {
    const { header, bodyStyle, children, type } = this.props;
    return (
      <div style={this.style()} className={this.className('el-card', type && `el-card--${type}`)}>
        {header && (
          <div className="el-card__header">{ header }</div>
        )}
        <div className="el-card__body" style={ bodyStyle }>
          { children }
        </div>
      </div>
    )
  }
}

Card.propTypes = {
  header: PropTypes.node,
  type: PropTypes.oneOf([null, 'primary']),
  bodyStyle: PropTypes.object
};
