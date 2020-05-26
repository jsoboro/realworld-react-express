var mongoose = require('mongoose'),
    autoIncrement = require('mongoose-auto-increment');

var HistorySchema = new mongoose.Schema({
  article: { 
    slug: String,
    title: String,
    description: String,
    body: String,
    favoritesCount: {type: Number, default: 0},
    tagList: [{ type: String }],
    createdAt: Date,
    updatedAt: Date
  }
}, {timestamps: true});

HistorySchema.methods.toJSONFor = function() {
  return {
    _id: this._id,
    article: this.article
  };
};

autoIncrement.initialize(mongoose.connection);
HistorySchema.plugin(autoIncrement.plugin, 'History');
mongoose.model('History', HistorySchema);

