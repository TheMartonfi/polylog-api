const parseQuizCards = cards => {
	const parsedCards = [];

	cards.forEach(card => {
		const question_id = card.quiz_question_id;
		let findParsedCard = parsedCards.find(
			currentCard => currentCard.id === card.id
		);
		// If a card has no questions or answers
		// It still adds one question/answer with all null values
		if (findParsedCard === undefined) {
			if (question_id && card.quiz_answer_id) {
				parsedCards.push({
					id: card.id,
					title: card.title,
					questions: [
						{
							id: question_id,
							question: card.question,
							answers: [
								{
									id: card.quiz_answer_id,
									answer: card.answer,
									correct: card.correct
								}
							]
						}
					],
					position: card.position
				});
			} else {
				parsedCards.push({
					id: card.id,
					title: card.title,
					questions: [],
					position: card.position
				});
			}
		} else {
			const findQuestion = findParsedCard.questions.find(
				questions => questions.id === question_id
			);

			if (findQuestion === undefined) {
				findParsedCard.questions.push({
					id: question_id,
					question: card.question,
					answers: [
						{
							id: card.quiz_answer_id,
							answer: card.answer,
							correct: card.correct
						}
					]
				});
			} else {
				findQuestion.answers.push({
					id: card.quiz_answer_id,
					answer: card.answer,
					correct: card.correct
				});
			}
		}
	});

	return parsedCards;
};

const parseTopicResponses = responses => {
	const parsedResponses = { responses: [], reactions: [] };

	responses.forEach(response => {
		const findParsedResponse = parsedResponses.responses.find(res => {
			return res.id === response.topic_response_id;
		});

		const findParsedReaction = parsedResponses.reactions.find(reaction => {
			return reaction.id === response.topic_reaction_id;
		});

		if (findParsedResponse === undefined) {
			parsedResponses.responses.push({
				id: response.topic_response_id,
				type: response.type,
				response: response.response
			});
		}

		if (findParsedReaction === undefined) {
			parsedResponses.reactions.push({
				id: response.topic_reaction_id,
				student_id: response.student_id,
				reaction: response.reaction
			});
		}
	});

	return parsedResponses;
};

module.exports = { parseQuizCards, parseTopicResponses };
