import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const LolProfile = new Mongo.Collection('LolProfile');

//TODO rename en lolInformation, summonerInformation, summonerData, summonerProfil
/*
ile.allow({
  insert: () => true,
  update: () => true,
  remove: () => true,
});
*/

LolProfile.schema = new SimpleSchema({
  server:{
    type:String,
    label:"server",
    allowedValues: ['NA', 'EUW', 'LAN','EUNE', 'BR', 'TR', 'RU', 'LAS', 'OCE', 'KR', 'JP'],
  },
  summonerId: {
    type: String,
    label: "summonerId",
    max: 100
  },
  summonerName: {
    type: String,
    label: "summonerName",
    max: 100
  },
  queue: {
    type:String,
    label:"queue",
    allowedValues: ['RANKED_FLEX_SR', 'RANKED_FLEX_TT', 'RANKED_SOLO_5x5', 'RANKED_TEAM_3x3', 'RANKED_TEAM_5x5', 'UNRANKED']
  },
  tier: {
    type: String,
    label: "tier",
    allowedValues: ['CHALLENGER', 'MASTER', 'DIAMOND', 'PLATINUM', 'GOLD', 'SILVER', 'BRONZE'],
    optional: true
  },
  division: {
    type:String,
    label: 'division',
    allowedValues: ['I', 'II', 'III', 'IV', 'V'],
    optional: true
  },
  wins: {
    type: Number,
    label: "wins",
    optional: true
  },
  leaguePoints: {
    type: Number,
    label: "leaguePoints",
    optional: true
  },
  leagueName: {
    type: String,
    label: "leagueName",
    optional: true
  },
  losses: {
    type: Number,
    label: "losses",
    optional: true
  }
});

LolProfile.attachSchema(LolProfile.schema);
