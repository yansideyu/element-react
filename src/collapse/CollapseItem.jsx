/* @flow */

import React from 'react';
import { Component, PropTypes, CollapseTransition } from '../../libs';

export default class CollapseItem extends Component {
  constructor(props: Object) {
    super(props);
  }

  render(): React.DOM {
    const { title, isActive, onClick, name, renderIcon } = this.props;

    return (
      <div
        className={this.classNames({
          'el-collapse-item': true,
          'is-active': isActive
        })}
      >
        <div className="el-collapse-item__header" onClick={() => onClick(name)}>
          {renderIcon
            ? renderIcon(isActive)
            : <i className="el-collapse-item__header__arrow el-icon-arrow-right" />}
          {title}
        </div>
        <CollapseTransition isShow={isActive}>
          <div className="el-collapse-item__wrap">
            <div className="el-collapse-item__content">
              {this.props.children}
            </div>
          </div>
        </CollapseTransition>
      </div>
    );
  }
}

CollapseItem.propTypes = {
  onClick: PropTypes.func,
  isActive: PropTypes.bool,
  title: PropTypes.node,
  renderIcon: PropTypes.func,
  name: PropTypes.string
};
