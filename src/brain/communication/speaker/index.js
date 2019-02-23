import AWS from 'aws-sdk'
import Speaker from 'speaker'

const Polly = new AWS.Polly({
	signatureVersion: 'v4',
	region: 'us-east-1',
})

const createSentence = sentence => ({
	Text: sentence,
	OutputFormat: 'pcm',
	TextType: 'ssml',
	VoiceId: 'Brian',
})

const speak = phrase => new Promise((resolve, reject) => {
	Polly.synthesizeSpeech(createSentence(phrase), (err, res) => {
		console.log(res)

		if (err || !(res.AudioStream instanceof Buffer)) {
			reject(err || 'Not is a buffer')
		}
		const speaker = new Speaker({
			channels: 1,
			bitDepth: 16,
			sampleRate: 17650,
		})

		speaker.on('open', () => {
			console.debug('Speaker open')
		})

		speaker.on('close', () => {
			resolve()
		})

		speaker.write(res.AudioStream, () => {
			setTimeout(() => speaker.close(), 500)
		})
	})
})

export default speak
