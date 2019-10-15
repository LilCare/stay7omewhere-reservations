import React from'react';

class GuestsDropdown extends React.Component{
  constructor(props) {
    super(props)

    // this.handleClick = this.handleClick.bind(this);
  }

  // componentDidMount() {
  //   document.addEventListener('mousedown', this.handleClick, false);
  // }

  // componentWillUnmount() {
  //   document.removeEventListener('mousedown', this.handleClick, false);
  // }

  render() {


    return (
      <div ref={node => this.node = node} 
           className="guestsDropdown" id="guestsDropdown" style={{visibility: this.props.guestVisibility}}>
        <div id="adultGuestDropdown">
          Adults
          <button className="minusButton" id="adultMinus">-</button>
          <button className="addButton" id="adultAdd">+</button>
        </div>
        <div id="childGuestDropdown">
          Children
          <button className="minusButton" id="childMinus">-</button>
          <button className="addButton" id="childAdd">+</button>
        </div>
        <div id="infantGuestDropdown">
          Infants
          <button className="minusButton" id="infantMinus">-</button>
          <button className="addButton" id="infantAdd">+</button>
        </div>
        <div className="guestsDropdownFooter" id="guestsDropdownFooter">
          XX guests maximum. Infants don't count toward the number of guests.
        </div>
        <div id="closeGuestDropdown">
          <button className="guestsCloseButton" id="guestsCloseButton">Close</button>
        </div>
      </div>
    );
  }
  
  // handleClick(e) {
  //   if (this.props.guestVisibility === "visible" && !this.node.contains(e.target)) {
  //     console.log(this.node);
  //     console.log(e);
  //     this.props.toggleGuestsDropdown();
  //   }
  // }
}

export default GuestsDropdown;