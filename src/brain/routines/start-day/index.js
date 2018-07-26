import getWeatherInformation from './weather'
import { getRouteToWork } from '../../../services'
import moment from 'moment'

const giveWeatherAdvise = (temp = 18, humanizedTime) => {
  if (parseFloat(temp) < 23) return `You should put a coach because I unfortunatelly can't warm you yet.`
  if (parseFloat(temp) >= 25) return `You should be okay! today is warm. Enjoy the heat!`
    
  return `With this time I wish you a good luck in this ${humanizedTime}, Sir!`
  
}

const getGreetingTime = (m) =>  {
	var humanizedTime = null; //return g
	
	if (!m || !m.isValid()) { return; } 
	
	var split_afternoon = 12 // 24hr time to split the afternoon
	var split_evening = 17 // 24hr time to split the evening
	var currentHour = parseFloat(m.format("HH"));
	
	if (currentHour >= split_afternoon && currentHour <= split_evening) {
		humanizedTime = "afternoon";
	} else if (currentHour >= split_evening) {
		humanizedTime = "evening";
	} else {
		humanizedTime = "morning";
	}
	
	return {
    humanizedTime,
    sentence: `<amazon:auto-breaths>Good ${humanizedTime} sir!!!`
  };
}

// This routine consist in provide some healthy information to start the day,
const startDay = async () => {
  const { temperature, skytext } = await getWeatherInformation()
  const trafficInformation = await getRouteToWork()
  const { distance, formattedTime, name } = trafficInformation
  const timePieces = formattedTime.split(':'); // split it at the colons

  // Hours are worth 60 minutes.
  const minutes = (+timePieces[0]) * 60 + (+timePieces[1]);
  const greetingObject = getGreetingTime(moment())
  
  return `
    <speak>
      ${greetingObject.sentence}!
      <break time="200ms"/> Now it's ${temperature} degrees and it's ${skytext}, ${giveWeatherAdvise(temperature, greetingObject.humanizedTime)}.
      \n If you go by car, you should take ${minutes} minutes to arrive at work. The estimated distance is ${distance} kilometers.</amazon:auto-breaths>
      
      <break time="0.3s"/>Have a nice ${greetingObject.humanizedTime} Sir!
    </speak>`
}

export default startDay