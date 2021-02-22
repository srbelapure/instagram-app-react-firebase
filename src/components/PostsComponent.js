import React, { useState,useEffect } from "react";
import { Avatar } from "@material-ui/core";
import { db} from "./Firebase";
import firebase from "firebase";


function PostsComponent(props) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');

  useEffect(() => {
    let unsubscribe;
    if (props.postid) {
      unsubscribe = db
        .collection("posts")
        .doc(props.postid)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(
            snapshot.docs.map((doc) => ({ id: doc.id, comments: doc.data() }))
          );
        });
    }

    return () => {
      unsubscribe();
    };
  }, [props.postid]);

  const clickAvatar = () => {
    alert("avtar clicked");
  };
  const onPostClick = (event) => {
    event.preventDefault();

    db.collection('posts').doc(props.postid).collection('comments').add({
      text:comment,
      username: firebase.auth().currentUser.displayName, // here we donot need to post user-name, but the logged in user-name who wants to add comment. So we cannot props.username 
      timestamp:firebase.firestore.FieldValue.serverTimestamp()
    })
    
    setComment('')
  };
  return (
    <div className="posts-container">
      <div className="post-header">
        <Avatar
          src=""
          alt="username"
          className="avtar-image"
          onClick={clickAvatar}
        />
        <h3>{props.username}</h3>
      </div>
      <img className="post-image" src={props.imageurl} alt={props.caption} />
      <h4 className="post-comments-text">
        <strong>
          {props.username}
          {": "}
        </strong>
        {props.caption}
      </h4>
      <div className="added-comments-text-section">
        {comments.map((comment) => {
          return (
            <p key={comment.id}>
              <strong>{comment.comments.username}</strong>
              {" :"}
              {comment.comments.text}
            </p>
          );
        })}
      </div>
      {props.loggedinUserDisplayName && (
        <div >
          <form className="post-comments" onSubmit={onPostClick}>
            <input
              className="post-comment-input"
              type="text"
              placeholder="Enter comment here"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              className="post-comment-button"
              type="submit"
              disabled={!comment}
            >
              Post
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default PostsComponent;
