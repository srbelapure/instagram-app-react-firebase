import React from "react";
import { useState, useEffect,useRef} from "react";
import HeaderComponent from "./components/HeaderComponent";
import PostsComponent from "./components/PostsComponent";
import ImageUploadComponent from './components/ImageUploadComponent'
//import StoriesBarComponent from './components/StoriesBarComponent'

import { db,auth } from "./components/Firebase";
import firebase from "firebase";
import '@fortawesome/fontawesome-free/css/all.min.css';
import Stories from "react-insta-stories";
import "./App.css";

/** To work with font awesome use this:
 * yarn add @fortawesome/fontawesome-free  .............> install dependency
 * import '@fortawesome/fontawesome-free/css/all.min.css'; ...........> import this in app.js 
 */

const App = React.forwardRef((props, ref) => {
  const [posts, setPosts] = useState([]); // this hook is for displaying posts(images,captions,username)
  const myRef = useRef();
  const [loggedinUserDisplayName,setLoggedinUserDisplayName] = useState('') 

  //const [stories,setStories] = useState([])

  useEffect(() => {
    db.collection("posts").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() })));
    });
  }, []);

  useEffect(() => {
    // // below if condition is used to set value of current logged inn user to loggedinUserDisplayName state variable
    // /** loggedinUserDisplayName can be added in dependency array */

    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setLoggedinUserDisplayName(authUser.displayName);
      } else {
        setLoggedinUserDisplayName(null);
      }
    });
  }, [loggedinUserDisplayName]);

  //  useEffect(() => {
  //    const unsubscribe = db.collection("stories")
  //    .onSnapshot((snapshot) => {
  //      setStories(
  //        snapshot.docs.map((doc) => 
  //         ({ id: doc.id, story: doc.data() })
  //        )
  //      );
  //    });
     
  //    return () => {
  //      unsubscribe()
  //    };
  //  }, []);

    // console.log("stories",stories)
  return (
    <div className="app-container">
      <HeaderComponent ref={myRef} loggedinUserDisplayName={loggedinUserDisplayName}/>
      {/* {stories.map((story)=>{
        return(
          <StoriesBarComponent key={story.id} stories={story.story} storyId={story.id}/>
        )
      })} */}
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

      {loggedinUserDisplayName ?
      <ImageUploadComponent/>
       :
       "Please login to upload image"
       }

    </div>
  );
})

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

export default App;
