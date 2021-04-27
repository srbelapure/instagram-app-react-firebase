import ModalComponent from './ModalComponent'
import React from "react";

const HeaderComponent = React.forwardRef((props, ref) => {
  /* If we type "ref.current.getMyState().displayName" then we can see current logged in user name
  * we are using forwardRef to achieve the state value from a child component to parent component(i.e; from modal comp to header comp)
  */

  // useImperativeHandle(
  //   ref,
  //   () => ({
  //     getMyState: () => {
  //       return ref.current.getMyState().displayName;
  //     },
  //   }),
  //   []
  // );
  
  return (
    <div className="header-container">
      <img
          className="header-image"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          height="40px"
          alt=""
        />
      <ModalComponent ref={ref} loggedinUserDisplayName={props.loggedinUserDisplayName}/>
    </div>
  );
})

export default HeaderComponent;
