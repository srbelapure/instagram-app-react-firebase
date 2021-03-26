import React,{useState,useEffect} from 'react'
import Stories from "react-insta-stories";

function StoriesComponent(props) {
    // console.log("propspropspropspropspropspropspropspropspropspropspropsv",props)
    // console.log("props.match.params",props.match.params.username)
    const [imagesUrl,setImagesUrl]= useState([])

    useEffect(() => {
        console.log("**************4")
       props.stories.map((item)=>{
            if(item.story.username === props.match.params.username){
                setImagesUrl(item.story.imageurl)
            }
        })

        // return () => {
        //     unsubscribe()
        // };
    }
    // , [imagesUrl,props.match.params.username])
    ,[props.match.params.username,imagesUrl])
    
    const endOfStoriesForUser=()=>{
        props.history.push('/')
    }
    const stylesForStoriesImages={
      objectFit: 'fill',
      height:'100%',
      width:'100%'
    }
    return (
      <div className="stories-demo-container">
        {imagesUrl.length > 0 ? (
          <Stories
            stories={imagesUrl}
            // onAllStoriesEnd={()=>setOnClickForInstaStoryIcon(false)}
            onAllStoriesEnd={endOfStoriesForUser}
            storyStyles={stylesForStoriesImages}
            width={600}
            height={600}
          />
        ) : (
          <div> no elementssssssssssss</div>
        )}
      </div>
    );
}

export default StoriesComponent
