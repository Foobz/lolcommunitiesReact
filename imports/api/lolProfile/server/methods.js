import {LolProfile} from '../lolProfile';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {Meteor} from 'meteor/meteor';
import moment from 'moment-timezone';

const riotApiKey = Meteor.settings.riotApiKey;


export const createSummonerProfile = (user, userCommunityName) => {
  let summonerProfileData = getSummonerProfileData(user.profile.summonerId, user.profile.server);
  summonerProfileData.summonerName = user.profile.summonerName; // ensure the summonerName cause we can't retrieve it from riot if user has no ranked stats.
  LolProfile.insert(summonerProfileData);
}

export const updateSummonerProfile = (summonerId, summonerServer) =>{
  // get new data from Riot
  const summonerProfileData = getSummonerProfileData(summonerId, summonerServer);
  // merge: report histo in the new data.
  const sumProfilDataMerged = mergeHisto(summonerProfileData)
  // update
  LolProfile.update({summonerId: summonerId}, {$set: sumProfilDataMerged}, {validate: false});
}

// Put the new data in the league historic.
const mergeHisto = (newProfileData) => {

  lolProfile = LolProfile.findOne({summonerId: newProfileData.summonerId});

  for(newDataleague of newProfileData.leagues){
    for(league of lolProfile.leagues){
      if(newDataleague.queue == league.queue){
        newDataleague.histo = league.histo;

        console.log(league.histo[league.histo.length-1]);

        let lastHistoEntry = league.histo[league.histo.length-1];


        const currentDay = moment().tz("Europe/London").format("YYYY-MM-DD"); // GMT
        const todayHisto = {
          'date': currentDay,
          'tier': newDataleague.tier,
          'division': newDataleague.division,
          'leaguePoints': newDataleague.leaguePoints
        };
        if(lastHistoEntry.date != currentDay){
          console.log("not today");

          newDataleague.histo.push(todayHisto);

        }
        else if (lastHistoEntry.date == currentDay){
          league.histo[league.histo.length-1] = todayHisto;
        console.log("maj today");

        }
      }
    }
  }
  return newProfileData;
}


export const refreshSummonerProfile = new ValidatedMethod({
  name: 'summonerProfile.refresh',
  validate:null,
  run({summonerId, summonerServer }) {
    console.log("refreshSummonerProfile");
    updateSummonerProfile(summonerId, summonerServer);
  },
});

const getSummonerProfileData = (summonerId, server) => {
  const riotApiUrl = "https://"+server+".api.pvp.net/api/lol/"+server+"/v2.5/league/by-summoner/"+summonerId+"/entry?api_key="+riotApiKey;
  try {
    var result = HTTP.call("GET", riotApiUrl);

    let summonerProfileData = {};
    let summonerQueues = result.data[summonerId];
    // at least 1 queue otherwise it's in 404

    summonerProfileData = {
      'server': server,
      'summonerId': summonerQueues[0].entries[0].playerOrTeamId,
      'summonerName': summonerQueues[0].entries[0].playerOrTeamName,
      'leagues':[]
    }
    for(i in summonerQueues){
      let league = summonerQueues[i];
      let stats = league.entries[0]; // it's always 1 player, not a team.
      summonerProfileData.leagues.push({
        'queue': league.queue,
        'tier': league.tier,
        'leagueName': league.name,
        'division': stats.division,
        'leaguePoints': stats.leaguePoints,
        'wins': stats.wins,
        'losses': stats.losses,
        'histo':[]
      })
    }
    return summonerProfileData;

  } catch (e) {

    if(e.response.statusCode == '429'){
      console.log('Riot Api is overloaded, wait one minute to refresh');
      throw new Meteor.Error('riot.api ', 'Riot Api is overloaded, wait one minute to refresh');
    }
    else if(e.response.statusCode == 404){
      // user has no ranked stats
      // note: on an update he has already his summonerName. on create, we ensure to pass the summoner name in appropriate function.
      summonerProfileData = {
        'server': server.toUpperCase(),
        'summonerId': summonerId,
        'leagues': []
      }
      return summonerProfileData;
    } else{
      // Got a network error, time-out or HTTP error in the 400 or 500 range.
      console.log('at: '+riotApiUrl);
      console.log(e);
      throw new Meteor.Error('riot.api ', 'Unknown error from Riot api.');
    }
  }
}

export const hasUserLolProfile = new ValidatedMethod({
  name: 'LolProfile.hasUserLolProfile',
  validate:null,
  run({user}) {
      const userLolProfile = LolProfile.findOne({summonerId: user.profile.summonerId});
      if(userLolProfile)
        return true;
      else
        return false;
  }
})
