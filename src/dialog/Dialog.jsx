/* @flow */

import React, { Fragment } from 'react';
import { Component, View, Transition, PropTypes } from '../../libs';
import { MountBody } from './MountBody';
import { cleanScrollBar } from '../table/utils';
import { notifyDialogClose, notifyDialogOpen } from '../../libs/utils/cloud';

type State = {
  bodyOverflow: string,
  isShowBody: boolean,
}

notifyDialogClose();

export default class Dialog extends Component {
  state: State;

  static defaultProps = {
    visible: false,
    title: '',
    size: 'small',
    top: '15%',
    modal: true,
    lockScroll: true,
    closeOnClickModal: true,
    closeOnPressEscape: true,
    showClose: true,
    appendToBody: false,
  }

  constructor(props: Object) {
    super(props);
    this.wrap = React.createRef();
    this.state = {
      bodyOverflow: '',
      isShowBody: props.visible,
    }
    this.toggleBodyVisiable(props.visible);
  }

  componentWillReceiveProps(nextProps: Object): void {
    const { bodyOverflow } = this.state;
    const { lockScroll, modal } = this.props;
    if (this.willOpen(this.props, nextProps)) {
      cleanScrollBar();
      notifyDialogOpen();
      if (lockScroll && document.body && document.body.style) {
        if (!bodyOverflow) {
          this.setState({
            bodyOverflow: document.body.style.overflow
          });
        }
        document.body.style.overflow = 'hidden';
      }
      this.toggleBodyVisiable(true);
    }

    if (this.willClose(this.props, nextProps) && lockScroll) {
      notifyDialogClose();
      if (modal && bodyOverflow !== 'hidden' && document.body && document.body.style) {
        document.body.style.overflow = bodyOverflow;
      }
      this.toggleBodyVisiable(false);
    }

  }

  componentDidUpdate(prevProps: Object): void {
    if (this.willOpen(prevProps, this.props)) {
      this.wrap.current.focus();
    }
  }

  componentWillUnmount(): void {
    const { lockScroll } = this.props;
    if (lockScroll && document.body && document.body.style) {
      document.body.style.removeProperty('overflow');
    }
  }

  onKeyDown(e: SyntheticKeyboardEvent<any>): void {
    const { closeOnPressEscape } = this.props;
    if (closeOnPressEscape && e.keyCode === 27) {
      this.close(e);
    }
  }

  handleWrapperClick(e: SyntheticEvent<HTMLDivElement>): void {
    const { closeOnClickModal } = this.props;
    if (e.target instanceof HTMLDivElement) {
      if (closeOnClickModal && e.target === e.currentTarget) {
        this.close(e);
      }
    }
  }

  toggleBodyVisiable(isShowBody: boolean) {
    setTimeout(() => {
      this.setState({ isShowBody });
    }, !isShowBody ? 200 : 0);
  }

  close(e: any): void {
    this.props.onCancel(e);
  }

  willOpen(prevProps: Object, nextProps: Object): boolean {
    return (!prevProps.visible && nextProps.visible);
  }

  willClose(prevProps: Object, nextProps: Object): boolean {
    return (prevProps.visible && !nextProps.visible);
  }

  renderDialog() {
    const { visible, title, size, top, modal, customClass, showClose, children } = this.props;
    const { isShowBody } = this.state;
    return (
      <Fragment>
        <Transition name="dialog-fade">
          <View show={visible}>
            <div
              ref={this.wrap}
              style={{ zIndex: 1013 }}
              className={this.classNames('el-dialog__wrapper')}
              onClick={e => this.handleWrapperClick(e)}
              onKeyDown={e => this.onKeyDown(e)}
            >
              <div
                ref="dialog"
                style={this.style(size === 'full' ? {} : { 'top': top })}
                className={this.className("el-dialog", `el-dialog--${ size }`, customClass)}
              >
                <div className="el-dialog__header">
                  <span className="el-dialog__title">{title}</span>
                  {
                    showClose && (
                      <button type="button" className="el-dialog__headerbtn" onClick={e => this.close(e)}>
                        <i className="el-dialog__close el-icon el-icon-close" />
                      </button>
                    )
                  }
                </div>
                {isShowBody && children}
              </div>
            </div>
          </View>
        </Transition>
        {
          modal && (
            <Transition name="fade-in-linear">
              <View show={visible}>
                <div className="v-modal" style={{ zIndex: 1012 }} />
              </View>
            </Transition>
          )
        }
      </Fragment>
    );
  }

  render(): React.DOM {
    const { appendToBody } = this.props;
    return appendToBody
      ? <MountBody>{this.renderDialog()}</MountBody>
      : <div>{this.renderDialog()}</div>;
  }
}

Dialog.propTypes = {
  // 控制对话框是否可见
  visible: PropTypes.bool,
  // 标题
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
  // 大小 (tiny/small/large/full)
  size: PropTypes.string,
  // top 值（仅在 size 不为 full 时有效）
  top: PropTypes.string,
  // 控制遮罩层展示
  modal: PropTypes.bool,
  // Dialog 的自定义类名
  customClass: PropTypes.string,
  // 是否在 Dialog 出现时将 body 滚动锁定
  lockScroll: PropTypes.bool,
  // 是否可以通过点击 modal 关闭 Dialog
  closeOnClickModal: PropTypes.bool,
  // 是否可以通过按下 ESC 关闭 Dialog
  closeOnPressEscape: PropTypes.bool,
  // 点击遮罩层或右上角叉或取消按钮的回调
  onCancel: PropTypes.func.isRequired,
  showClose: PropTypes.bool,
  appendToBody: PropTypes.bool,
  beforeOpen: PropTypes.func,
  beforeClose: PropTypes.func
};
