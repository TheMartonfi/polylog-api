const parseResponses = responses => {
	const parsedResponses = {};

	responses.forEach(response => {
		if (!parsedResponses.responses && !parsedResponses.reactions) {
			parsedResponses["responses"] = [
				{
					response_id: response.topic_response_id,
					type: response.type,
					response: response.response
				}
			];
			parsedResponses["reactions"] = [
				{
					student_id: response.student_id,
					reaction_id: response.topic_reaction_id,
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
					response_id: response.topic_response_id,
					type: response.type,
					response: response.response
				});
			}

			if (findParsedReaction === undefined) {
				parsedResponses.reactions.push({
					student_id: response.student_id,
					reaction_id: response.topic_reaction_id,
					reaction: response.reaction
				});
			}
		}
	});

	return parsedResponses;
};

module.exports = { parseResponses };
