import React, { Component } from 'react';
import { SocialIcon } from 'react-social-icons';

export default class ContentFormNetworks extends Component {
  constructor(props) {
    super(props);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
  };

  handleMouseDown (event) {
    event.preventDefault();
    event.stopPropagation();
    this.props.onSelect(this.props.option, event);
  };

  handleMouseEnter (event) {
    this.props.onFocus(this.props.option, event);
  };

  handleMouseMove (event) {
    if (this.props.isFocused) return;
    this.props.onFocus(this.props.option, event);
  };

  render() {
    let socialIconStyle = {
      display: 'inline-block',
      marginRight: 10,
      position: 'relative',
      top: -2,
      verticalAlign: 'middle',
      height: 30,
      width: 30
    };

    return (
      <div className={this.props.className}
           onMouseEnter={this.handleMouseEnter}
           onMouseDown={this.handleMouseDown}
           onMouseMove={this.handleMouseMove}>
        <SocialIcon style={socialIconStyle} url={this.props.option.url}/>
        {this.props.children}
      </div>
    )
  };
};
