import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {WhiteSpace, WingBlank} from 'antd-mobile';

import notification from '../util/notification';

class Picture extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    handleUploadImage() {
        notification.emit('notification_' + this.props.id + '_picture', {});
    }

    render() {
        return (
            <div>
                <WhiteSpace size="xl"/>
                <WhiteSpace size="xl"/>
                <WhiteSpace size="xl"/>
                <WhiteSpace size="xl"/>
                <WhiteSpace size="xl"/>
                <WhiteSpace size="xl"/>
                <WhiteSpace size="xl"/>
                <WhiteSpace size="xl"/>
                <WingBlank size="md">
                    <div className="upload-image" onClick={this.handleUploadImage.bind(this)}>
                        <img src={require('../assets/image/upload-image.png')} alt=""/>
                        <WhiteSpace size="xl"/>
                        <div className="upload-image-tip">
                            {this.props.task_name}
                        </div>
                    </div>
                </WingBlank>
            </div>
        );
    }
}

Picture.propTypes = {
    id: PropTypes.string.isRequired,
    task_name: PropTypes.string.isRequired
};

Picture.defaultProps = {

};

export default Picture;
