import React, { useState , useRef} from "react";
import Avatar from '@mui/material/Avatar';
import { pink } from '@mui/material/colors';
import Stack from '@mui/material/Stack';
import Badge from "@mui/material/Badge";
import Icon from "@mui/material/Icon";
import { db } from "./Firebase";
import { Link } from "react-router-dom";
import firebase from "firebase";

function StoriesBarComponent(props) {
  const [progress, setProgress] = useState(0);
  const filenameRef = useRef()
  let downloadFilesUrlFromFireStore = [];
  let userNameArray=[]
  let uploadStoriesArray=[]

  props.stories.map((item) => {
    if (userNameArray.indexOf(item.story.username) === -1) {
      userNameArray.push(item.story.username);
    }
  });

  const addUserStory = async (e) => {

    //using this loop to extract selected files and add it to uploadStoriesArray
    for (let i = 0; i < e.target.files.length; i++) {
      const newFile = e.target.files[i];
      newFile["id"] = Math.random();
      // add an "id" property to each File object
      uploadStoriesArray.push(newFile)
    }


    const promises = [];
    uploadStoriesArray.forEach((file) => {
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

          if (downloadFilesUrlFromFireStore.length === uploadStoriesArray.length) {
            alert("All the selected files have been uploaded...\nyou can now see the stories");
            setProgress(0) // after successful loading, reset to fresh state
            db.collection("stories").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(), // this gets server timestamp, hence it remains unified
              imageurl: downloadFilesUrlFromFireStore, // url => has the value of uploaded image
              username: firebase.auth().currentUser.displayName, // firebase.auth().currentUser.displayName => current user display name
              userid : props.uid
            });
          }
        }
      );
    });
    Promise.all(promises)
      .then(() => promises.length > 0?
      alert("All files uploaded...") : alert('No files selected...\nFist select the files by clicking on your avatar icon above')
      )
      .catch((err) => console.log(err.code));
  };

  return (
    <div className="stories-bar-container">
      <Stack
        direction="row"
        spacing={1}
        justifyContent="flex-start"
        alignItems="flex-start"
      >
      {props.loggedinUserDisplayName && (
        <div className="select-user-stories-to-add">
          <input
            type="file"
            hidden
            onChange={addUserStory}
            multiple
            ref={filenameRef}
          />
          <Stack direction="column" spacing={1}  justifyContent="flex-start"
                alignItems="center">
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={
              <Icon className="avatar-badge-icon-stories" color="primary">
                <i className="fas fa-plus-circle add-user-story"></i>
              </Icon>
            }
            onClick={() => filenameRef.current.click()}
          >
            <Avatar
              sx={{
                bgcolor: pink[500],
                width: 56,
                height: 56,
                cursor: "pointer",
              }}
              className="user-story-avatar"
            >
              {props.loggedinUserDisplayName.slice(0, 1).toUpperCase()}
            </Avatar>
          </Badge>
          <h5 className="your-story">Your story</h5>
          </Stack>
        </div>
      )}

      
        {userNameArray.map((story) => {
          return (
            <span className="avatars-of-user-stories" key={story}>
            <Link to={`/${story}/stories`}>
              <Stack
                direction="column"
                spacing={1}
                justifyContent="flex-start"
                alignItems="center"
              >
                  <Avatar
                    alt={story}
                    sx={{
                      bgcolor: pink[500],
                      width: 56,
                      height: 56,
                    }}
                    className="user-story-avatar"
                  >
                    {story.slice(0, 1).toUpperCase()}
                  </Avatar>
                  <h5 className="user-name-stories">{story}</h5>
              </Stack>
              </Link>
             </span>
          );
        })}
        </Stack>
    </div>
  );
}

export default StoriesBarComponent;
