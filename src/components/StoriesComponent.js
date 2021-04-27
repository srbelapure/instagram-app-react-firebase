import React,{useState,useEffect} from 'react'
import Stories from "react-insta-stories";

function StoriesComponent(props) {
    const [imagesUrl,setImagesUrl]= useState([])

    useEffect(() => {
       props.stories.map((item)=>{
            if(item.story.username === props.match.params.username){
                return setImagesUrl(item.story.imageurl)
            }
        })
    }
    ,[])
    
    const endOfStoriesForUser=()=>{
        props.history.push('/')
    }
    const stylesForStoriesImages={
      //use this prop to override default css styles of Stories component
    }
    return (
      <div className="stories-demo-container">
        {imagesUrl.length > 0 ? (
          <Stories
            stories={imagesUrl}
            // onAllStoriesEnd={()=>setOnClickForInstaStoryIcon(false)}
            onAllStoriesEnd={endOfStoriesForUser}
            storyStyles={stylesForStoriesImages}
            // width={600}
            // height={600}
          />
        ) : (
          <div>If you wish to see the stories again then go to main page and select the stories again!!!!</div>
        )}
      </div>
    );
}

export default StoriesComponent
