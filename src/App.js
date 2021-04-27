import React from "react";
import { useState, useEffect,useRef} from "react";
import { BrowserRouter, Link, Switch, Route } from 'react-router-dom';
// import { withRouter } from 'react-router';
import HeaderComponent from "./components/HeaderComponent";
import PostsComponent from "./components/PostsComponent";
import ImageUploadComponent from './components/ImageUploadComponent'
import StoriesBarComponent from './components/StoriesBarComponent'
import StoriesComponent from './components/StoriesComponent'

import { db,auth } from "./components/Firebase";
import '@fortawesome/fontawesome-free/css/all.min.css';
import "./App.css";

/** To work with font awesome use this:
 * yarn add @fortawesome/fontawesome-free  .............> install dependency
 * import '@fortawesome/fontawesome-free/css/all.min.css'; ...........> import this in app.js 
 */

const App = React.forwardRef((props, ref) => {
  const [posts, setPosts] = useState([]); // this hook is for displaying posts(images,captions,username)
  const myRef = useRef();
  const [loggedinUserDisplayName,setLoggedinUserDisplayName] = useState('') 

  const [stories,setStories] = useState([])

  useEffect(() => {
    console.log("**************1")
    const unsubscribe=db.collection("posts").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() })));
    });
    return () => {
      unsubscribe()
    };
  }, []);

  useEffect(() => {
    console.log("**************2")
    // // below if condition is used to set value of current logged inn user to loggedinUserDisplayName state variable
    // /** loggedinUserDisplayName can be added in dependency array */

    const unsubscribe= auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setLoggedinUserDisplayName(authUser.displayName);
      } else {
        setLoggedinUserDisplayName(null);
      }
    });
    return () => {
      unsubscribe()
    };
  }, [loggedinUserDisplayName]);

   useEffect(() => {
    console.log("**************3")
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

    console.log("stories",stories)
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
            {/* {stories.map((story) => {
              return (
                <StoriesBarComponent
                  key={story.id}
                  stories={story.story}
                  storyId={story.id}
                />
              );
            })} */}
            {/* {
              we always need to send " {...props} " to a component if we want to access props.match.params in the component
            } */}
            <StoriesBarComponent {...props} stories={stories} loggedinUserDisplayName={loggedinUserDisplayName}/>
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

            {loggedinUserDisplayName ? (
              <ImageUploadComponent />
            ) : (
              "Please login to upload image"
            )}
          </div>
        </Route>
        {/* <Route path="/:username/stories"><StoriesComponent/></Route> */}
        {/* <Route path="/stories" component={StoriesComponent}/> */}
        {/* <Route path="/:username/stories" component={()=>(<StoriesComponent stories={stories}/>)}/> */}
        <Route path="/:username/stories" render={(props) => <StoriesComponent {...props} stories={stories}/>}/>
        
      </Switch>
    </BrowserRouter>
  );
})
export default App;


// function App() {
//   const [posts, setPosts] = useState([]); // this hook is for displaying posts(images,captions,username)
//   const myRef = useRef();
//   const [loggedinUserDisplayName,setLoggedinUserDisplayName] = useState('') // THIS STATE VARIABLE IS OBSOLETE, as we are using "firebase.auth().currentUser.displayName" to get current logged in user

//   useEffect(() => {
//     db.collection("posts").onSnapshot((snapshot) => {
//       setPosts(snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() })));
//     });

//     // // below if condition is used to set value of current logged inn user to loggedinUserDisplayName state variable
//     // /** loggedinUserDisplayName can be added in dependency array */
  
    
//   }, []);
//   // console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&",myRef && myRef.current.getMyState()?myRef.current.getMyState().displayName:'sonali')

//   useEffect(() => {
//     if (
//       myRef &&
//       myRef.current &&
//       myRef.current.getMyState()
//     ) {
//       setLoggedinUserDisplayName(myRef.current.getMyState().displayName);
//       console.log(myRef.current.getMyState().displayName)
//     }
//   }, [loggedinUserDisplayName])

  
//   return (
//     <div className="app-container">
//       {console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@loggedinUserDisplayName",loggedinUserDisplayName)}
//       {console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@myRef.current.getMyState().displayName",
//       myRef &&myRef.current &&myRef.current.getMyState()? myRef.current.getMyState().displayName:'qwerty123')}
//       <HeaderComponent ref={myRef}/>
//       {posts.map((post) => {
//         return (
//           <PostsComponent
//             key={post.id}
//             postid={post.id}
//             caption={post.post.caption}
//             imageurl={post.post.imageurl}
//             username={post.post.username}
//           />
//         );
//       })}

//       {myRef &&myRef.current &&myRef.current.getMyState()&& myRef.current.getMyState().displayName ?<ImageUploadComponent/> :"Please login to upload image"}

//       {/* {firebase.auth().currentUser && firebase.auth().currentUser.displayName ?
//       <ImageUploadComponent/>
//        :
//        "Please login to upload image"
//        } */}

      
//     </div>
//   );
// }
