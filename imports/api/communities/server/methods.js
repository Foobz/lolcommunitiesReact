import { Communities } from '../communities';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Meteor } from 'meteor/meteor';
import {createOrUpdateSummonerProfileWithChampion, createOrUpdateSummonerProfile} from '../../lolProfile/server/methods';

const riotApiKey = Meteor.settings.riotApiKey;


const joinCommunityValidator = new SimpleSchema({
  community: { type: Communities.schema },
  user: {type:Object, blackbox:true}, // if no blackbox _id fucked the validation.... ??!!
  userCommunityName: {label: "Your name", type: String, min:3, trim:true}
})

export const joinCommunity = new ValidatedMethod({
  name: 'community.join',
  validate: joinCommunityValidator.validator(),
  run({community, user, userCommunityName }) {

    Communities.update(community._id, { $push: {user_id: user._id} });

    let userCommunity = {'_id': community._id, 'userName': userCommunityName}
    Meteor.users.update(user._id, {$push: {'profile.communities': userCommunity} });

    if(community.championFocus)
      createOrUpdateSummonerProfileWithChampion(user, community.championFocus.championId);
    else
      createOrUpdateSummonerProfile(user);
  }
});

// check if summoner exist and return riot Id.
export const checkSummonerExist = new ValidatedMethod({
  name: 'User.checkSummonerExist',
  validate: new SimpleSchema({
    server: { type: String },
    summonerName: { type: String },
  }).validator(),
  run({ server, summonerName }) {
    server = server.toLowerCase();

    let summonerNameEncoded = encodeURIComponent(summonerName);
    const riotApiUrl = "https://"+server+".api.pvp.net/api/lol/"+server+"/v1.4/summoner/by-name/"+summonerNameEncoded+"?api_key="+riotApiKey;

    try {
      var result = HTTP.call("GET", riotApiUrl);
      const resultSumName = summonerName.toLowerCase().replace(" ","");
      return result.data[resultSumName].id;
    } catch (e) {
      // Got a network error, time-out or HTTP error in the 400 or 500 range.
      console.log("Exception on: "+riotApiUrl);
      console.log(e);
      throw new Meteor.Error('User.checkSummonerExist', 'Cannot find your summoner name at the selected server');
    }
  },
});

export const leaveCommunity = new ValidatedMethod({
  name: 'community.leave',
  validate: null,
  run({_id, userId }) {
    console.log("leave com method server");
    Communities.update(_id, { $pull: {user_id: userId} });
    Meteor.users.update(userId, {$pull: {'profile.community_id': _id} });
  },
});

export const insertCommunity = new ValidatedMethod({
  name: 'communities.insert',
  validate: new SimpleSchema({
    name: { type: String },
    url: { type: String , optional:true},
  }).validator(),
  run(community) {
    Communities.insert(community);
  },
});

export const updateCommunity = new ValidatedMethod({
  name: 'communities.update',
  validate: new SimpleSchema({
    _id: { type: String },
    'update.name': { type: String, optional: false },
    'update.url': { type: String, optional: true },

  }).validator(),
  run({ _id, update }) {
    Communities.update(_id, { $set: update });
  },
});

export const removeCommunity = new ValidatedMethod({
  name: 'communities.remove',
  validate: new SimpleSchema({
    _id: { type: String },
  }).validator(),
  run({ _id }) {
    Communities.remove(_id);
  },
});
