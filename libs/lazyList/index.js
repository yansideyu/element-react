import React, { Children, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { getParentScroll } from '../utils/domHelper';

/* eslint-disable react/jsx-filename-extension */
export default class LazyList extends PureComponent {
  static elementType = 'LazyList';

  static propTypes = {
    children: PropTypes.node,
    scale: PropTypes.string,
    renderItemSize: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.number,
    ]),
    isHorizontal: PropTypes.bool,
  };

  static defaultProps = {
    isHorizontal: false,
    scale: 'px',
  };

  constructor(props) {
    super(props);
    this.state = {
      scrollTop: 0,
      parentScroll: null,
    };
    this.parentScroll = null;
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    this.bindEvents();
  }

  componentDidUpdate() {
    this.removeEvents();
    this.bindEvents();
  }

  get listStyle() {
    const { children, renderItemSize, isHorizontal, scale } = this.props;

    const value = children.reduce((totalSize, child, idx) => {
      const size = typeof renderItemSize === 'number' ? renderItemSize : renderItemSize(child, idx);
      return totalSize + size;
    }, 0);
    const height = !isHorizontal ? `${value}${scale}` : null;
    const width = isHorizontal ? `${value}${scale}` : null;

    return { height, width, position: 'relative' };
  }

  bindEvents() {
    const parentScroll = getParentScroll(this.refs.$list);

    if (parentScroll && this.parentScroll !== parentScroll) {
      this.setState({ parentScroll });
      parentScroll.addEventListener('scroll', this.handleScroll);
      this.handleScroll({ target: parentScroll });
    }
  }

  removeEvents() {
    const { parentScroll } = this.state;
    if (parentScroll) {
      parentScroll.removeEventListener('scroll', this.handleScroll);
      this.setState({ parentScroll: null });
    }
  }

  handleScroll(event) {
    clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      const { scrollTop } = event.target;
      this.setState({ scrollTop });
    }, 10);
  }

  render() {
    const { isHorizontal, renderItemSize, scale, children } = this.props;
    const { parentScroll, scrollTop } = this.state;
    let offset = 0;

    return (
      <div style={this.listStyle} ref="$list">
        {parentScroll && Children.map(children, (child, idx) => {
          const { clientHeight: scrollSize } = parentScroll;
          const itemSize = typeof renderItemSize === 'number' ? renderItemSize : renderItemSize(child, idx);

          let childComponent = null;

          if (offset + itemSize >= scrollTop && offset <= scrollTop + scrollSize) {
            childComponent = React.cloneElement(child, {
              ...child.props,
              style: {
                position: 'absolute',
                width: !isHorizontal ? '100%' : null,
                boxSizing: !isHorizontal ? 'border-box' : null,
                top: !isHorizontal ? `${offset}${scale}` : null,
                ...child.props.style,
              }
            });
          }

          offset += itemSize;

          return childComponent;
        })}
      </div>
    );
  }
}
