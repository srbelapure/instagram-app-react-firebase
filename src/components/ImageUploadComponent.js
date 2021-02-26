import React, { useState } from "react";
import { Button } from "@material-ui/core";
import { storage, db } from "./Firebase";
import firebase from "firebase";

function ImageUploadComponent() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  const handleFileUpload = () => {
    /**storage.ref(`images/${image.name}`).put(image) =>
     * access the storage and get a reference to images collection and add images to it, here (image.name) is name of image
     * put(image) => put the grabbed image in storage*/
    const uploadTask = storage.ref(`images/${image.name}`).put(image); // this lines uploads data to storage
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        //on state change of the file upload progress, get a snapshot continuously and update the progress function
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        ); // percentage for progress bar
        setProgress(progress); // set progress from 0 to 100
      },
      //if anything goes wrong during fiile upload then catch the error
      (error) => {
        console.log(error);
      },
      //when upload completes
      () => {
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL() // getDownloadURL() => image is uploaded so now get the download url to utilize it further
          .then((url) => {
            //post images inside db
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(), // this gets server timestamp, hence it remains unified
              caption: caption, // entered value by user in input box
              imageurl: url, // url => has the value of uploaded image
              // username: props.loggedinUserDisplayName // we have used forward ref technique to access this value from modalcomp=>headercomp=>app comp and then passed as loggedinUserDisplayName prop
              username: firebase.auth().currentUser.displayName, // firebase.auth().currentUser.displayName => current user display name
            });

            window.scrollTo(0, 0) // After uploading the image, automatically scroll to top of page to see it

            setImage(null); // after successful loading, reset to fresh state
            setProgress(0); // after successful loading, reset to fresh state
            setCaption(""); // after successful loading, reset to fresh state
          });
      }
    );
  };

  // // To scroll a page to top use this
  //   useEffect(() => {
  //     window.scrollTo(0, 0)
  //   }, [])

  return (
    <div className="image-upload-container">
      {/* progress is a default html progress control */}
      <progress className="image-upload-progress" max="100" value={progress} />
      {/* <form> */}
      <input
        type="text"
        placeholder="Enter a caption"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <input type="file" onChange={handleFileChange} />
      <Button onClick={handleFileUpload}>Upload</Button>
      {/* </form> */}
    </div>
  );
}

export default ImageUploadComponent;
