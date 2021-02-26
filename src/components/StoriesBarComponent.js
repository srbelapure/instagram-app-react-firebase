import React, { useEffect, useState } from "react";
import { Avatar } from "@material-ui/core";
import { db } from "./Firebase";
import Stories from "react-insta-stories";

function StoriesBarComponent({ stories, storyId }) {
  // const testtttttttttttt = [
  //     "https://firebasestorage.googleapis.com/v0/b/instagram-react-firebase-1e6f6.appspot.com/o/images%2Fjack%20jack.jpg?alt=media&token=53137cee-d98e-4079-a9b4-96087bcf82f6",
  //     "https://firebasestorage.googleapis.com/v0/b/instagram-react-firebase-1e6f6.appspot.com/o/images%2Fmoana%20princess.jpg?alt=media&token=8733b0b4-edef-40e7-b6c4-6ca4f6984ed3",
  //     "https://firebasestorage.googleapis.com/v0/b/instagram-react-firebase-1e6f6.appspot.com/o/images%2Fcindrella%20princess.jpg?alt=media&token=29afee85-dc25-4685-98a3-46ea98a9b175"
  // ];

  const [clickInstaStoryIcon, setOnClickForInstaStoryIcon] = useState(false);

  const clickAvatar = () => {
    // stories.imageurl.map((storyimg) => {
    //   return (
    //     <Stories
    //       stories={storyimg}
    //       defaultInterval={1500}
    //       width={432}
    //       height={768}
    //     />
    //   );
    // });
    // <Stories
    //       stories={stories.imageurl}
    //       defaultInterval={1500}
    //       width={432}
    //       height={768}
    //     />
    setOnClickForInstaStoryIcon(true);
  };

  const endOfStoriesForUser = () => {
    setOnClickForInstaStoryIcon(false);
  };

  return (
    <div className="stories-bar-container">
      {clickInstaStoryIcon ? (
        <Stories
          stories={stories.imageurl}
          // onAllStoriesEnd={()=>setOnClickForInstaStoryIcon(false)}
          onAllStoriesEnd={endOfStoriesForUser}
        />
      ) : (
        <Avatar
          src=""
          alt="stories"
          className="stories-bar-image"
          onClick={clickAvatar}
        />
      )}
    </div>
  );
}

export default StoriesBarComponent;

// import Stories from 'react-insta-stories';

// const stories = [
//     'https://example.com/pic.jpg',
//     'data:image/jpg;base64,R0lGODl....',
//     'https://mohitkarekar.com/icon.png',
// ];

// return () => <Stories stories={stories} />;
