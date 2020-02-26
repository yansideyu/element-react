/* @flow */

import React from 'react';
import { Component, PropTypes } from '../../libs';

export default class Step extends Component {
  static defaultProps = {
    status: 'wait'
  };

  constructor(props: Object) {
    super(props);
    this.state = {
      offsetLeft: 0,
      borderWidth: 0,
      lineLeft: 0,
      lineRight: 0,
    };
  }

  componentDidMount() {
    this.setOffsetLeft();
  }

  componentDidUpdate() {
    this.setOffsetLeft();
  }

  get iconStyle() {
    const { direction } = this.props;
    const { offsetLeft } = this.state;
    if (direction === 'horizontal') {
      return {
        left: `${offsetLeft}px`,
      };
    }
    return {};
  }

  get lineStyle() {
    const { direction } = this.props;
    const { lineLeft, lineRight } = this.state;
    if (direction === 'horizontal') {
      return {
        left: `${lineLeft}px`,
        right: `${lineRight}px`,
      };
    }
    return {};
  }

  setOffsetLeft() {
    if (this.refs.$icon && this.refs.title) {
      const { offsetLeft: stateLeft, borderWidth: stateBorder } = this.state;

      const iconOuterWidth = this.refs.$icon.offsetWidth;
      const iconInnerWidth = this.refs.$icon.clientWidth;
      const titleWidth = this.refs.title.offsetWidth;
      const offsetLeft = (titleWidth - iconOuterWidth) / 2;
      const borderWidth = iconOuterWidth - iconInnerWidth;

      if (offsetLeft !== stateLeft || borderWidth !== stateBorder) {
        this.setState({ offsetLeft, borderWidth });
      }
    }
  }

  setLinePosition(nextStepRight: number) {
    const iconEl = this.refs.$icon;
    if (iconEl) {
      const { offsetLeft } = this.state;
      const iconWidth = iconEl.offsetWidth;
      this.setState({
        lineLeft: iconWidth + offsetLeft,
        lineRight: -nextStepRight,
      });
    }
  }

  render(): React.DOM {
    const {
      title,
      icon,
      description,
      status,
      direction,
      style,
      lineStyle,
      stepNumber
    } = this.props;
    const directionClass = `is-${direction}`;
    const statusClass = `is-${status}`;
    const iconNode = icon
      ? <i className={`el-icon-${icon}`} />
      : <div>{stepNumber}</div>;

    return (
      <div
        ref="$el"
        style={this.style(style)}
        className={this.className('el-step', directionClass)}
      >
        <div
          className={this.classNames('el-step__head', statusClass, {
            'is-text': !icon
          })}
        >
          <div
            className={this.classNames('el-step__line', directionClass, {
              'is-icon': icon
            })}
            style={this.lineStyle}
          >
            <i className="el-step__line-inner" style={lineStyle} />
          </div>
          <span ref="$icon" className="el-step__icon" style={this.iconStyle}>
            {status !== 'success' && status !== 'error'
              ? iconNode
              : <i
                  className={
                    'el-icon-' + (status === 'success' ? 'check' : 'close')
                  }
                />}
          </span>
        </div>
        <div className="el-step__main">
          <div
            ref="title"
            className={this.classNames('el-step__title', statusClass)}
          >
            {title}
          </div>
          <div className={this.classNames('el-step__description', statusClass)}>
            {description}
          </div>
        </div>
      </div>
    );
  }
}

Step.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  icon: PropTypes.string,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  status: PropTypes.string,
  direction: PropTypes.string,
  style: PropTypes.object,
  lineStyle: PropTypes.object,
  stepNumber: PropTypes.number
};
