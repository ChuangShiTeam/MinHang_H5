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
		this.props.form.validateFields((errors, values) => {
			if (!errors) {
				values.task_id = this.props.key2.task.task_id;
				values.key_activated_step = this.props.key2.selectedIndex;
				http.request({
					url: '/mobile/minhang/task/member/complete',
					data: values,
					success: function (data) {
						notification.emit('notification_' + this.props.id + '_question', {});
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
				{
					this.props.task.question_list.map((question, index) => {
						if (question.question_type === 'RADIO') {
							return (
								<div key={index}>
									<WhiteSpace size="lg"/>
									<WhiteSpace size="lg"/>
									<List renderHeader={() => question.question_title}>

									</List>
								</div>
							);
						} else if (question.question_type === 'CHECKBOX') {
							return (
								<div>
									<WhiteSpace size="lg"/>
									<WhiteSpace size="lg"/>
									<List renderHeader={() => question.question_title}>

									</List>
								</div>
							);
						} else if (question.question_type === 'GAP_FILLING') {
							return (
								<div>
									<WhiteSpace size="lg"/>
									<WhiteSpace size="lg"/>
									<List renderHeader={() => question.question_title}>
										<TextareaItem
											{...getFieldProps(`question_answer_${index}`, {
												rules: [{
													required: true,
													message: '请填写答案'
												}],
												initialValue: ''
											})}
											error={!!getFieldError(`question_answer_${index}`)}
											clear
											title="答案"
											rows={5}
											autoHeight
											placeholder="请填写答案"
										/>
									</List>
								</div>
							);
						}
						return null;
					})
				}
				<WhiteSpace size="lg"/>
				<WhiteSpace size="lg"/>
				<Button className="btn" type="primary" onClick={this.handleSubmitAnswer.bind(this)}>提交</Button>
			</div>
		);
	}
}

Question.propTypes = {
	id: PropTypes.string.isRequired,
	task: PropTypes.object.isRequired
};

Question.defaultProps = {

};
Question = createForm()(Question);
export default Question;
