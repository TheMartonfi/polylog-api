const parseQuizCards = cards => {
	const parsedCards = [];

	cards.forEach(card => {
		const id = card.quiz_card_id;
		const question_id = card.quiz_question_id;
		let findParsedCard = parsedCards.find(card => card.id === id);

		if (findParsedCard === undefined) {
			parsedCards.push({
				id,
				title: card.title,
				content: [
					{
						question_id,
						question: card.question,
						answers: [
							{
								answer_id: card.quiz_answer_id,
								answer: card.answer,
								correct: card.correct
							}
						]
					}
				],
				position: card.position
			});
		} else {
			const findQuestion = findParsedCard.content.find(
				content => content.question_id === question_id
			);

			if (findQuestion === undefined) {
				findParsedCard.content.push({
					question_id,
					question: card.question,
					answers: [
						{
							answer_id: card.quiz_answer_id,
							answer: card.answer,
							correct: card.correct
						}
					]
				});
			} else {
				findQuestion.answers.push({
					answer_id: card.quiz_answer_id,
					answer: card.answer,
					correct: card.correct
				});
			}
		}
	});

	return parsedCards;
};

const parseTopicResponses = responses => {
	const parsedResponses = {};

	responses.forEach(response => {
		if (!parsedResponses.responses && !parsedResponses.reactions) {
			parsedResponses["responses"] = [
				{
					type: response.type,
					response: response.response
				}
			];
			parsedResponses["reactions"] = [
				{
					student_id: response.student_id,
					reaction: response.reaction
				}
			];
		} else {
			const findParsedResponse = parsedResponses.responses.find(res => {
				if (res.response_id === response.topic_response_id) {
					return res;
				}
			});
			const findParsedReaction = parsedResponses.reactions.find(reaction => {
				if (reaction.reaction_id === response.topic_reaction_id) {
					return reaction;
				}
			});

			if (findParsedResponse === undefined) {
				parsedResponses.responses.push({
					type: response.type,
					response: response.response
				});
			}

			if (findParsedReaction === undefined) {
				parsedResponses.reactions.push({
					student_id: response.student_id,
					reaction: response.reaction
				});
			}
		}
	});

	return parsedResponses;
};

module.exports = { parseQuizCards, parseTopicResponses };
