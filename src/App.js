import React from "react";
import { useState, useEffect,useRef} from "react";
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import HeaderComponent from "./components/HeaderComponent";
import PostsComponent from "./components/PostsComponent";
import ImageUploadComponent from './components/ImageUploadComponent'
import StoriesBarComponent from './components/StoriesBarComponent'
import StoriesComponent from './components/StoriesComponent'

import { db,auth } from "./components/Firebase";
import '@fortawesome/fontawesome-free/css/all.min.css'; // we need this file for font-awesome icons to work with our application
import "./App.css";

/** To work with font awesome use this:
 * yarn add @fortawesome/fontawesome-free  .............> install dependency
 * import '@fortawesome/fontawesome-free/css/all.min.css'; ...........> import this in app.js 
 */

const App = React.forwardRef((props, ref) => {
  const [posts, setPosts] = useState([]); // this hook is for displaying posts(images,captions,username)
  const myRef = useRef();
  const [loggedinUserDisplayName,setLoggedinUserDisplayName] = useState('') 
  const [uid,setUid] = useState(null)

  const [stories,setStories] = useState([])

  useEffect(() => {
    const unsubscribe=db.collection("posts").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() })));
    });
    return () => {
      unsubscribe()
    };
  }, []);

  useEffect(() => {
    // // below if condition is used to set value of current logged inn user to loggedinUserDisplayName state variable
    // /** loggedinUserDisplayName can be added in dependency array */

    const unsubscribe= auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUid(authUser.uid)
        setLoggedinUserDisplayName(authUser.displayName);
      } else {
        setLoggedinUserDisplayName(null);
      }
    });
    return () => {
      unsubscribe()
    };
  }, [loggedinUserDisplayName,uid]);

   useEffect(() => {
     const unsubscribe = db.collection("stories")
     .onSnapshot((snapshot) => {
       setStories(
         snapshot.docs.map((doc) => 
          ({ id: doc.id, story: doc.data() })
         )
       );
     });
     
     return () => {
       unsubscribe()
     };
   }, []);

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          {" "}
          <div className="app-container">
            <HeaderComponent
              ref={myRef}
              loggedinUserDisplayName={loggedinUserDisplayName}
            />
            {/* {
              we always need to send " {...props} " to a component if we want to access props.match.params in the component
            } */}

            {loggedinUserDisplayName ? (
              <>
                <StoriesBarComponent
                  {...props}
                  stories={stories}
                  loggedinUserDisplayName={loggedinUserDisplayName}
                  uid={uid}
                />
                <ImageUploadComponent />
              </>
            ) : (
              <div className="message-for-logged-out-user">
                <h3>This is an Instagram clone app</h3>
                <div>Sign In / Sign Up to create posts/add stories</div>
              </div>
            )}

            {posts.map((post) => {
              return (
                <PostsComponent
                  key={post.id}
                  postid={post.id}
                  caption={post.post.caption}
                  imageurl={post.post.imageurl}
                  username={post.post.username}
                  loggedinUserDisplayName={loggedinUserDisplayName}
                />
              );
            })}
          </div>
        </Route>
        {/* <Route path="/:username/stories"><StoriesComponent/></Route> */}
        {/* <Route path="/stories" component={StoriesComponent}/> */}
        {/* <Route path="/:username/stories" component={()=>(<StoriesComponent stories={stories}/>)}/> */}
        <Route
          path="/:username/stories"
          render={(props) => <StoriesComponent {...props} stories={stories} />}
        />
      </Switch>
    </BrowserRouter>
  );
})
export default App;