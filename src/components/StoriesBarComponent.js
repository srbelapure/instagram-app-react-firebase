import React, { useEffect, useState } from "react";
import { Avatar } from "@material-ui/core";
import { db,storage } from "./Firebase";
import StoriesComponent from './StoriesComponent'
import { BrowserRouter, Link, Switch, Route } from 'react-router-dom';
import firebase from "firebase";

function StoriesBarComponent(props) {
  
  const [imageUrl, setImageUrl] = useState([]);
  const [downloadUrl, setDownloadUrl] = useState([])
  const [progress, setProgress] = useState(0);
  const arrList=[]
  var newDuplicateList=[]
  let downloadFilesUrlFromFireStore=[]

  // const onFileChange = e => {
  //   for (let i = 0; i < e.target.files.length; i++) {
  //        const newFile = e.target.files[i];
  //        newFile["id"] = Math.random();
  //     // add an "id" property to each File object
  //        setFiles(prevState => [...prevState, newFile]);
  //      }
  //    };
   

  const handleFileChange = (e) => {
    // if (e.target.files) {
    //  for(var itemValue of e.target.files){
    //   arrList.push(itemValue.name)
    //  }
    // }

    // for (let i = 0; i < e.target.files.length; i++){
    //   console.log('e.target.files',e.target.files[i],e.target.files[i].name)
    //   setImageUrl(prevState => [...prevState, e.target.files[i].name]);
    //   // setImageUrl(e.target.files[i].name);
    // }
    

    // setImageUrl(arrList)


    for (let i = 0; i < e.target.files.length; i++) {
      const newFile = e.target.files[i];
      newFile["id"] = Math.random();
   // add an "id" property to each File object
   setImageUrl(prevState => [...prevState, newFile]);
    }


    // if (e.target.files[0]) {
    //   setImageUrl(e.target.files[0]);
    // }

  };


  const clickAvatar = (storyOfUser) => {
  };

  const addUserStory = async ()=> {
   
console.log("imageUrl**************",imageUrl)
let downloadUrlList=[]


const promises = [];
imageUrl.forEach(file => {
    const uploadTask = 
     firebase.storage().ref().child(`storyimages/${file.name}`).put(file);
       promises.push(uploadTask);
       uploadTask.on(
          firebase.storage.TaskEvent.STATE_CHANGED,
          snapshot => {
           const progress = 
             ((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
              if (snapshot.state === firebase.storage.TaskState.RUNNING) {
               console.log(`Progress: ${progress}%`);
              }
            },
            error => console.log(error.code),
            async () => {
              const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
               // do something with the url
               downloadFilesUrlFromFireStore.push(downloadURL)

               if(downloadFilesUrlFromFireStore.length === imageUrl.length){
                 alert("task upload done for all original elements")
                 console.log("downloadFilesUrlFromFireStore",downloadFilesUrlFromFireStore)
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
       .then(() => 
       alert('All files uploaded')
       )
       .catch(err => console.log(err.code));
}

  return (
    <div className="stories-bar-container">
      {/* {console.log("clickInstaStoryIcon", clickInstaStoryIcon)} */}
      {/* {clickInstaStoryIcon ? (
        <StoriesComponent stories={props.stories}/>
      ) : (
        <Avatar
          src=""
          alt="stories"
          className="stories-bar-image"
          onClick={clickAvatar}
        />
      )} */}
      {/* <progress className="image-upload-progress" max="100" value={progress} /> */}
      <div><input type="file" onChange={handleFileChange} multiple/></div>
      <span className='add-new-story-for-user' onClick={addUserStory}>
        <i className="fas fa-plus-circle add-user-story"></i>
        </span>

      {props.stories.map((story) => {
        return (
          <span className="avatars-of-user-stories" key={story.id}>
          <Link to={`/${story.story.username}/stories`}>
            {/* <Avatar
              src=""
              alt="stories"
              className="stories-bar-image"
              onClick={()=>clickAvatar(story.story.username)}
            /> */}
              <Avatar>
              {story.story.username.slice(0, 1).toUpperCase()}
              </Avatar>
              <p>{story.story.username}</p>
          </Link>
            </span>
        );
      })}
      {/* <Link to={`/${}/stories`}>
          <Avatar
            src=""
            alt="stories"
            className="stories-bar-image"
            onClick={clickAvatar}
          />
        </Link> */}
      {/* {clickInstaStoryIcon ? <StoriesComponent stories={props.stories} /> : ""} */}
    </div>
  );
}

export default StoriesBarComponent;



