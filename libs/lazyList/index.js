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
    debounceMs: PropTypes.number,
    delayMs: PropTypes.number,
  };

  static defaultProps = {
    isHorizontal: false,
    scale: 'px',
    debounceMs: 10,
    delayMs: 0,
  };

  constructor(props) {
    super(props);
    this.state = {
      scrollTop: 0,
      parentHeight: 0,
      parentScroll: null,
    };
    this.handleScroll = this.handleScroll.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    const { delayMs } = this.props;
    setTimeout(() => {
      this.bindEvents();
      window.addEventListener('resize', this.handleResize);
    }, delayMs);
  }

  componentDidUpdate() {
    const { parentScroll: oldParentScroll, parentHeight: oldParentHeight } = this.state;
    const parentScroll = getParentScroll(this.refs.$list);
    const isParentScrollChange = parentScroll && oldParentScroll !== parentScroll;
    const isParentHeightChange = oldParentHeight !== parentScroll.clientHeight;

    if (isParentScrollChange || isParentHeightChange) {
      this.removeEvents();
      this.bindEvents();
    }
  }

  componentWillUnmount() {
    this.removeEvents();
    window.removeEventListener('resize', this.handleResize);
  }

  get listStyle() {
    const { children, renderItemSize, isHorizontal, scale } = this.props;

    const value = Children.toArray(children).reduce((totalSize, child, idx) => {
      const size = typeof renderItemSize === 'number' ? renderItemSize : renderItemSize(child, idx);
      return totalSize + size;
    }, 0);
    const height = !isHorizontal ? `${value}${scale}` : null;
    const width = isHorizontal ? `${value}${scale}` : null;

    return { height, width, position: 'relative' };
  }

  bindEvents() {
    const parentScroll = getParentScroll(this.refs.$list);

    this.setState({ parentScroll: parentScroll });
    parentScroll.addEventListener('scroll', this.handleScroll);
    this.handleScroll({ target: parentScroll });
  }

  removeEvents() {
    const parentScroll = getParentScroll(this.refs.$list);

    parentScroll.removeEventListener('scroll', this.handleScroll);
    this.setState({ parentScroll: null });
  }

  handleScroll(event) {
    const { debounceMs } = this.props;

    clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      const { scrollTop, clientHeight: parentHeight } = event.target;
      this.setState({ scrollTop, parentHeight });
    }, debounceMs);
  }

  handleResize() {
    const { parentScroll } = this.state;
    if (parentScroll) {
      this.handleScroll({ target: parentScroll });
    }
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
