import React from 'react'
import {Meteor} from 'meteor/meteor';
import Navbar from "./NavBar.js";
import moment from 'moment';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import UserProfile from "./UserProfile";
import NavBar from "./NavBar";
import DiscoverPeople from './DiscoverPeople';


export default class Projects extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            peopleArray: [],
            url: ''
        }
    }

    componentDidMount() {
        Meteor.subscribe('projects');
        Meteor.subscribe('profiles');
        Meteor.subscribe('following');
        let project = this.props.projects.projectName;
        console.log(project);
        switch (project) {
            case 'Manchester Marathon':
                this.setState({
                    url: './img/marathon.png'
                });
                break;
            case 'Hacking Course':
                this.setState({
                    url: './img/hacking.png'
                });
                break;
            case 'Yoga':
                this.setState({
                    url: './img/yoga.png'
                });
                break;
        }
        Tracker.autorun(() => {
            let myCursor = projects.findOne({_id: this.props.projects._id});
            console.log(myCursor.projectDuration);
            let startTime = myCursor.startedAt;
            let durationInMinutes = myCursor.projectDuration * 24 * 60;
            let endTime = moment(startTime, 'MMM Do YY').add(durationInMinutes, 'minutes').format("MMM Do YY");
            let eventDay = this.refs.event;
            eventDay.innerHTML = endTime;
            let finishTime = myCursor.expiresIn;
            let hoursSpan = this.refs.hours;
            let minutesSpan = this.refs.minutes;
            let secondsSpan = this.refs.seconds;
            let myVar = setInterval(myCountdown, 1000);

            function myCountdown() {
                let now = moment().format('HH:mm:ss');
                let start = moment.utc(now, "HH:mm:ss");
                let end = moment.utc(finishTime, "HH:mm:ss");
                let duration = moment.duration(end.diff(start));
                hoursSpan.innerHTML = (duration.hours());
                minutesSpan.innerHTML = (duration.minutes());
                secondsSpan.innerHTML = (duration.seconds());
            }

        });
    };

    /*onSubmit(e) {
        e.preventDefault();
        let userEmail = this.refs.emailRef.value;
        //console.log(userEmail);
        let myCursor = profiles.find({email: userEmail}).fetch();
        //console.log(myCursor);
        this.setState({
            peopleArray: myCursor
        });
    }*/

    onEnrol(e) {
        e.preventDefault();
        Meteor.call('projects.update', this.props.projects._id, Meteor.userId());
        Meteor.call('myprofile.updateProjects', this.props.projects._id, Meteor.userId());
    }

    onRender(e) {
        let taskImage = {
            /*backgroundImage: 'url(' + imgUrl + ')',
            backgroundPosition:'center',
            backgroundSize:'cover',
            backgroundRepeat:'no-repeat',*/
            width: 140,
            height: 160

        };
        return (
            <div>
                <ReactCSSTransitionGroup transitionName="opacityAnimation" transitionAppear={true}
                                         transitionAppearTimeout={2000} transitionEnter={false}
                                         transitionLeave={false}>
                    <div className={'col span-1-of-3'} id={'projectColumn'}>


                        <h1 className="discover--header">{this.props.projects.projectName}</h1>

                        <div className={'col span-1-of-3 projectColumn'}>
                            <div className={'row'}>
                                <div className="project--photo">
                                    <figure className="project-photo-figure">
                                        <img src={this.state.url} style={taskImage}/>
                                    </figure>
                                </div>
                            </div>
                            <div className={'row'}>
                                <div className="task-countdown">
                                    <div className="row">
                                        <div className="col-12 eventDay">
                                            <div className={'box'}>
                                                <h5 className={'project--header'}>Event day</h5>
                                                <span className="event" ref={"event"}>0</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={'col span-1-of-4'}>
                            <div className="project--description">
                                <h3 className={'project--description--header'}>{this.props.projects.projectDuration} days
                                    of training</h3>
                                <h3 className={'project--description--header'}>{this.props.projects.people} people
                                    enroled</h3>
                            </div>


                            <div className="project-button">
                                <button className="btn btn__enrol" onClick={this.onEnrol.bind(this)}>Enrol
                                </button>
                            </div>
                        </div>
                        <div className={'col span-1-of-4'}>
                            <div className={'row'}>
                                <div className="box">
                                    <h4 className={'project--description--header'}>Enrol expires in: </h4>
                                </div>
                            </div>
                            <div className={'row'}>
                                <div className="task-countdown">
                                    <div className={'box'}>
                                        <h5>Countdown</h5>
                                        <div className="row">
                                            <div className="col span-1-of-3">
                                                <h5>H</h5>
                                                <span className="hours" ref={"hours"}>0</span>
                                            </div>
                                            <div className="col span-1-of-3">
                                                <h5>M</h5>
                                                <span className="minutes" ref={"minutes"}>0</span>
                                            </div>
                                            <div className="col span-1-of-3">
                                                <h5>S</h5>
                                                <span className="seconds" ref={"seconds"}>0</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </ReactCSSTransitionGroup>
            </div>
        )
    }

    render() {
        return (
            <div key={this.props.projects._id} className={'discover--page'}>
                {this.onRender()}

            </div>
        );
    }
}