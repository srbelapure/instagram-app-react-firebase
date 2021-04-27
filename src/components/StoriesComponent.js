import React,{useState,useEffect} from 'react'
import Stories from "react-insta-stories";

function StoriesComponent(props) {
    // console.log("propspropspropspropspropspropspropspropspropspropspropsv",props)
    // console.log("props.match.params",props.match.params.username)
    // const [imagesUrl,setImagesUrl]= useState([])
    const [imagesUrl,setImagesUrl]= useState([])

    useEffect(() => {
        console.log("**************4",props,props.stories)
       props.stories.map((item)=>{
            if(item.story.username === props.match.params.username){
                // setImagesUrl(oldValues => [...oldValues,item.story.imageurl])
                // setImagesUrl(...imagesUrl,item.story.imageurl)
                setImagesUrl(item.story.imageurl)
            }
        })
        // return () => {
        //     unsubscribe()
        // };
    }
    // , [imagesUrl,props.match.params.username])
    ,[])
    
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
        {
          
    console.log("*******imagesUrlimagesUrl*****",imagesUrl)
        }
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
          <div> no elementssssssssssss</div>
        )}

{/* <Stories
            stories={imagesUrl}
            // onAllStoriesEnd={()=>setOnClickForInstaStoryIcon(false)}
            onAllStoriesEnd={endOfStoriesForUser}
            storyStyles={stylesForStoriesImages}
            width={600}
            height={600}
          /> */}

      </div>
    );
}

export default StoriesComponent
