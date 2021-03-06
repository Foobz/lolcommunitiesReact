import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const ChampionStatsHistoValueSchema = new SimpleSchema({
  date:{ // only used for Histo.
    type: String, // easier use to compare on day date: store YYYY-MM-DD
    label: 'date of this histo'
  },
  championId: {
    type:Number,
    label:"championId"
  },
  championPoints:{
    type:Number,
    label:"championPoints"
  },
  championLevel:{
    type:Number,
    label:"championLevel"
  },
  tokensEarned:{
    type:Number,
    label:"tokensEarned"
  },
  totalSessionsPlayed:{
    type:Number,
    label:"totalSessionsPlayed"
  },
  totalSessionsLost:{
    type:Number,
    label:"totalSessionsLost"
  },
  totalSessionsWon:{
    type:Number,
    label:"totalSessionsWon"
  },
  totalChampionKills:{
    type:Number,
    label:"totalChampionKills"
  },
  totalAssists:{
    type:Number,
    label:"totalAssists"
  },
  totalDeathsPerSession:{
    type:Number,
    label:"totalDeathsPerSession"
  },
  totalFirstBlood:{
    type:Number,
    label:"totalFirstBlood"
  },
  totalDoubleKills:{
    type:Number,
    label:"totalDoubleKills"
  },
  totalTripleKills:{
    type:Number,
    label:"totalTripleKills"
  },
  totalQuadraKills:{
    type:Number,
    label:"totalQuadraKills"
  },
  totalPentaKills:{
    type:Number,
    label:"totalPentaKills"
  }
});
