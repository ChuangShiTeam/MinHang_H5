import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {WhiteSpace, WingBlank} from 'antd-mobile';
import {createForm} from "rc-form";

import notification from '../util/notification';

class Question extends Component {
	constructor(props) {
		super(props);

		this.state = {

		}
	}

	componentDidMount() {

	}

	componentWillUnmount() {

	}

	handleSubmitAnswer() {
		notification.emit('notification_' + this.props.id + '_question', {});
	}

	handleSubmitQuestionTask() {
		this.props.form.validateFields((errors, values) => {
			if (!errors) {
				values.task_id = this.props.key2.task.task_id;
				values.key_activated_step = this.props.key2.selectedIndex;
				http.request({
					url: '/mobile/minhang/task/member/complete',
					data: values,
					success: function (data) {
						this.handelSubmitResponse();
					}.bind(this),
					complete() {

					}
				});
			}
		});
	}

	render() {
		const {getFieldProps, getFieldError} = this.props.form;
		const RadioItem = Radio.RadioItem;

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

Question.propTypes = {
	id: PropTypes.string.isRequired,
	task_name: PropTypes.string.isRequired
};

Question.defaultProps = {

};
Question = createForm()(Question);
export default Question;
