import React, { useState } from "react";
import { Avatar } from "@material-ui/core";
import { db } from "./Firebase";
import { Link } from "react-router-dom";
import firebase from "firebase";

function StoriesBarComponent(props) {
  const [imageUrl, setImageUrl] = useState([]);
  const [progress, setProgress] = useState(0);
  let downloadFilesUrlFromFireStore = [];

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
        (snapshot) =>
        {
          //on state change of the file upload progress, get a snapshot continuously and update the progress function
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          ); // percentage for progress bar
          if (snapshot.state === firebase.storage.TaskState.RUNNING) {
            setProgress(progress); // set progress from 0 to 100
          }
        },
        (error) => console.log(error.code),
        async () => {
          const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
          downloadFilesUrlFromFireStore.push(downloadURL);

          if (downloadFilesUrlFromFireStore.length === imageUrl.length) {
            alert("All the selected files have been uploaded..."+`\n`+ "you can now see the stories");
            setProgress(0) // after successful loading, reset to fresh state
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
      .then(() => promises.length > 0?
      alert("All files uploaded...") : alert('No files selected...'+ `\n` + 'Fist select the files form choose files option')
      )
      .catch((err) => console.log(err.code));
  };

  return (
    <div className="stories-bar-container">
      {
      console.log("progressprogress",progress)
      }
      {progress === 0 ? (
        <progress
          className="stories-upload-progress"
          max="100"
          value={progress}
          style={{display:'none'}}
        />
      ) : (
        <progress
          className="stories-upload-progress"
          max="100"
          value={progress}
        />
      )}
      <div className="select-user-stories-to-add">
        <input type="file" onChange={handleFileChange} multiple />
        <span
          title="click on this button to upload stories selected...."
          className="add-new-story-for-user"
          onClick={addUserStory}
        >
          <i className="fas fa-plus-circle add-user-story"></i>
        </span>
      </div>

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
