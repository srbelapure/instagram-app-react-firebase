import React, { useEffect, useState } from "react";
import { Avatar } from "@material-ui/core";
import { db,storage } from "./Firebase";
import StoriesComponent from './StoriesComponent'
import { BrowserRouter, Link, Switch, Route } from 'react-router-dom';
import firebase from "firebase";

function StoriesBarComponent(props) {
  
  const [imageUrl, setImageUrl] = useState([]);
  const [progress, setProgress] = useState(0);
const arrList=[]

  const handleFileChange = (e) => {
    // if (e.target.files) {
    //  for(var itemValue of e.target.files){
    //   arrList.push(itemValue.name)
    //  }
    // }
    
    // setImageUrl(arrList)


    if (e.target.files[0]) {
      setImageUrl(e.target.files[0]);
    }

  };


  const clickAvatar = (storyOfUser) => {
  };

  const addUserStory = () => {
    alert("added user story");
    console.log(
      "loggedinUserDisplayName",
      props,
      props.loggedinUserDisplayName
    );
    console.log("imageUrlimageUrlimageUrl", imageUrl);

    //     imageUrl.map((item)=>{
    // console.log("itemitem",item,item.name)
    //       const uploadTask = storage.ref(`storyimages/${item}`).put(item); // this lines uploads data to storage

    //     })

    /**storage.ref(`images/${image.name}`).put(image) =>
     * access the storage and get a reference to images collection and add images to it, here (image.name) is name of image
     * put(image) => put the grabbed image in storage*/
    const uploadTask = storage
      .ref(`storyimages/${imageUrl.name}`)
      .put(imageUrl); // this lines uploads data to storage

    // uploadTask.on("state_changed", (snapshot) => {
    //   snapshot.ref.getDownloadURL().then(function (downloadUrl) {
    //     console.log("snapshotsnapshotsnapshot", downloadUrl);

    //     db.collection("stories").add({
    //       imageurl: [downloadUrl],
    //       timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    //       username: firebase.auth().currentUser.displayName, // here we donot need to post user-name, but the logged in user-name who wants to add comment. So we cannot props.username
    //     });
    //   });
    // });



    uploadTask.on(
      "state_changed",
      (snapshot) => {
        //on state change of the file upload progress, get a snapshot continuously and update the progress function
      //   const progress = Math.round(
      //     (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      //   ); // percentage for progress bar
      //  // setProgress(progress); // set progress from 0 to 100
      },
      //if anything goes wrong during fiile upload then catch the error
      (error) => {
        console.log(error);
      },
      //when upload completes
      () => {
        storage
          .ref("storyimages")
          .child(imageUrl.name)
          .getDownloadURL() // getDownloadURL() => image is uploaded so now get the download url to utilize it further
          .then((url) => {
            //post images inside db
            db.collection("stories").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(), // this gets server timestamp, hence it remains unified
              
              imageurl: [url], // url => has the value of uploaded image
              // username: props.loggedinUserDisplayName // we have used forward ref technique to access this value from modalcomp=>headercomp=>app comp and then passed as loggedinUserDisplayName prop
              username: firebase.auth().currentUser.displayName, // firebase.auth().currentUser.displayName => current user display name
            });

            setImageUrl(null); // after successful loading, reset to fresh state
          //  setProgress(0); // after successful loading, reset to fresh state
          });
      }
    );

  };
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
        console.log("storystorystorystorystorystorystorystorystory",story)
      console.log("/${story.story.username}/stories",`/${story.story.username}/stories`)
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



