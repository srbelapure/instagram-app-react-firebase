import React from "react";
import { useState, useEffect ,useImperativeHandle} from "react";
import { auth } from "./Firebase";
import { Modal, Button, makeStyles, Input } from "@material-ui/core";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%) `,
  };
}

//makeStyles -> is a hook
const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));
const ModalComponent = React.forwardRef((props, ref) => {

  const classes = useStyles();
  const [openSignIn, setOpenSignIn] = useState(false); // to open and close Sign in modal
  const [openSignUp, setOpenSignUp] = useState(false); // to open and close Sign in modal
  const [modalStyle] = useState(getModalStyle);
  const [username, setUsername] = useState(""); // state for username field while logging in
  const [password, setPassword] = useState(""); // state for password field while logging in
  const [email, setEmail] = useState(""); // state for email field while logging in
  const [user, setUser] = useState(null); // To keep track of user we use this state (logged-in user)

  useImperativeHandle(
    ref,
    () => ({
      getMyState: () => {
        return user;
      },
    }),
    [user]
  );

  useEffect(() => {
    //onAuthStateChanged => listens for every single time authentication change happens(login,logout,create user)
    //authUser => survives a refresh, as it checks user cookie and is persistent
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //if user has logged inn
        setUser(authUser);

        // This if-else failed to update displayName, so weare setting it up at the point of creating user with createUserWithEmailAndPassword
        // if (authUser.displayName) {
        //   //if user has a displayName then donot update username, as person is already logged-inn
        // } else {
        //   // if we have a fresh user/ fresh logged-in user then we are using the username state value and updating displayName
        //   return authUser.updateProfile({
        //     displayName: username,
        //   });
        // }
      } else {
        // if user has loggedd out
        setUser(null); // if user logs out set user to null
      }
    });
    return () => {
      // whenever changes occue this hook is refired, but before that clean-up the existing case and then re-trigger
      unsubscribe();
    };
  }, [user, username]); // user,username => because everytime values change we need to trigger the useEffect hook

  const onSignUp = (e) => {
    e.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password) // email,password -> these are values from state
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username, //when user is created then add the username value to displayName attribute
        });
      })
      .catch((error) => alert(error.message));
    setOpenSignUp(false);
  };

  const onSignIn = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    setOpenSignIn(false);
  };

  return (
    <div>
      <div className="header-buttons-section xs-12 sm-6">
        {user ? (
          <Button
            onClick={() => auth.signOut()}
            color="secondary"
            variant="contained"
            style={{marginRight:5}}
            className="log-out-button"
          >
            Log Out
          </Button>
        ) : (
          <React.Fragment>
            <Button
              color="secondary"
              variant="contained"
              onClick={() => setOpenSignIn(true)}
              style={{marginRight:5}}
            >
              Sign In
            </Button>
            <Button
              color="secondary"
              variant="contained"
              onClick={() => setOpenSignUp(true)}
              style={{marginRight:5}}
            >
              Sign Up
            </Button>
          </React.Fragment>
        )}
      </div>

      <Modal open={openSignUp} onClose={() => setOpenSignUp(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="form-on-modal" onSubmit={onSignUp}>
            <center>
              <img
                src="https://lh3.googleusercontent.com/2sREY-8UpjmaLDCTztldQf6u2RGUtuyf6VT5iyX3z53JS4TdvfQlX-rNChXKgpBYMw"
                height="40px"
                alt=""
              />
            </center>
            <Input
              type="text"
              name="username"
              placeholder="Enter a user-name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type="text"
              name="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              name="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" color="secondary" variant="contained" style={{marginTop:10}}>
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>

      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="form-on-modal" onSubmit={onSignIn}>
            <center>
              <img
                src="https://lh3.googleusercontent.com/2sREY-8UpjmaLDCTztldQf6u2RGUtuyf6VT5iyX3z53JS4TdvfQlX-rNChXKgpBYMw"
                height="40px"
                alt=""
              />
            </center>
            <Input
              type="text"
              name="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              name="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" color="secondary" variant="contained" style={{marginTop:10}}>
              Sign In
            </Button>
          </form>
        </div>
      </Modal>
    </div>
  );
});
export default ModalComponent;
