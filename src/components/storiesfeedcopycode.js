import React from 'react'
import './StoriesBar.css'
import StoryIcon from './StoryIcon.js'
import NewStory from './NewStory.js'
class StoriesBar extends React.Component {
	render = () => { return (
		<div className="sbar">
			<NewStory/>
			{this.props.stories.map(s => <StoryIcon story={s} key={s.id}/>)}
		</div>
	)}
}
export default StoriesBar


import React from 'react'
import './NewStory.css'
class NewStory extends React.Component {
	render = () => { return (
		<div className="nstory">+</div>
	)}
}
export default NewStory


import React from 'react'
import './StoryIcon.css'
import { Link } from 'react-router-dom'
class StoryIcon extends React.Component {
    render = () => {
        let storyClass = 'storyi'
        storyClass += this.props.story.watched ? ' storyi--watched' : ''
        
        return (
            <Link to={`/${this.props.story.user.username}/stories`} className={storyClass} style={{backgroundImage: 'url(' + require(`../images/${this.props.story.user.avatar}`) + ')'}}></Link>
        )
    }
}
export default StoryIcon