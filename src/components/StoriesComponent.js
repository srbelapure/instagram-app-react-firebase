import React,{useState,useEffect} from 'react'
import Stories from "react-insta-stories";

function StoriesComponent(props) {
    const [imagesUrl,setImagesUrl]= useState([])
    let imagesArray=[]

    useEffect(() => {
      props.stories.map((item)=>{
            if(item.story.username === props.match.params.username){
                return setImagesUrl(images => [...images, item.story.imageurl])
            }
        })
        return()=>{
          setImagesUrl([])
        }
    },[props.match.params.username,props.stories])
    
    const endOfStoriesForUser=()=>{
      setImagesUrl([])
        props.history.push('/')
    }
    const stylesForStoriesImages={
      //use this prop to override default css styles of Stories component
    }
    
    imagesUrl.map((images) => {
      images.map((item)=>{
        return imagesArray.push(item)
      })
    })

    return (
      <div className="stories-demo-container">
        {imagesUrl.length > 0 ? (
          <Stories
            stories={imagesArray}
            // onAllStoriesEnd={()=>setOnClickForInstaStoryIcon(false)}
            onAllStoriesEnd={endOfStoriesForUser}
            storyStyles={stylesForStoriesImages}
            // width={600}
            // height={600}
          />
        ) : (
          <div>
            If you wish to see the stories again then go to main page and select
            the stories again!!!!
          </div>
        )}
      </div>
    );
}

export default StoriesComponent
