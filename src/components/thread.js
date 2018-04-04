
import React, {Component} from 'react';
import postData from '../data/threadItems'

// I'm sure there's a more efficient way to grab data from postData rather than grabbing at a certain index.
// It feels really barbarian

const textAreaStyle={
    fontSize: '13px',
    height: '55px',
    marginBottom:'2px'
}

class Thread extends Component{
    constructor(props){
        super(props)
        this.state={

        }
    }
    render(){
        console.log(this.props);
        return(
                <div className="col-m-12 col-sm-9 justify-content-start mt-5 ">
                    <h2>{postData[this.props.threadID].title}</h2>
                    <p><small className='text-muted' >Author: {postData[this.props.threadID].author} </small></p>
                    <p>{postData[this.props.threadID].description}</p>
                    <div className="dropdown-divider mb-5"></div>
                    <div className="row">
                        <div className="col">
                            <span><i className="fas fa-user-circle mr-2"></i>{postData[this.props.threadID].comments[0].name}</span>
                            <p><small>{postData[this.props.threadID].comments[0].comment}</small></p>
                            <form className="form-group" >
                                <textarea style={textAreaStyle} id="comment" className="form-control"></textarea>
                                <button className="btn btn-danger btn-sm" >Add a comment</button>
                            </form>

                        </div>
                    </div>

                </div>
        )
    }
};

export default Thread
