/* eslint-disable */
import React, { Component, isValidElement, Children } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import requestAnimationFrame from 'raf';
import { addClass, removeClass } from '../utils/dom';

export default class Transition extends Component {
  constructor(props) {
    super(props);

    this.isShow = this.isChildrenShow(props.children);

    this.state = {
      children: this.getEnhanceChildren(props.children),
    };
    this.didEnter = this.didEnter.bind(this);
    this.didLeave = this.didLeave.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const children = this.getEnhanceChildren(nextProps.children);
    this.setState({ children });
  }

  componentDidUpdate(preProps) {
    const children = isValidElement(this.props.children) && Children.only(this.props.children);
    const preChildren = isValidElement(preProps.children) && Children.only(preProps.children);
    // 用销毁组件的方式，来展示动画
    const isCreateChildren = !preChildren && children;
    const isDestroyChildren = preChildren && !children;
    // 配合View组件的show属性变化，来展示动画
    const isViewComponent = this.isViewComponent(children);
    const isViewShow = isViewComponent && (!preChildren || !preChildren.props.show) && children.props.show;
    const isViewHide = isViewComponent && preChildren && preChildren.props.show && !children.props.show;

    const isActiveChildren = isCreateChildren || isViewShow;
    const isDisableChildren = isDestroyChildren || isViewHide;

    if (isActiveChildren) {
      this.toggleVisible();
    } else if (isDisableChildren) {
      this.toggleHidden();
    }
  }

  get transitionClass() {
    const { name } = this.props;
    return {
      enter: name ? `${name}-enter` : '',
      enterActive: name ? `${name}-enter-active` : '',
      enterTo: name ? `${name}-enter-to` : '',
      leave: name ? `${name}-leave` : '',
      leaveActive: name ? `${name}-leave-active` : '',
      leaveTo: name ? `${name}-leave-to` : '',
    };
  }

  getEnhanceChildren(children) {
    if (children) {
      const isViewComponent = this.isViewComponent(children);
      const props = isViewComponent ? { show: this.isShow } : {};
      return this.enhanceChildren(children, props);
    }
    return null;
  }

  enhanceChildren(children, props) {
    return React.cloneElement(children, Object.assign({ ref: (el) => { this.el = el } }, props))
  }

  isChildrenShow(children) {
    if (children) {
      const childrenOnly = isValidElement(children) && Children.only(children);
      return childrenOnly.props.show;
    }
    return false;
  }

  isViewComponent(element) {
    return element && element.type._typeName === 'View';
  }

  didEnter(e: SyntheticKeyboardEvent<any>) {
    const { onAfterEnter, children } = this.props;
    const { enterActive, enterTo } = this.transitionClass;
    const childDOM = ReactDOM.findDOMNode(this.el);

    if (e && e.target === childDOM) {
      addClass(childDOM, enterTo);
      removeClass(childDOM, enterActive);

      childDOM.removeEventListener('transitionend', this.didEnter);
      childDOM.removeEventListener('animationend', this.didEnter);

      onAfterEnter && onAfterEnter();

      requestAnimationFrame(() => {
        removeClass(childDOM, enterTo);
      });
    }
  }

  didLeave(e: SyntheticKeyboardEvent<any>) {
    const { onAfterLeave, children } = this.props;
    const { leaveActive, leaveTo } = this.transitionClass;
    const childDOM = ReactDOM.findDOMNode(this.el);

    if (e && e.target === childDOM) {
      addClass(childDOM, leaveTo);
      removeClass(childDOM, leaveActive);

      if (this.isViewComponent(children)) {
        childDOM.style.display = 'none';
      }

      childDOM.removeEventListener('transitionend', this.didLeave);
      childDOM.removeEventListener('animationend', this.didLeave);

      onAfterLeave && onAfterLeave();

      requestAnimationFrame(() => {
        removeClass(childDOM, leaveTo);
      });
    }
  }

  toggleVisible() {
    const { onEnter, children } = this.props;
    const { enter, enterActive, leaveActive, leaveTo } = this.transitionClass;
    const childDOM = ReactDOM.findDOMNode(this.el);
    const isViewComponent = this.isViewComponent(children);

    if (leaveActive && leaveTo) {
      const isLeaveAnimation = childDOM.classList.contains(leaveActive) ||
      childDOM.classList.contains(leaveTo);

      // when leave transition not end
      if (isLeaveAnimation) {
        removeClass(childDOM, leaveActive, leaveTo);

        childDOM.removeEventListener('transitionend', this.didLeave);
        childDOM.removeEventListener('animationend', this.didLeave);
      }
    }

    // 防止display样式造成enter过渡样式的冲突
    if (enter && enterActive) {
      requestAnimationFrame(() => {
        childDOM.addEventListener('transitionend', this.didEnter);
        childDOM.addEventListener('animationend', this.didEnter);

        addClass(childDOM, enter);
        if (isViewComponent) {
          childDOM.style.display = '';
        }
        onEnter && onEnter();

        requestAnimationFrame(() => {
          removeClass(childDOM, enter);
          addClass(childDOM, enterActive);
        });
      });
    }
  }

  toggleHidden() {
    const { onLeave } = this.props;
    const { leave, leaveActive, leaveTo, enterActive, enterTo } = this.transitionClass;
    const childDOM = ReactDOM.findDOMNode(this.el);
    if (enterActive && enterTo) {
      const isEnterAnimation = childDOM.classList.contains(enterActive) ||
      childDOM.classList.contains(enterTo);

      // when enter transition not end
      if (isEnterAnimation) {
        removeClass(childDOM, enterActive, enterTo);

        childDOM.removeEventListener('transitionend', this.didEnter);
        childDOM.removeEventListener('animationend', this.didEnter);
      }
    }
    if (leave) {
      addClass(childDOM, leave);
    }
    onLeave && onLeave();
    if (leave && leaveActive) {
      requestAnimationFrame(() => {
        childDOM.addEventListener('transitionend', this.didLeave);
        childDOM.addEventListener('animationend', this.didLeave);

        removeClass(childDOM, leave);
        addClass(childDOM, leaveActive);
      });
    } else {
      childDOM.style.display = 'none';
    }
  }

  render() {
   return this.state.children || null;
  }
}

Transition.propTypes = {
  name: PropTypes.string,
  onEnter: PropTypes.func, // triggered when enter transition start
  onAfterEnter: PropTypes.func, // triggered when enter transition end
  onLeave: PropTypes.func, // triggered when leave transition start
  onAfterLeave: PropTypes.func // tiggered when leave transition end
};
