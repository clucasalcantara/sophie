import { RabbitMQ } from '../../../services'

const processIntentType = ({ label: intentType }, text) => {
	// TODO: Begin NLP Processing based on intent type

	switch (intentType) {
		case 'song request': {
			return RabbitMQ.sendMessage(
				'playlist_service',
				`{ "data": "${text}", "options": { "play": true } }`
			)
		}
		default:
			break
	}

	return false
}

export default processIntentType