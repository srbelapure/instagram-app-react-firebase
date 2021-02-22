import { useState, useEffect,useRef } from "react";
import HeaderComponent from "./components/HeaderComponent";
import PostsComponent from "./components/PostsComponent";
import ImageUploadComponent from './components/ImageUploadComponent'
import { db } from "./components/Firebase";
import firebase from "firebase";
import "./App.css";

function App() {
  const [posts, setPosts] = useState([]); // this hook is for displaying posts(images,captions,username)
  const myRef = useRef();
  // const [loggedinUserDisplayName,setLoggedinUserDisplayName] = useState('') // THIS STATE VARIABLE IS OBSOLETE, as we are using "firebase.auth().currentUser.displayName" to get current logged in user

  useEffect(() => {
    db.collection("posts").onSnapshot((snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() })));
    });

    // // below if condition is used to set value of current logged inn user to loggedinUserDisplayName state variable
    // /** loggedinUserDisplayName can be added in dependency array */
    // if (
    //   myRef &&
    //   myRef.current &&
    //   myRef.current.getMyState() &&
    //   myRef.current.getMyState().displayName
    // ) {
    //   setLoggedinUserDisplayName(myRef.current.getMyState().displayName);
    // }
  }, []);

  return (
    <div className="app-container">
      <HeaderComponent ref={myRef}/>
      {posts.map((post) => {
        return (
          <PostsComponent
            key={post.id}
            postid={post.id}
            caption={post.post.caption}
            imageurl={post.post.imageurl}
            username={post.post.username}
          />
        );
      })}

      {firebase.auth().currentUser && firebase.auth().currentUser.displayName ?
      <ImageUploadComponent/>
       :
       "Please login to upload image"
       }

      
    </div>
  );
}

export default App;
