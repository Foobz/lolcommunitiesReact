import { Communities } from './communities';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Meteor } from 'meteor/meteor';
//import {getSummonerLeague} from '../lolProfile/server/methods';

export const joinCommunity = new ValidatedMethod({
  name: 'community.join',
  validate: null,
  run({_id, userId }) {
    Communities.update(_id, { $push: {user_id: userId} });
    Meteor.users.update(userId, {$push: {'profile.community_id': _id} });



// TODO check si user a déjà un lolProfile.
  // si oui : update son lolProfile
  // si non: insert un lolProfile


    getSummonerLeague.call({server: Meteor.user().profile.server, summonerId: Meteor.user().profile.summonerId},
     (error, result) => {
        if(error)
          console.log("join community error", error);
        else {
          console.log("result getsumleague: ", result);
        }
     });



  },
});


export const leaveCommunity = new ValidatedMethod({
  name: 'community.leave',
  validate: null,
  run({_id, userId }) {
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
