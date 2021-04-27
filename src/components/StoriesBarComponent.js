import React, {useState } from "react";
import { Avatar } from "@material-ui/core";
import { db } from "./Firebase";
import {Link} from 'react-router-dom';
import firebase from "firebase";

function StoriesBarComponent(props) {
  
  const [imageUrl, setImageUrl] = useState([]);
  let downloadFilesUrlFromFireStore=[]

  const handleFileChange = (e) => {
    for (let i = 0; i < e.target.files.length; i++) {
      const newFile = e.target.files[i];
      newFile["id"] = Math.random();
      // add an "id" property to each File object
      setImageUrl((prevState) => [...prevState, newFile]);
    }
  };


  const addUserStory = async () => {
    const promises = [];
    imageUrl.forEach((file) => {
      const uploadTask = firebase
        .storage()
        .ref()
        .child(`storyimages/${file.name}`)
        .put(file);
      promises.push(uploadTask);
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (snapshot.state === firebase.storage.TaskState.RUNNING) {
            console.log(`Progress: ${progress}%`);
          }
        },
        (error) => console.log(error.code),
        async () => {
          const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
          downloadFilesUrlFromFireStore.push(downloadURL);

          if (downloadFilesUrlFromFireStore.length === imageUrl.length) {
            alert("task upload done for all original elements");
            db.collection("stories").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(), // this gets server timestamp, hence it remains unified
              imageurl: downloadFilesUrlFromFireStore, // url => has the value of uploaded image
              username: firebase.auth().currentUser.displayName, // firebase.auth().currentUser.displayName => current user display name
            });
          }
        }
      );
    });
    Promise.all(promises)
      .then(() => alert("All files uploaded"))
      .catch((err) => console.log(err.code));
  };

  return (
    <div className="stories-bar-container">
      {/* <progress className="image-upload-progress" max="100" value={progress} /> */}
      <div>
        <input type="file" onChange={handleFileChange} multiple />
      </div>
      <span className="add-new-story-for-user" onClick={addUserStory}>
        <i className="fas fa-plus-circle add-user-story"></i>
      </span>

      {props.stories.map((story) => {
        return (
          <span className="avatars-of-user-stories" key={story.id}>
            <Link to={`/${story.story.username}/stories`}>
              <Avatar>{story.story.username.slice(0, 1).toUpperCase()}</Avatar>
              <p>{story.story.username}</p>
            </Link>
          </span>
        );
      })}
    </div>
  );
}

export default StoriesBarComponent;



