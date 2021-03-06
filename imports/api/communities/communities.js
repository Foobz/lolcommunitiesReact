import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Communities = new Mongo.Collection('Communities');

Communities.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Communities.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

ChampionFocusSchema = new SimpleSchema({
    championId:{
      type:Number
    },
    championName:{
      type:String
    }
});

Communities.schema = new SimpleSchema({
  _id:{
    type:String
  },
  name: {
    type: String,
    label: "name",
    max: 100
  },
  displayName: {
    type: String,
    label: "displayName",
    max: 100
  },
  url: {
    type: String,
    label: "url",
    max: 100,
    optional:true
  },
  urlUserLinkPrefix:{
    type:String,
    label: 'prefix for link to the user profil of the community',
    optional: true
  },
  urlUserLinkPrefixDisplay:{
    type:String,
    label: 'prefix to display to ihm to indicate a link to the user profil of the community',
    optional: true
  },
  picture: {
    type: String,
    label: "picture",
    optional:true
  },
  user_id: {
    type: [String],
    optional: false // need to be instanciante empty
  },
  championFocus:{
    type: ChampionFocusSchema,
    optional: true
  }
});

Communities.attachSchema(Communities.schema);
