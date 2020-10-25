const parseCards = cards => {
	const parsedCards = [];

	cards.forEach(card => {
		const id = card.quiz_card_id;
		const question_id = card.quiz_question_id;
		let findParsedCard = parsedCards.find(card => card.id === id);
		console.log(card);
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

module.exports = { parseCards };
